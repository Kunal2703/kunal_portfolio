import { asset, type LocalPost } from './types'

const img = asset('mariadb-cloudsql-bridge')

const html = `
<p>Most database migrations are boring, and they should be. You provision the target, point the vendor's migration tool at the source, wait, and cut over. This is a playbook for the case where that path is closed — and it is closed more often than the documentation suggests.</p>

<h2>When you need this pattern</h2>

<p>Three conditions, taken together, eliminate every supported option:</p>

<ul>
  <li><strong>The source is an engine or version your target's tooling will not accept.</strong> A fork, a legacy release, an appliance database. The connection profile simply refuses to validate.</li>
  <li><strong>You cannot reconfigure the source.</strong> It belongs to a client, a vendor, or a compliance boundary. No restarts, no <code>my.cnf</code> edits, no binlog format changes.</li>
  <li><strong>The dataset is too large to move inside an acceptable maintenance window.</strong> Dump–ship–restore would cost hours the business will not give you.</li>
</ul>

<p>Remove any one of them and you have an easier problem. Hold all three and you need continuous replication running <em>ahead</em> of the cutover, across an engine boundary that no vendor supports.</p>

<p>The worked example throughout is a back-office application on MariaDB 10.11 — two production databases, 290 GB of InnoDB, one table past four and a half million rows — moving onto Cloud SQL for MySQL 8.0 under Terraform, while the client kept trading. The pattern generalises to any pair of engines with a compatible ancestor.</p>

<table>
  <thead><tr><th>Source</th><th>Target</th><th>Payload</th><th>Source changes</th><th>Sustained lag</th></tr></thead>
  <tbody><tr>
    <td>MariaDB 10.11<br>binlog: MIXED</td>
    <td>Cloud SQL<br>MySQL 8.0, HA</td>
    <td>290 GB · 16 tables<br>4.6M-row hot table</td>
    <td>1 read-only<br>replication user</td>
    <td>0 s<br>both hops</td>
  </tr></tbody>
</table>

<h2>Why the supported paths are closed</h2>

<p>MariaDB and MySQL share an ancestor and a wire protocol, and almost nothing else that matters for replication.</p>

<p><strong>Direct replication into MySQL 8.</strong> The two projects diverged on GTIDs years ago: different formats, different semantics, and MySQL 8 will not consume MariaDB's. MariaDB also emits binlog event types that MySQL 8's applier does not recognise. You can sometimes get a handshake. You cannot get a link you would trust with a client's order book.</p>

<p><strong>Database Migration Service pointed at the source.</strong> DMS accepts MySQL 5.6, 5.7 and 8.0 sources. MariaDB is not on the list, and Cloud SQL's own external-source replication carries the same restriction. This is a policy boundary, not a technical one — which means there is no flag to override it.</p>

<p><strong>A change-data-capture pipeline.</strong> Datastream, Debezium and DMS all want <code>binlog_format=ROW</code> at the source. This source runs <code>MIXED</code>, and changing it means editing config and restarting someone else's production database. That should be off the table on principle, not just by instruction.</p>

<p>So: the source cannot be read the way modern tooling wants to read it, and the source cannot be made easier to read. Every remaining option has to sit on your side of the wire.</p>

<h2>The approach: put a translator in the middle</h2>

<p>The general form of the fix: <strong>when A cannot talk to B, introduce a C that both of them accept.</strong> For this engine pair, C is MySQL 5.7.</p>

<p>MySQL 5.7 occupies a narrow and useful position in history. It is old enough to replicate from MariaDB 10.x the classic way — <em>file and position</em>, no GTIDs involved, which sidesteps the incompatibility entirely. And it is unambiguously MySQL, so to DMS it looks like an ordinary, fully supported source.</p>

<p>It also solves the binlog-format problem as a side effect, which is the part worth internalising. Configure it with <code>binlog_format=ROW</code> and <code>log_slave_updates=ON</code> and it does two jobs at once: it applies everything arriving from the source, and it writes what it applied into <em>its own</em> binary log, <em>in its own format</em>. Statement-based events go in; deterministic row events come out. The MIXED → ROW conversion CDC tooling demands happens on hardware you control, and the source configuration is never touched.</p>

<figure>
  <img src="${img('01-the-bridge-pattern.png')}" alt="Direct replication from MariaDB 10.11 to Cloud SQL for MySQL 8.0 is blocked by incompatible GTIDs and unsupported binlog events. The working path routes through a throwaway MySQL 5.7 bridge: hop one is native file-and-position replication, hop two is a DMS dump followed by CDC." loading="lazy" />
  <figcaption>The direct edge does not exist, so we add a hop instead of forcing one. The bridge is deleted at cleanup; only the two end nodes survive.</figcaption>
</figure>

<h2>Reference architecture</h2>

<p>Conceptually it is three nodes. Deployed, it is a dedicated VPC, a Compute Engine instance running the bridge in a container, an SSH tunnel held open by systemd, Private Service Access so Cloud SQL receives a private address on your network, and a DMS job stitching the last two together.</p>

<figure>
  <img src="${img('02-architecture.png')}" alt="Google Cloud architecture: a client MariaDB server outside the cloud connects over an SSH tunnel to a Compute Engine VM running a MySQL 5.7 bridge container in a private subnet. Database Migration Service reads that bridge's binlog and writes into a Cloud SQL for MySQL 8.0 instance reachable over Private Service Access, with VPC peering carrying custom route exports between the two." loading="lazy" />
  <figcaption>DMS is a control plane, not a data path — it reads the bridge's binlog and applies to Cloud SQL, but traffic does not flow "through" it. Resource names are illustrative.</figcaption>
</figure>

<p>Two properties of this layout are worth preserving if you adapt it. The bridge lives in its own VPC and has no public address — it runs an end-of-life engine, so it should be unreachable from anywhere you would not run an EOL engine. And the destination is created inside that same network boundary from the start, so the cutover is a promotion rather than a migration.</p>

<h2>The mechanism that makes it work</h2>

<p>Under <code>MIXED</code>, the source logs most changes as the statement that caused them. That is compact, and it is usually why a server is configured that way — but a statement is only replayable if the replica can guarantee it produces the same result, which is exactly the guarantee a foreign engine cannot make. Row events carry the before and after images of the affected rows instead. Larger, and unambiguous.</p>

<figure>
  <img src="${img('03-binlog-translation.png')}" alt="A statement event from the source binlog is replayed by the MySQL 5.7 bridge. Because the bridge runs ROW binlog format with log_slave_updates enabled, it re-emits the same change as explicit row events carrying before and after images." loading="lazy" />
  <figcaption>The bridge is not a proxy — it is a database that fully materialises the change and then describes it again in a different dialect.</figcaption>
</figure>

<h2>Preflight</h2>

<p>Nine items to settle before the first byte moves. Each one below cost real time when it was discovered late; every one of them is cheap to check up front.</p>

<table>
  <thead><tr><th>Check</th><th>Why it matters</th></tr></thead>
  <tbody>
    <tr><td><strong>Capacity in your actual region and account</strong></td><td>Managed database SKUs are quota- and capacity-gated per region and per subscription. Confirm you can create the instance you designed for before you design around it — discovering this during provisioning costs a re-platform.</td></tr>
    <tr><td><strong>Restored footprint, not archive size</strong></td><td>A compressed dump expands roughly nine to one once loaded and indexed. Size every disk in the chain for the restored footprint. Disks grow live but never shrink.</td></tr>
    <tr><td><strong>Dump transport</strong></td><td>Streaming <code>mysqldump</code> over a long link stalls once the consumer falls behind, and the server closes the socket at <code>net_write_timeout</code> (60 s by default). Dump to a local file on the source and copy the finished artifact — faster, and it needs no source-side change.</td></tr>
    <tr><td><strong>DEFINER audit</strong></td><td>Any view, trigger or routine carrying <code>DEFINER=root@localhost</code> fails on Cloud SQL, which has no such account. Rewrite as <code>DEFINER=root@%</code> with <code>SQL SECURITY INVOKER</code> before the migration starts, not when it errors.</td></tr>
    <tr><td><strong>Replication grants, in full</strong></td><td><code>SELECT</code>, <code>RELOAD</code>, <code>SHOW DATABASES</code>, <code>REPLICATION SLAVE</code>, <code>REPLICATION CLIENT</code>, <code>LOCK TABLES</code>, <code>EXECUTE</code>, <code>SHOW VIEW</code>, <code>TRIGGER</code>. Omit the last and your triggers silently do not migrate.</td></tr>
    <tr><td><strong>Private routing, not just peering</strong></td><td>A <code>servicenetworking</code> peering does not by itself propagate routes to your subnets. Enable custom route export and import on it. This failure presents as a bare connection timeout with nothing in the logs pointing at routing.</td></tr>
    <tr><td><strong>Transport security, decided and recorded</strong></td><td>Modern TLS clients reject the self-signed certificate MySQL 5.7 generates on first start. Either stand up a CA, or accept an unencrypted hop and justify it: private peering, no public IP at either end, one firewall rule, one port, a component with a scheduled deletion date. Write down which you chose and why.</td></tr>
    <tr><td><strong>Image networking</strong></td><td>Pin package managers to IPv4 if the VPC has no IPv6 route. Otherwise <code>apt</code> and cloud-init hang on a fresh instance with no useful error.</td></tr>
    <tr><td><strong>Credential handling in the console</strong></td><td>Editing a DMS connection profile clears its stored password. Re-enter credentials and re-run the connectivity test after <em>any</em> profile edit, or you will debug a routing problem that is actually an empty password.</td></tr>
  </tbody>
</table>

<p>The pattern across that list: almost none of these are database problems. They are networking, TLS, quota and permission problems wearing a database costume. Budget time accordingly.</p>

<h2>Stage 1 — Establish the bridge</h2>

<p>Continuous replication is only meaningful if it starts from a known-consistent snapshot at a known binlog coordinate. Everything downstream inherits that correctness — or inherits the lack of it, silently, and you discover it days later when counts diverge.</p>

<pre><code># run on the source; InnoDB only
mysqldump --single-transaction --master-data=2 \\
          --routines --triggers --events \\
          --databases app_prod integration_prod \\
        | gzip &gt; /var/backups/snapshot.sql.gz</code></pre>

<p><code>--single-transaction</code> gives a consistent read view without locking tables for the duration. <code>--master-data=2</code> is the one that matters: it records the exact binlog file and position of that snapshot as a comment in the dump. That coordinate is the seam where the snapshot ends and replication must begin, and losing it means starting over.</p>

<pre><code>-- the entire purpose of this instance, in four lines
server_id         = 57
log_bin           = /var/lib/mysql/bridge-bin
binlog_format     = ROW          -- convert here, not at the source
log_slave_updates = ON           -- re-log what we replicate</code></pre>

<pre><code>CHANGE MASTER TO
  MASTER_HOST     = '172.17.0.1',  -- the tunnel, from inside the container
  MASTER_PORT     = 13306,
  MASTER_USER     = 'repl_app',
  MASTER_LOG_FILE = 'mysql-bin.000217',
  MASTER_LOG_POS  = 418203946;     -- the seam from --master-data=2

START SLAVE;</code></pre>

<p>Expect the restore to be the slowest step and the disk to be the first thing that breaks. Once loaded, the bridge works through the accumulated backlog and settles at zero seconds behind the source. Do not proceed until it has.</p>

<h2>Stage 2 — Hand DMS a source it accepts</h2>

<p>With a healthy MySQL 5.7 replica in place, the second leg is the well-trodden path DMS was built for: a connection profile against a MySQL source, a full dump into a destination DMS provisions itself, then an automatic transition into continuous CDC from that source's binlog.</p>

<p>One structural detail confuses people on first contact. While the job runs you see <em>two</em> Cloud SQL entries. One is a <strong>source representation instance</strong> — metadata only, no compute, no cost, listed as an external primary, standing in for the bridge. The other is the real destination, which DMS creates as a <strong>read replica</strong> of that stub. Promotion converts the replica into a standalone primary; the stub is deleted with the job.</p>

<figure>
  <img src="${img('04-dms-job.png')}" alt="A detailed view of the Database Migration Service job: the three objects it creates and which of them is real, the four phases of its lifecycle from setup through full dump and CDC to promotion, and the topology change that promotion causes." loading="lazy" />
  <figcaption>The source representation instance appears in the console alongside a real database but holds nothing and costs nothing. Note where the data actually travels — during CDC the destination replicates straight from the bridge.</figcaption>
</figure>

<p>Throughput during the full dump is a property of the destination instance, not the dataset — ours held around 2.5 GB per minute. Size the window from your own restored footprint at that rate, and watch the destination's disk usage rather than any percentage the console offers.</p>

<h2>Stage 3 — Hold steady state, and prove it</h2>

<p>This is where the method earns its name. The chain is live, the business is trading, and the migration is simply <em>waiting</em> — for a maintenance window, for a release freeze, for a stakeholder. Ours held this state for days. There is no penalty for holding it longer, provided you keep proving it.</p>

<p>A replication chain that reports healthy is not the same as a chain that is correct, and two hops give you two places to be quietly wrong. Verify at four levels, and re-run the whole set after every configuration change:</p>

<ul>
  <li><strong>Row counts at both ends of the whole chain.</strong> Source compared directly against the destination, never against the bridge. The bridge agreeing with itself proves nothing.</li>
  <li><strong>Lag on each hop independently.</strong> <code>Seconds_Behind_Master</code> on the bridge, and the DMS replication-delay metric on the destination. A stalled first hop behind a healthy second hop looks perfectly fine from the target.</li>
  <li><strong>A live write probe.</strong> Write a canary row at the source, time its arrival at the destination. This is the only check that exercises every link at once, and the one that actually convinces people.</li>
  <li><strong>Storage growth as the progress gauge.</strong> During the bulk load, <code>database/disk/bytes_used</code> on the destination is the honest indicator. <code>replication-setup.log</code> is where the dump, lock and CDC transition events appear.</li>
</ul>

<figure>
  <img src="${img('05-live-traffic.png')}" alt="While the migration runs, the application keeps writing live transactions into the source MariaDB. Each commit appends a binlog event, the MySQL 5.7 bridge pulls and applies it and re-logs it as row events, and Cloud SQL applies those in turn. Row counts at both ends match and both replication hops report zero lag." loading="lazy" />
  <figcaption>Zero downtime comes from the app never being asked to wait; zero data loss comes from the chain never being allowed to drift. Table names and per-table counts are illustrative.</figcaption>
</figure>

<blockquote><strong>Worth knowing.</strong> Row counts catch missing rows, not wrong ones. For the final pre-cutover check against a quiesced source, <code>CHECKSUM TABLE</code> — or a tool that checksums chunk by chunk on live data — is the stronger proof. Counts are for continuous monitoring; checksums are for the go/no-go decision.</blockquote>

<h2>Stage 4 — Cut over</h2>

<p>Because replication has been live and verified for days, the cutover collapses into a short, rehearsed sequence. The long and risky part of the migration is already finished — it happened while the business carried on trading.</p>

<ol>
  <li><strong>Freeze writes at the source.</strong> Stop crons and background workers, put the application in maintenance mode. This is the only window the business feels.</li>
  <li><strong>Confirm both hops report zero lag.</strong> Then run a final count-and-checksum comparison against the now-static source.</li>
  <li><strong>Promote the DMS job.</strong> <code>gcloud database-migration migration-jobs promote app-db-bridge --region=europe-west2</code></li>
  <li><strong>Re-point the application.</strong> New database host in the application and integration config, then flip DNS to the app host.</li>
  <li><strong>Smoke-test writes on the new primary.</strong> A real transaction through the real code path, not a <code>SELECT 1</code>.</li>
  <li><strong>Tear down the scaffolding.</strong> Delete the migration job and the source representation instance, destroy the bridge container and its VM, close the SSH tunnel, drop the replication user at the source, remove the temporary firewall rule and the tunnel public key.</li>
  <li><strong>Import the instance into Terraform.</strong> And reconcile until the plan is clean.</li>
</ol>

<blockquote><strong>One-way door.</strong> Promotion is irreversible. It severs CDC permanently, and every write the source takes afterwards is a write the destination will never see. Do not promote to check that it works — promote when the application is ready to move in the same maintenance window. Everything before this step is reversible; nothing after it is.</blockquote>

<h2>Stage 5 — Reconcile into infrastructure as code</h2>

<p>DMS creates the destination instance itself, so it is born <em>outside</em> Terraform state. That quietly conflicts with any requirement to end up fully IaC-managed, and it is the step most write-ups omit.</p>

<p>It takes three moves. Define the instance in Terraform and apply it, then destroy it — purely to reserve and then free the name, since DMS insists on creating its own. Let DMS create the real instance under that name and run the migration. Then, after promotion, <code>terraform import</code> brings the live instance into state as a <code>google_sql_database_instance</code>, and the configuration is adjusted until <code>terraform plan</code> reports no changes.</p>

<p>The care goes into that last step. DMS sets flags, maintenance windows and backup configuration you did not write down, and a naive plan will cheerfully propose replacing your production database to reconcile them. Read every line of the first plan. Adjust the configuration to match reality, not reality to match the configuration.</p>

<h2>Decision record</h2>

<p>The choices worth carrying forward, and the reasoning behind each. Re-derive these for your own engine pair rather than copying them.</p>

<table>
  <thead><tr><th>Decision</th><th>Choice, and why</th></tr></thead>
  <tbody>
    <tr><td><strong>Bridge engine</strong></td><td><strong>MySQL 5.7.</strong> The newest version still lenient enough to replicate from MariaDB 10.x by file and position, and the oldest the migration service still accepts as a source. That overlap is the whole pattern — find the equivalent version for your pair.</td></tr>
    <tr><td><strong>Where the format conversion happens</strong></td><td><strong>On the bridge.</strong> <code>log_slave_updates</code> plus <code>binlog_format=ROW</code> moves the MIXED → ROW conversion onto infrastructure you own, which is what makes "no source-side changes" achievable rather than aspirational.</td></tr>
    <tr><td><strong>Bridge lifetime</strong></td><td><strong>Throwaway.</strong> An end-of-life engine that never serves traffic, lives in an isolated VPC with no public address, and is destroyed at cutover. Treat its existence as a scheduled debt, not a component.</td></tr>
    <tr><td><strong>Transport between bridge and destination</strong></td><td><strong>Unencrypted over private peering.</strong> Defensible for a temporary component on a path with no public exposure; not defensible anywhere else. The alternative — a CA for a machine with a one-week lifespan — buys less than it costs.</td></tr>
    <tr><td><strong>Who creates the destination</strong></td><td><strong>DMS, then imported.</strong> The service insists on creating the instance it manages. Reserving the name in Terraform first, then importing after promotion, is the shortest path back to a clean plan.</td></tr>
    <tr><td><strong>Cutover trigger</strong></td><td><strong>Manual, in a maintenance window.</strong> Promotion is irreversible and instant. Nothing about it should be automated or scheduled.</td></tr>
  </tbody>
</table>

<h2>Applying this elsewhere</h2>

<p>The cost is real: a VM and a second full copy of the data for the duration, an end-of-life engine on your network, and a chain where two links can fail independently and one can mask the other. The verification discipline in Stage 3 is not optional — it is what you buy with the downtime you saved.</p>

<h3>Reach for it when</h3>
<ul>
  <li>The source is a fork or an old version your target's tooling refuses</li>
  <li>You cannot modify the source — someone else's production, a vendor appliance, a compliance boundary</li>
  <li>The dataset exceeds any maintenance window you can negotiate</li>
  <li>The cutover date is uncertain and you need to hold a ready state</li>
</ul>

<h3>Do something simpler when</h3>
<ul>
  <li>Source and target are directly compatible — use the supported path</li>
  <li>You control the source and can switch it to ROW binlog</li>
  <li>The data fits in a window you already have</li>
  <li>Nobody will maintain the verification discipline the chain requires</li>
</ul>

<p>The transferable idea is not about MySQL. When a vendor calls a migration path unsupported, they are describing the edge of what they will <em>help</em> you with, not the edge of what is possible. The gap between two incompatible systems can usually be closed by a third system compatible with both — even, and sometimes especially, one you would never willingly run in production.</p>

<hr />

<p><em>Project, VPC, instance, database, table and host names — and the per-table counts shown in the diagrams — are illustrative. Engine versions, timings, error conditions and failure modes are as observed.</em></p>
`

export const mariadbCloudsql57Bridge: LocalPost = {
    slug: 'zero-downtime-mariadb-to-cloud-sql-mysql-8-migration-57-bridge',
    title: 'The 5.7 Bridge: Zero-Downtime MariaDB to Cloud SQL for MySQL 8 Migration',
    subtitle:
        'A repeatable method for migrating a live database you do not control onto a managed service that will not accept it — without touching the source, and without asking the business to stop.',
    brief:
        'MariaDB 10.11 cannot replicate into Cloud SQL for MySQL 8.0, and DMS will not accept a MariaDB source. This playbook routes around both with a throwaway MySQL 5.7 bridge that converts MIXED binlog to ROW on infrastructure you own — 290 GB migrated with zero downtime, zero source-side config changes, and 0 s lag held for days before cutover.',
    coverImage: img('02-architecture.png'),
    publishedAt: '2026-08-26',
    readTime: 15,
    tags: [
        'database-migration',
        'mariadb',
        'mysql',
        'gcp',
        'cloud-sql',
        'dms',
        'zero-downtime',
        'replication',
        'terraform',
        'devops',
    ],
    html,
}
