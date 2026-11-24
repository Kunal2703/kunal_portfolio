import { asset, type LocalPost } from './types'

const img = asset('gcp-aws-ha-vpn')

const html = `
<p>Connecting two clouds with a VPN sounds like a one-tunnel job. It isn't, if you want it to survive a gateway maintenance window. Google and AWS build redundancy in different ways, and the way the two models fit together decides the shape of this setup: four IPsec tunnels, four BGP sessions, and one address plan that keeps it all straight.</p>

<p>Everything here runs from the CLI, so every step is repeatable and reviewable. Each step has a diagram of what it adds and an example of what you should see. The lab connects one VPC in Mumbai on each side; the same steps work in any region pair.</p>

<table>
  <thead><tr><th>IPsec tunnels</th><th>BGP sessions</th><th>AWS customer gateways</th><th>GCP HA VPN gateways</th><th>GCP SLA</th></tr></thead>
  <tbody><tr><td>4 (IKEv2)</td><td>4, on one Cloud Router</td><td>2, plus 2 VPN connections</td><td>1, with two interfaces</td><td>99.99% when both interfaces are used</td></tr></tbody>
</table>

<figure>
  <img src="${img('architecture.svg')}" alt="Google Cloud project in asia-south1 with VPC gcp-vpc, subnet 10.10.0.0/20 with a VM, a firewall rule, Cloud Router ASN 65010, Secret Manager and an HA VPN gateway with interfaces 203.0.113.10 and 203.0.113.20. AWS Cloud in ap-south-1 with VPC 10.20.0.0/16, a private subnet with an EC2 instance, a route table that learns 10.10.0.0/20 from BGP, a virtual private gateway ASN 64600 with four tunnel endpoints, and customer gateways cgw-a and cgw-b. Four tunnels, T0 to T3, cross the internet as VPN connections A and B." />
  <figcaption>Figure 1. The finished build. Addresses come from the RFC 5737 documentation ranges and private space; your gateway IPs will be the ones Google and AWS assign. Icons: official Google Cloud and AWS Architecture icon sets.</figcaption>
</figure>

<h2>Why four tunnels</h2>

<p>A GCP <strong>HA VPN gateway</strong> has two interfaces, each with its own public IP. Google only commits to the 99.99% SLA when traffic can use both.</p>

<p>An AWS <strong>Site-to-Site VPN connection</strong> always has two tunnels, on two different AWS endpoints. But one connection points at exactly one <strong>customer gateway</strong>, and a customer gateway is one public IP. So a single connection can only ever reach one GCP interface. Two GCP interfaces need two customer gateways, so two connections, so four tunnels.</p>

<figure>
  <img src="${img('why-one-connection.svg')}" style="max-width: 560px; margin-inline: auto" alt="One AWS VPN connection: both tunnels land on GCP interface 0, and interface 1 is idle." />
  <figcaption>Figure 2a. One connection: both tunnels share interface 0. If it goes away during Google maintenance, both drop together, and the SLA doesn't apply.</figcaption>
</figure>

<figure>
  <img src="${img('why-two-connections.svg')}" style="max-width: 560px; margin-inline: auto" alt="Two AWS VPN connections: interface 0 connects to both tunnels of connection A, interface 1 to both tunnels of connection B." />
  <figcaption>Figure 2b. Two connections: each GCP interface gets its own customer gateway, and each AWS connection still gives you two endpoints. This is the 99.99% configuration.</figcaption>
</figure>

<h2>The address plan</h2>

<p>Write this table before you touch either cloud. Every later step reads from it, and most broken GCP–AWS VPNs come down to one swapped value in it.</p>

<table>
  <thead><tr><th>Tunnel</th><th>GCP interface</th><th>AWS connection</th><th>AWS outside IP</th><th>Inside CIDR</th><th>Cloud Router IP</th><th>AWS BGP IP</th></tr></thead>
  <tbody>
    <tr><td><strong>T0</strong></td><td><code>int 0 · 203.0.113.10</code></td><td>A · tunnel 1</td><td><code>198.51.100.11</code></td><td><code>169.254.10.0/30</code></td><td><code>169.254.10.2</code></td><td><code>169.254.10.1</code></td></tr>
    <tr><td><strong>T1</strong></td><td><code>int 0 · 203.0.113.10</code></td><td>A · tunnel 2</td><td><code>198.51.100.12</code></td><td><code>169.254.10.4/30</code></td><td><code>169.254.10.6</code></td><td><code>169.254.10.5</code></td></tr>
    <tr><td><strong>T2</strong></td><td><code>int 1 · 203.0.113.20</code></td><td>B · tunnel 1</td><td><code>192.0.2.21</code></td><td><code>169.254.11.0/30</code></td><td><code>169.254.11.2</code></td><td><code>169.254.11.1</code></td></tr>
    <tr><td><strong>T3</strong></td><td><code>int 1 · 203.0.113.20</code></td><td>B · tunnel 2</td><td><code>192.0.2.22</code></td><td><code>169.254.11.4/30</code></td><td><code>169.254.11.6</code></td><td><code>169.254.11.5</code></td></tr>
  </tbody>
</table>

<table>
  <thead><tr><th>Setting</th><th>GCP</th><th>AWS</th></tr></thead>
  <tbody>
    <tr><td>Region</td><td><code>asia-south1</code></td><td><code>ap-south-1</code></td></tr>
    <tr><td>VPC range</td><td><code>10.10.0.0/20</code> (gcp-subnet-a)</td><td><code>10.20.0.0/16</code> (aws-subnet-a: <code>10.20.1.0/24</code>)</td></tr>
    <tr><td>BGP ASN</td><td><code>65010</code> (Cloud Router)</td><td><code>64600</code> (virtual private gateway)</td></tr>
    <tr><td>Who uses whose ASN</td><td>BGP peers use <code>--peer-asn=64600</code></td><td>Customer gateways use <code>--bgp-asn 65010</code></td></tr>
    <tr><td>IKE / crypto</td><td colspan="2">IKEv2 · AES-256 · SHA2-256 · DH group 14 (phase 1 and 2)</td></tr>
  </tbody>
</table>

<h2>What travels in a tunnel</h2>

<p>Each tunnel has two pairs of addresses. The <strong>outside</strong> pair is public: the GCP interface IP and the AWS endpoint IP, which is what the internet sees. The <strong>inside</strong> pair is a link-local <code>/30</code> that exists only inside the tunnel, and BGP runs over it. Here is T0 on the wire:</p>

<table>
  <thead><tr><th>Layer</th><th>Visible to</th><th>Contents</th></tr></thead>
  <tbody>
    <tr><td>Outer IP header</td><td>The internet</td><td><code>203.0.113.10 → 198.51.100.11</code></td></tr>
    <tr><td>ESP</td><td>Encrypted</td><td>AES-256 / SHA2-256</td></tr>
    <tr><td>Inner packet</td><td>Only the two gateways</td><td>BGP <code>169.254.10.2 ↔ 169.254.10.1</code> on TCP 179, and application traffic <code>10.10.0.5 → 10.20.1.10</code></td></tr>
  </tbody>
</table>

<p>Inside each <code>/30</code>, AWS always takes the first usable address, so the Cloud Router gets the second:</p>

<table>
  <thead><tr><th><code>169.254.10.0</code></th><th><code>169.254.10.1</code></th><th><code>169.254.10.2</code></th><th><code>169.254.10.3</code></th></tr></thead>
  <tbody><tr><td>network</td><td>AWS VGW (BGP peer)</td><td>Cloud Router interface</td><td>broadcast</td></tr></tbody>
</table>

<h2>Build order</h2>

<p>Each cloud needs IPs the other one creates. GCP's two interface IPs go into the AWS customer gateways. AWS's four endpoint IPs go into GCP's peer gateway. That hand-off decides the order:</p>

<figure>
  <img src="${img('build-order.svg')}" alt="Swimlane diagram: GCP steps 1, 2, 6 and 7, AWS steps 3, 4 and 5. GCP interface IPs flow from step 2 into step 4; AWS endpoint IPs flow from step 5 into step 6." />
  <figcaption>Figure 3. Seven steps across two clouds. Step 3 doesn't depend on GCP, so it can run in parallel with steps 1–2. The inside CIDRs and pre-shared keys come from your plan, not from either cloud.</figcaption>
</figure>

<p>The commands below assume an authenticated <code>gcloud</code> and <code>aws</code> CLI with the right project and region selected, and shell variables <code>$VPC</code> and <code>$RTB</code> holding your AWS VPC and route table IDs. In each step's diagram, orange marks what the step adds, and faded boxes come later.</p>

<h3>Step 1 · Create the GCP network and firewall (GCP)</h3>

<p>Custom subnet mode, and a firewall rule that lets in only the AWS range. IPsec itself needs no firewall rule on GCP; the VPN gateway handles it.</p>

<figure>
  <img src="${img('step-1.svg')}" alt="Build state after step 1: the GCP VPC and firewall rule are new; everything else comes later." />
  <figcaption>After step 1: the GCP VPC, its subnet, and a firewall rule scoped to the AWS range.</figcaption>
</figure>

<pre><code>gcloud compute networks create gcp-vpc \\
  --subnet-mode=custom --bgp-routing-mode=regional

gcloud compute networks subnets create gcp-subnet-a \\
  --network=gcp-vpc --region=asia-south1 --range=10.10.0.0/20

# Only the AWS VPC range, and only the ports you need
gcloud compute firewall-rules create allow-from-aws \\
  --network=gcp-vpc --direction=INGRESS \\
  --source-ranges=10.20.0.0/16 --allow=icmp,tcp:22,tcp:443</code></pre>

<p>Example output:</p>

<pre><code>Created [https://www.googleapis.com/compute/v1/projects/kunal-net-lab/global/networks/gcp-vpc].
NAME     SUBNET_MODE  BGP_ROUTING_MODE
gcp-vpc  CUSTOM       REGIONAL

NAME          REGION       NETWORK  RANGE
gcp-subnet-a  asia-south1  gcp-vpc  10.10.0.0/20

NAME            NETWORK  DIRECTION  PRIORITY  ALLOW
allow-from-aws  gcp-vpc  INGRESS    1000      icmp,tcp:22,tcp:443</code></pre>

<h3>Step 2 · Create the Cloud Router and HA VPN gateway (GCP)</h3>

<p>The gateway gets two public IPs as soon as it exists. Write them into your plan; they become the two AWS customer gateways in step 4.</p>

<figure>
  <img src="${img('step-2.svg')}" alt="Build state after step 2: Cloud Router cr-aws and HA VPN gateway ha-vpn-gw are new." />
  <figcaption>After step 2: the Cloud Router (ASN 65010) and the HA VPN gateway with its two public IPs.</figcaption>
</figure>

<pre><code>gcloud compute routers create cr-aws \\
  --network=gcp-vpc --region=asia-south1 --asn=65010

gcloud compute vpn-gateways create ha-vpn-gw \\
  --network=gcp-vpc --region=asia-south1

gcloud compute vpn-gateways describe ha-vpn-gw --region=asia-south1 \\
  --format="value(vpnInterfaces[].ipAddress)"</code></pre>

<p>Example output:</p>

<pre><code>NAME    NETWORK  REGION
cr-aws  gcp-vpc  asia-south1

NAME       INTERFACE0    INTERFACE1    NETWORK  REGION
ha-vpn-gw  203.0.113.10  203.0.113.20  gcp-vpc  asia-south1

203.0.113.10;203.0.113.20          # int 0 ; int 1</code></pre>

<h3>Step 3 · Create the virtual private gateway and turn on propagation (AWS)</h3>

<p>The VPC and subnet already exist. Route propagation is off by default; without it the route table never learns the GCP range, even when BGP is up.</p>

<figure>
  <img src="${img('step-3.svg')}" alt="Build state after step 3: virtual private gateway vgw-gcp and route table propagation are new." />
  <figcaption>After step 3: the virtual private gateway (ASN 64600), attached to the existing VPC, with route propagation on.</figcaption>
</figure>

<pre><code>VGW=$(aws ec2 create-vpn-gateway --type ipsec.1 --amazon-side-asn 64600 \\
  --query 'VpnGateway.VpnGatewayId' --output text)

aws ec2 attach-vpn-gateway --vpn-gateway-id "$VGW" --vpc-id "$VPC"
aws ec2 enable-vgw-route-propagation --route-table-id "$RTB" --gateway-id "$VGW"

aws ec2 describe-vpn-gateways --vpn-gateway-ids "$VGW" \\
  --query 'VpnGateways[0].[VpnGatewayId,AmazonSideAsn,VpcAttachments[0].State]' --output text</code></pre>

<p>Example output:</p>

<pre><code>vgw-0a1b2c3d4e5f60718    64600    attached</code></pre>

<h3>Step 4 · Create two customer gateways (AWS)</h3>

<p>A customer gateway is AWS's record of the far end. Create one per GCP interface, both with the Cloud Router's ASN.</p>

<figure>
  <img src="${img('step-4.svg')}" alt="Build state after step 4: customer gateways cgw-a and cgw-b are new, fed by the GCP interface IPs." />
  <figcaption>After step 4: two customer gateways, AWS's records of GCP interface 0 and interface 1.</figcaption>
</figure>

<pre><code>CGW_A=$(aws ec2 create-customer-gateway --type ipsec.1 --bgp-asn 65010 \\
  --ip-address 203.0.113.10 \\
  --tag-specifications 'ResourceType=customer-gateway,Tags=[{Key=Name,Value=cgw-a}]' \\
  --query 'CustomerGateway.CustomerGatewayId' --output text)

CGW_B=$(aws ec2 create-customer-gateway --type ipsec.1 --bgp-asn 65010 \\
  --ip-address 203.0.113.20 \\
  --tag-specifications 'ResourceType=customer-gateway,Tags=[{Key=Name,Value=cgw-b}]' \\
  --query 'CustomerGateway.CustomerGatewayId' --output text)

aws ec2 describe-customer-gateways --customer-gateway-ids "$CGW_A" "$CGW_B" \\
  --query 'CustomerGateways[].[CustomerGatewayId,IpAddress,BgpAsn,State]' --output table</code></pre>

<p>Example output:</p>

<pre><code>-----------------------------------------------------------------
|                   DescribeCustomerGateways                    |
+------------------------+----------------+--------+------------+
|  cgw-0aa11bb22cc33dd44 |  203.0.113.10  |  65010 |  available |
|  cgw-0ee55ff66aa77bb88 |  203.0.113.20  |  65010 |  available |
+------------------------+----------------+--------+------------+</code></pre>

<h3>Step 5 · Create two VPN connections with explicit tunnel options (AWS)</h3>

<p>Set the inside CIDRs and pre-shared keys yourself so they match the plan. AWS keys must be 8–64 characters from letters, digits, <code>.</code> and <code>_</code>, and can't start with <code>0</code>; the <code>k</code> prefix below handles that. Keep keys in a secret store, never in a ticket or a screenshot.</p>

<figure>
  <img src="${img('step-5.svg')}" alt="Build state after step 5: VPN connections vpn-a and vpn-b with four endpoints are new." />
  <figcaption>After step 5: VPN connections A and B, which give AWS four tunnel endpoints using your inside CIDRs and keys.</figcaption>
</figure>

<pre><code>for t in 0 1 2 3; do
  printf 'k%s' "$(openssl rand -hex 20)" | gcloud secrets create "vpn-psk-t$t" --data-file=-
done
export PSK0=$(gcloud secrets versions access latest --secret=vpn-psk-t0)   # and PSK1–PSK3</code></pre>

<p><code>vpn-a.json</code>, connection A (T0 and T1):</p>

<pre><code>{
  "StaticRoutesOnly": false,
  "TunnelOptions": [
    {
      "TunnelInsideCidr": "169.254.10.0/30",
      "PreSharedKey": "\${PSK0}",
      "IKEVersions": [{ "Value": "ikev2" }],
      "Phase1EncryptionAlgorithms": [{ "Value": "AES256" }],
      "Phase2EncryptionAlgorithms": [{ "Value": "AES256" }],
      "Phase1IntegrityAlgorithms": [{ "Value": "SHA2-256" }],
      "Phase2IntegrityAlgorithms": [{ "Value": "SHA2-256" }],
      "Phase1DHGroupNumbers": [{ "Value": 14 }],
      "Phase2DHGroupNumbers": [{ "Value": 14 }]
    },
    {
      "TunnelInsideCidr": "169.254.10.4/30",
      "PreSharedKey": "\${PSK1}",
      … same IKE and crypto options as above …
    }
  ]
}</code></pre>

<pre><code># vpn-b.json is the same with 169.254.11.0/30, 169.254.11.4/30, PSK2 and PSK3
VPN_A=$(aws ec2 create-vpn-connection --type ipsec.1 \\
  --customer-gateway-id "$CGW_A" --vpn-gateway-id "$VGW" \\
  --options "$(envsubst &lt; vpn-a.json)" \\
  --query 'VpnConnection.VpnConnectionId' --output text)

VPN_B=$(aws ec2 create-vpn-connection --type ipsec.1 \\
  --customer-gateway-id "$CGW_B" --vpn-gateway-id "$VGW" \\
  --options "$(envsubst &lt; vpn-b.json)" \\
  --query 'VpnConnection.VpnConnectionId' --output text)

aws ec2 describe-vpn-connections --vpn-connection-ids "$VPN_A" "$VPN_B" \\
  --query 'VpnConnections[].Options.TunnelOptions[].[TunnelInsideCidr,OutsideIpAddress]' \\
  --output table</code></pre>

<p>Example output:</p>

<pre><code>-------------------------------------
|      DescribeVpnConnections       |
+------------------+----------------+
|  169.254.10.0/30 |  198.51.100.11 |   # T0
|  169.254.10.4/30 |  198.51.100.12 |   # T1
|  169.254.11.0/30 |  192.0.2.21    |   # T2
|  169.254.11.4/30 |  192.0.2.22    |   # T3
+------------------+----------------+</code></pre>

<blockquote><p><strong>Don't copy crypto settings from the downloaded config file.</strong> AWS's generic sample configurations can show older defaults (SHA-1, AES-128, DH group 2) that don't reflect the options you set. Your tunnel options in the API are what count.</p></blockquote>

<h3>Step 6 · Describe AWS to GCP and create the four tunnels (GCP)</h3>

<p>The peer VPN gateway has four interfaces, one per AWS endpoint. Interfaces 0 and 1 are connection A and pair with GCP interface 0. Interfaces 2 and 3 are connection B and pair with GCP interface 1.</p>

<figure>
  <img src="${img('step-6.svg')}" alt="Build state after step 6: the peer VPN gateway aws-peer-gw and four tunnels are new, fed by the AWS endpoint IPs." />
  <figcaption>After step 6: the peer VPN gateway on GCP and the four IPsec tunnels. The tunnels are up, but nothing is routed yet.</figcaption>
</figure>

<pre><code>gcloud compute external-vpn-gateways create aws-peer-gw \\
  --interfaces 0=198.51.100.11,1=198.51.100.12,2=192.0.2.21,3=192.0.2.22

#  tunnel    gcp-if peer-if key
while read -r name gif pif key; do
  gcloud compute vpn-tunnels create "$name" \\
    --region=asia-south1 --vpn-gateway=ha-vpn-gw --interface="$gif" \\
    --peer-external-gateway=aws-peer-gw --peer-external-gateway-interface="$pif" \\
    --ike-version=2 --shared-secret="$key" --router=cr-aws
done &lt;&lt;EOF
tunnel-t0 0 0 $PSK0
tunnel-t1 0 1 $PSK1
tunnel-t2 1 2 $PSK2
tunnel-t3 1 3 $PSK3
EOF

gcloud compute vpn-tunnels list --filter="region:asia-south1" \\
  --format="table(name,status,detailedStatus)"</code></pre>

<p>Example output:</p>

<pre><code>NAME       STATUS       DETAILED_STATUS
tunnel-t0  ESTABLISHED  Tunnel is up and running.
tunnel-t1  ESTABLISHED  Tunnel is up and running.
tunnel-t2  ESTABLISHED  Tunnel is up and running.
tunnel-t3  ESTABLISHED  Tunnel is up and running.</code></pre>

<p>No BGP session exists yet, so neither side knows the other's range.</p>

<h3>Step 7 · Add the Cloud Router interfaces and BGP peers (GCP)</h3>

<p>One router interface and one BGP peer per tunnel. The Cloud Router takes the <code>.2</code> or <code>.6</code> address; the peer is AWS's <code>.1</code> or <code>.5</code>.</p>

<figure>
  <img src="${img('step-7.svg')}" alt="Build state after step 7: four BGP sessions are up; the Cloud Router learns 10.20.0.0/16 and the AWS route table learns 10.10.0.0/20." />
  <figcaption>After step 7: four BGP sessions. GCP learns 10.20.0.0/16, and the AWS route table learns 10.10.0.0/20.</figcaption>
</figure>

<pre><code>while read -r t cr_ip aws_ip; do
  gcloud compute routers add-interface cr-aws --region=asia-south1 \\
    --interface-name="if-$t" --vpn-tunnel="tunnel-$t" \\
    --ip-address="$cr_ip" --mask-length=30

  gcloud compute routers add-bgp-peer cr-aws --region=asia-south1 \\
    --peer-name="aws-$t" --interface="if-$t" \\
    --peer-ip-address="$aws_ip" --peer-asn=64600
done &lt;&lt;EOF
t0 169.254.10.2 169.254.10.1
t1 169.254.10.6 169.254.10.5
t2 169.254.11.2 169.254.11.1
t3 169.254.11.6 169.254.11.5
EOF</code></pre>

<p>Example output of <code>gcloud compute routers get-status cr-aws --region=asia-south1</code>:</p>

<pre><code>result:
  bestRoutesForRouter:
  - destRange: 10.20.0.0/16
    nextHopIp: 169.254.10.1
    priority: 100
  # … plus the same prefix via .10.5, .11.1 and .11.5
  bgpPeerStatus:
  - name: aws-t0
    ipAddress: 169.254.10.2
    peerIpAddress: 169.254.10.1
    state: Established
    status: UP
    numLearnedRoutes: 1
  # … aws-t1, aws-t2 and aws-t3 look the same</code></pre>

<h2>How the routes get exchanged</h2>

<p>Once a session is up, each side tells the other which ranges it can reach. This is the same for all four tunnels; T0 is shown.</p>

<figure>
  <img src="${img('bgp-exchange.svg')}" alt="Sequence diagram: Cloud Router and VGW open a BGP session inside T0; the Cloud Router advertises 10.10.0.0/20, which AWS propagates into the route table; the VGW advertises 10.20.0.0/16, which GCP installs as a dynamic route over four tunnels." />
  <figcaption>Figure 4. BGP over T0. Messages 3–4 are why route propagation matters on AWS, and 5–6 are why "tunnel up" isn't enough: until BGP runs, neither VPC has a route to the other.</figcaption>
</figure>

<h2>Verify the routes, not just the tunnels</h2>

<p>"Tunnel up" only means IKE succeeded. The setup works when <strong>each side has learned the other's range over BGP</strong>. You checked GCP in step 7; check AWS the same way:</p>

<pre><code>aws ec2 describe-vpn-connections --vpn-connection-ids "$VPN_A" "$VPN_B" \\
  --query 'VpnConnections[].VgwTelemetry[].[OutsideIpAddress,Status,AcceptedRouteCount]' \\
  --output table

aws ec2 describe-route-tables --route-table-ids "$RTB" \\
  --query 'RouteTables[0].Routes[?Origin==\`EnableVgwRoutePropagation\`].[DestinationCidrBlock,GatewayId]' \\
  --output text</code></pre>

<p>Example output:</p>

<pre><code>-----------------------------------
|     DescribeVpnConnections      |
+-----------------+------+--------+
|  198.51.100.11  |  UP  |  1     |
|  198.51.100.12  |  UP  |  1     |
|  192.0.2.21     |  UP  |  1     |
|  192.0.2.22     |  UP  |  1     |
+-----------------+------+--------+
10.10.0.0/20    vgw-0a1b2c3d4e5f60718</code></pre>

<p>Then test from inside each VPC, in both directions. The EC2 security group needs an inbound ICMP rule from <code>10.10.0.0/20</code>.</p>

<pre><code># on vm-gcp
$ ping -c 3 10.20.1.10
64 bytes from 10.20.1.10: icmp_seq=1 ttl=63 time=3.1 ms
64 bytes from 10.20.1.10: icmp_seq=2 ttl=63 time=2.8 ms
64 bytes from 10.20.1.10: icmp_seq=3 ttl=63 time=2.9 ms
3 packets transmitted, 3 received, 0% packet loss

# on ec2-aws
$ ping -c 3 10.10.0.5
64 bytes from 10.10.0.5: icmp_seq=1 ttl=63 time=3.0 ms
64 bytes from 10.10.0.5: icmp_seq=2 ttl=63 time=2.9 ms
64 bytes from 10.10.0.5: icmp_seq=3 ttl=63 time=3.2 ms
3 packets transmitted, 3 received, 0% packet loss</code></pre>

<p>A TTL of 63 (one less than 64) shows the packet crossed a single routed hop: the tunnel. Latency depends on your region pair; Mumbai to Mumbai is a few milliseconds. Don't ping the private IPs from your laptop as a "negative test". RFC 1918 addresses are never reachable from the internet, VPN or not, so a timeout there proves nothing.</p>

<h2>Break it on purpose</h2>

<p>An HA setup you have never failed is a hope, not a design. Run a continuous ping in one terminal and disable a BGP peer in another:</p>

<pre><code># terminal 1, on vm-gcp
ping -i 0.2 10.20.1.10

# terminal 2: take T0's BGP session down, watch terminal 1, then restore it
gcloud compute routers update-bgp-peer cr-aws --region=asia-south1 \\
  --peer-name=aws-t0 --no-enabled

gcloud compute routers update-bgp-peer cr-aws --region=asia-south1 \\
  --peer-name=aws-t0 --enabled</code></pre>

<figure>
  <img src="${img('failover-timeline.svg')}" alt="Illustrative timeline: T0 BGP disabled, routes via T0 withdrawn while GCP keeps ECMP on T1 to T3, the VGW drops T0 and moves return traffic to another tunnel, then steady state on three tunnels. A ping strip shows a short run of lost replies." />
  <figcaption>Figure 5. What happens when T0 fails (illustrative). How long the gap lasts depends on BGP hold timers and dead-peer detection, so expect seconds, not milliseconds.</figcaption>
</figure>

<ul>
  <li><strong>GCP → AWS</strong> traffic was already spread across all four tunnels with ECMP, so only the flows hashed onto T0 move.</li>
  <li><strong>AWS → GCP</strong> traffic from a virtual private gateway uses one tunnel at a time. If that tunnel was T0, return traffic pauses until AWS withdraws the route and picks another tunnel.</li>
  <li>Measure the gap, write the number in your runbook, and repeat the drill with T2 so both GCP interfaces are proven.</li>
</ul>

<h2>VGW or Transit Gateway</h2>

<p>This lab ends on a virtual private gateway because it connects one VPC. Once several VPCs need to reach GCP, terminate the VPN connections on a Transit Gateway instead.</p>

<figure>
  <img src="${img('vgw.svg')}" style="max-width: 560px; margin-inline: auto" alt="One VPC with a virtual private gateway and four tunnels to the GCP HA VPN gateway." />
  <figcaption>Figure 6a. Virtual private gateway: one VPC, one active tunnel for AWS → GCP, no extra charges.</figcaption>
</figure>

<figure>
  <img src="${img('tgw.svg')}" style="max-width: 560px; margin-inline: auto" alt="A Transit Gateway hub connecting three VPCs, with four ECMP tunnels to the GCP HA VPN gateway." />
  <figcaption>Figure 6b. Transit Gateway: a hub for many VPCs, ECMP across tunnels, with per-attachment and per-GB charges.</figcaption>
</figure>

<table>
  <thead><tr><th></th><th>Virtual private gateway</th><th>Transit Gateway</th></tr></thead>
  <tbody>
    <tr><td>Reach</td><td>One VPC</td><td>Many VPCs and accounts through one hub</td></tr>
    <tr><td>AWS → GCP across tunnels</td><td>One active tunnel; the others stand by</td><td>ECMP across tunnels when VPN ECMP support is on</td></tr>
    <tr><td>Extra cost</td><td>None beyond the VPN connections</td><td>Hourly per attachment plus a per-GB processing charge</td></tr>
  </tbody>
</table>

<h2>Things that will bite you</h2>

<ul>
  <li><strong>The ASNs must differ and be cross-wired.</strong> Customer gateways carry the Cloud Router's ASN (65010); GCP BGP peers carry the VGW's ASN (64600). Swapping them is the usual reason a session sits in "Idle".</li>
  <li><strong>AWS reserves some inside CIDRs.</strong> You can't use <code>169.254.0.0/30</code> through <code>169.254.5.0/30</code>, or <code>169.254.169.252/30</code>. Pick /30s elsewhere in 169.254.0.0/16 and keep them unique on the Cloud Router.</li>
  <li><strong>Route propagation is off by default</strong> on AWS route tables. BGP can be up with routes accepted and traffic still goes nowhere.</li>
  <li><strong>Firewalls on both sides.</strong> A GCP ingress rule from 10.20.0.0/16 and an EC2 security group rule from 10.10.0.0/20, each scoped to the other VPC instead of 0.0.0.0/0.</li>
  <li><strong>MTU.</strong> AWS recommends a tunnel MTU of 1436 and TCP MSS of 1379; a GCP VPC defaults to MTU 1460. TCP adjusts through MSS, but test large UDP payloads before relying on them: <code>ping -M do -s 1380 10.20.1.10</code>.</li>
  <li><strong>Regional vs global dynamic routing.</strong> In regional mode, only asia-south1 subnets are advertised and only VMs in that region learn AWS routes. Switch the VPC to global if other regions need the tunnel.</li>
  <li><strong>Pre-shared keys are credentials.</strong> Keep them in a secret manager and redact them from screenshots, configs and chat.</li>
</ul>

<h2>What it costs</h2>

<p>Both clouds bill VPN by the hour whether traffic flows or not, so a forgotten lab becomes a real bill. Rough list prices at the time of writing for most regions, before data transfer:</p>

<table>
  <thead><tr><th>Item</th><th>Unit</th><th>Count</th><th>≈ per month (730 h)</th></tr></thead>
  <tbody>
    <tr><td>GCP HA VPN tunnel</td><td>≈ $0.05 / tunnel-hour</td><td>4</td><td>≈ $146</td></tr>
    <tr><td>AWS Site-to-Site VPN connection</td><td>≈ $0.05 / connection-hour</td><td>2</td><td>≈ $73</td></tr>
    <tr><td><strong>Fixed total</strong></td><td></td><td></td><td><strong>≈ $219</strong></td></tr>
    <tr><td>Data transfer</td><td colspan="3">Internet egress from each cloud, billed per GB by both providers at their own rates.</td></tr>
  </tbody>
</table>

<p>Prices change and vary by region. Check the Cloud VPN and AWS Site-to-Site VPN pricing pages before you quote a number.</p>

<h2>Mapping it to Terraform</h2>

<p>The CLI is good for learning the moving parts. For anything that stays up, use Terraform. Each step maps to resource types:</p>

<table>
  <thead><tr><th>Step</th><th>Google provider</th><th>AWS provider</th></tr></thead>
  <tbody>
    <tr><td>1–2 · Network, router, gateway</td><td><code>google_compute_network</code>, <code>google_compute_subnetwork</code>, <code>google_compute_firewall</code>, <code>google_compute_router</code>, <code>google_compute_ha_vpn_gateway</code></td><td>—</td></tr>
    <tr><td>3 · VGW</td><td>—</td><td><code>aws_vpn_gateway</code>, <code>aws_vpn_gateway_attachment</code>, <code>aws_vpn_gateway_route_propagation</code></td></tr>
    <tr><td>4–5 · Far end and connections</td><td>—</td><td><code>aws_customer_gateway</code> ×2, <code>aws_vpn_connection</code> ×2</td></tr>
    <tr><td>6 · Peer and tunnels</td><td><code>google_compute_external_vpn_gateway</code>, <code>google_compute_vpn_tunnel</code> ×4</td><td>—</td></tr>
    <tr><td>7 · BGP</td><td><code>google_compute_router_interface</code> ×4, <code>google_compute_router_peer</code> ×4</td><td>(inside <code>aws_vpn_connection</code>)</td></tr>
  </tbody>
</table>

<p>Feed <code>aws_vpn_connection</code> the inside CIDRs and keys from variables, then build the GCP peer gateway from its <code>tunnel1_address</code> and <code>tunnel2_address</code> outputs. One <code>terraform apply</code> wires both clouds.</p>

<h2>Tear-down order</h2>

<p>Delete in reverse dependency order, or the APIs refuse with "resource in use" errors:</p>

<pre><code># GCP
for t in t0 t1 t2 t3; do
  gcloud compute routers remove-bgp-peer cr-aws --region=asia-south1 --peer-name="aws-$t"
  gcloud compute routers remove-interface cr-aws --region=asia-south1 --interface-name="if-$t"
done
gcloud compute vpn-tunnels delete tunnel-t0 tunnel-t1 tunnel-t2 tunnel-t3 --region=asia-south1 -q
gcloud compute external-vpn-gateways delete aws-peer-gw -q
gcloud compute vpn-gateways delete ha-vpn-gw --region=asia-south1 -q
gcloud compute routers delete cr-aws --region=asia-south1 -q

# AWS: deleting the connections stops the hourly bill
aws ec2 delete-vpn-connection --vpn-connection-id "$VPN_A"
aws ec2 delete-vpn-connection --vpn-connection-id "$VPN_B"
# wait until both show State "deleted", then:
aws ec2 delete-customer-gateway --customer-gateway-id "$CGW_A"
aws ec2 delete-customer-gateway --customer-gateway-id "$CGW_B"
aws ec2 detach-vpn-gateway --vpn-gateway-id "$VGW" --vpc-id "$VPC"
aws ec2 delete-vpn-gateway --vpn-gateway-id "$VGW"</code></pre>

<p>All addresses here are from RFC 5737 documentation ranges, RFC 1918 private space or the 169.254.0.0/16 link-local range; resource IDs and terminal output are examples. Swap in your own values before running anything.</p>
`

export const gcpAwsHaVpn: LocalPost = {
    slug: 'ha-vpn-between-google-cloud-and-aws',
    title: 'HA VPN between Google Cloud and AWS: Four Tunnels, BGP and a Plan That Holds',
    subtitle:
        'A repeatable CLI build of a 99.99% HA VPN between a GCP VPC and an AWS VPC, with a diagram for every step, route checks and a failover drill.',
    brief:
        'Why a GCP–AWS HA VPN needs four tunnels, the address plan that keeps them straight, and a seven-step gcloud and aws CLI build with a diagram for every step. Then verify the BGP routes on both sides, fail a tunnel on purpose, and tear it all down cleanly.',
    coverImage: img('architecture.svg'),
    publishedAt: '2026-11-24',
    readTime: 15,
    tags: ['gcp', 'aws', 'cloud-vpn', 'site-to-site-vpn', 'bgp', 'multi-cloud', 'networking', 'devops'],
    html,
}
