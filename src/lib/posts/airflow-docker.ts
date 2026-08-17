import { asset, type LocalPost } from './types'

const img = asset('airflow-docker')

const html = `
<h2>Introduction</h2>
<p>Apache Airflow is an open-source platform to programmatically author, schedule, and monitor workflows. Deploying Airflow using Docker simplifies the setup process and ensures a consistent environment. This guide provides a detailed step-by-step process to set up Apache Airflow on an Ubuntu EC2 instance using Docker and Docker Compose.</p>

<h2>Prerequisites</h2>
<ul>
  <li>AWS Account with permission to launch EC2 instances</li>
  <li>Basic knowledge of Linux commands and Docker</li>
  <li>SSH access to the EC2 instance</li>
</ul>

<h2>Step 1: Launch an EC2 Instance</h2>
<ol>
  <li>Log in to <strong>AWS Console</strong></li>
  <li>Navigate to <strong>EC2</strong> and click <strong>Launch Instance</strong></li>
  <li>Select <strong>Ubuntu Server</strong> (20.04 or later)</li>
  <li>Choose <strong>t4g.medium</strong> or higher (Recommended for Docker)</li>
  <li>
    Configure <strong>Security Group</strong>:
    <ul>
      <li>Allow <strong>SSH (Port 22)</strong> from your IP</li>
      <li>Allow <strong>HTTP (Port 80)</strong></li>
      <li>Allow <strong>Custom TCP (Port 8080)</strong> for Airflow Web UI</li>
    </ul>
  </li>
  <li>
    Launch the instance and connect via SSH:
    <pre><code>ssh -i &lt;your-key-pair.pem&gt; ubuntu@&lt;public-ip&gt;</code></pre>
  </li>
</ol>

<h2>Step 2: Install Docker and Docker Compose</h2>

<h3>2.1 Update the System</h3>
<pre><code>sudo apt-get update &amp;&amp; sudo apt-get upgrade -y</code></pre>

<img src="${img('01.png')}" alt="Terminal output of apt-get update and upgrade fetching Ubuntu noble package indexes" loading="lazy" />

<h3>2.2 Install Required Packages</h3>
<pre><code>sudo apt-get install -y ca-certificates curl gnupg lsb-release</code></pre>

<img src="${img('02.png')}" alt="Terminal output showing ca-certificates, curl, gnupg and lsb-release already at their newest versions" loading="lazy" />

<h3>2.3 Add Docker Repository</h3>
<pre><code>sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg</code></pre>

<pre><code>echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list &gt; /dev/null</code></pre>

<h3>2.4 Install Docker Engine</h3>
<pre><code>sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin</code></pre>

<img src="${img('03.png')}" alt="Terminal output installing docker-ce, docker-ce-cli, containerd.io, docker-buildx-plugin and docker-compose-plugin" loading="lazy" />

<h3>2.5 Verify Docker Installation</h3>
<pre><code>docker --version</code></pre>

<img src="${img('04.png')}" alt="Terminal output: Docker version 27.4.1, build b9d17ea" loading="lazy" />

<h3>2.6 Install Docker Compose</h3>
<pre><code>sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose</code></pre>

<img src="${img('05.png')}" alt="Terminal output of curl downloading the docker-compose v2.20.0 binary to /usr/local/bin/docker-compose" loading="lazy" />

<h3>2.7 Verify Docker Compose Installation</h3>
<pre><code>docker-compose --version</code></pre>

<img src="${img('06.png')}" alt="Terminal output: Docker Compose version v2.20.0" loading="lazy" />

<h2>Step 3: Setup Apache Airflow</h2>

<h3>3.1 Create Airflow Directory</h3>
<pre><code>mkdir -p ~/airflow &amp;&amp; cd ~/airflow</code></pre>

<h3>3.2 Download Docker-Compose YAML for Airflow</h3>
<pre><code>curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.5.1/docker-compose.yaml'</code></pre>

<img src="${img('07.png')}" alt="Terminal output of curl downloading the Airflow 2.5.1 docker-compose.yaml" loading="lazy" />

<h3>3.3 Create Required Directories</h3>
<pre><code>mkdir -p ./dags ./logs ./plugins</code></pre>

<h3>3.4 Configure Environment</h3>
<pre><code>echo -e "AIRFLOW_UID=$(id -u)" &gt; .env
# Alternatively, you can manually set:
echo -e "AIRFLOW_UID=50000" &gt; .env</code></pre>

<h3>3.5 Initialize Airflow Database</h3>
<pre><code>docker-compose up airflow-init</code></pre>

<img src="${img('08.png')}" alt="Terminal output of docker-compose up airflow-init pulling the airflow-init, postgres and redis images" loading="lazy" />

<h3>3.5 Launch Airflow</h3>
<pre><code>docker-compose up -d</code></pre>

<h3>3.6 Check Airflow Logs (Optional)</h3>
<pre><code>docker-compose logs</code></pre>

<h2>Step 4: Access Airflow Web UI</h2>
<ol>
  <li><strong>Modify Security Group</strong> to allow inbound traffic on <strong>Port 8080</strong>.</li>
  <li>
    <strong>Access Airflow UI</strong> via browser:
    <pre><code>http://&lt;public-ip&gt;:8080/</code></pre>
  </li>
  <li>
    <strong>Login Credentials:</strong>
    <ul>
      <li><strong>Username:</strong> airflow (default)</li>
      <li><strong>Password:</strong> airflow (default)</li>
    </ul>
  </li>
</ol>

<img src="${img('09.png')}" alt="The Apache Airflow web UI sign-in screen with username and password fields" loading="lazy" />

<h2>Customizing the Docker Compose File as per requirements.</h2>

<h3>Step 1: Create a .env File for Environment Variables</h3>
<pre><code>touch .env</code></pre>

<p>Add the following content to <code>.env</code>:</p>
<p>This is an example. Please update the <code>.env</code> file with your own credentials and key values.</p>
<pre><code>AIRFLOW_IMAGE_NAME=apache/airflow:2.10.4
POSTGRES_USER=airflow
POSTGRES_PASSWORD=airflow
POSTGRES_DB=airflow
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
AIRFLOW_UID=50000
DBT_TYPE=postgres
DBT_HOST=localhost
DBT_USER=airflow
DBT_PASSWORD=airflow
DBT_PORT=5432
DBT_NAME=airflow
DBT_SCHEMA=public</code></pre>
`

export const airflowDocker: LocalPost = {
    slug: 'deploying-apache-airflow-with-docker',
    title: 'Deploying Apache Airflow with Docker on Ubuntu EC2 Instance',
    subtitle:
        'A step-by-step guide to standing up Apache Airflow on an Ubuntu EC2 instance with Docker and Docker Compose — from launching the instance to logging into the web UI.',
    brief:
        'A step-by-step guide to standing up Apache Airflow on an Ubuntu EC2 instance with Docker and Docker Compose — launching the instance, installing Docker, downloading the Airflow compose file, and reaching the web UI on port 8080.',
    coverImage: img('cover.png'),
    publishedAt: '2025-01-11',
    readTime: 4,
    tags: ['apache-airflow', 'airflow', 'docker', 'docker-compose', 'aws', 'ec2', 'ubuntu', 'devops'],
    html,
}
