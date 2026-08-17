import { asset, type LocalPost } from './types'

const img = asset('aws-redirect')

const html = `
<h2>Introduction</h2>
<p>When hosting a static website on AWS, ensuring your domain redirects correctly from example.com to www.example.com is essential for SEO, brand consistency, and user experience.</p>
<p>In this guide, we'll walk through the exact setup of S3 buckets, CloudFront distributions, and Route 53 DNS records to seamlessly redirect example.com to <code>www.example.com</code>. Whether you're hosting a static site or building a personal portfolio, this method ensures both domains are properly served.</p>

<h2>Architecture Overview</h2>

<img src="${img('architecture.png')}" alt="Two parallel paths: www.example.com resolves through Route 53 and a CDN to the www.example.com S3 bucket, while example.com resolves through its own Route 53 record and CDN to a redirect S3 bucket that responds with an HTTP 301/302 to https://www.example.com." loading="lazy" />

<h2>Step 1: Host Your Main Site on www.example.com</h2>
<ol>
  <li>
    <strong>Create an S3 Bucket:</strong>
    <ul>
      <li>Name it <code>www.example.com</code> (must match your domain).</li>
      <li>Go to <strong>Properties → Static Website Hosting</strong>.</li>
      <li>Choose "Host a static website".</li>
      <li>Set <code>index.html</code> as the index document.</li>
      <li>Upload your website files (e.g., <code>index.html</code> with demo text like "Hello from www!").</li>
    </ul>
  </li>
</ol>

<h2>Step 2: Set Up CloudFront for www.example.com</h2>
<ol>
  <li>
    <strong>Create a CloudFront Distribution:</strong>
    <ul>
      <li><strong>Origin domain:</strong> Select your S3 bucket <code>www.example.com</code>.</li>
      <li><strong>Viewer Protocol Policy:</strong> Redirect HTTP to HTTPS.</li>
      <li><strong>Alternate Domain Name (CNAME):</strong> <code>www.example.com</code>.</li>
      <li>(Optional) Add SSL via ACM for HTTPS.</li>
    </ul>
  </li>
  <li>
    <strong>Deploy the distribution.</strong>
    <ul><li>Copy the CloudFront domain (e.g., <code>d1234.cloudfront.net</code>).</li></ul>
  </li>
</ol>

<h2>Step 3: Point DNS to CloudFront</h2>
<ol>
  <li>Go to <strong>Route 53 → Hosted Zone → www.example.com</strong>.</li>
  <li>
    Add a new <strong>A Record (Alias)</strong>:
    <ul>
      <li><strong>Name:</strong> www</li>
      <li><strong>Type:</strong> A – IPv4 address</li>
      <li><strong>Alias:</strong> Yes</li>
      <li><strong>Target:</strong> CloudFront distribution</li>
    </ul>
  </li>
</ol>
<p>Now, your site is live at www.example.com</p>

<h2>Step 4: Redirect example.com to www.example.com</h2>
<p>Now let's handle the redirection part.</p>
<ol>
  <li>
    <strong>Create a Second S3 Bucket:</strong>
    <ul>
      <li>Name it <code>example.com</code> (no www).</li>
      <li>Go to <strong>Properties → Static Website Hosting</strong>.</li>
      <li>Choose "Redirect requests for an object".</li>
      <li><strong>Target bucket or domain:</strong> <code>www.example.com</code>.</li>
      <li><strong>Protocol:</strong> <code>https</code>.</li>
    </ul>
  </li>
</ol>
<p>This tells S3 to redirect any requests to example.com → <code>https://www.example.com</code>.</p>

<h2>Step 5: Set Up CloudFront for example.com Redirect</h2>
<ol>
  <li>
    <strong>Create another CloudFront Distribution:</strong>
    <ul>
      <li><strong>Origin domain:</strong> Choose the new <code>example.com</code> S3 redirect bucket.</li>
      <li><strong>Alternate Domain Name (CNAME):</strong> <code>example.com</code>.</li>
      <li><strong>Viewer Protocol Policy:</strong> Redirect HTTP to HTTPS.</li>
      <li><strong>Behavior:</strong> Set to forward viewer request.</li>
    </ul>
  </li>
  <li>
    <strong>Deploy the distribution.</strong>
    <ul><li>Copy the new CloudFront domain (e.g., <code>d5678.cloudfront.net</code>).</li></ul>
  </li>
</ol>

<h2>Step 6: Point DNS for example.com</h2>
<ol>
  <li>Go to <strong>Route 53 → Hosted Zone → example.com</strong>.</li>
  <li>
    Add a new <strong>A Record (Alias)</strong>:
    <ul>
      <li><strong>Name:</strong> (leave blank for root domain)</li>
      <li><strong>Type:</strong> A – IPv4 address</li>
      <li><strong>Alias:</strong> Yes</li>
      <li><strong>Target:</strong> Redirect CloudFront distribution</li>
    </ul>
  </li>
</ol>

<p>Now, your setup will work like this:</p>
<ul>
  <li>Visiting <strong>www.example.com</strong> shows your content.</li>
  <li>Visiting <strong>example.com</strong> redirects to <code>www.example.com</code>.</li>
</ul>
`

export const awsRedirect: LocalPost = {
    slug: 'redirect-example-com-to-www-using-aws-s3-cloudfront-route53',
    title: 'How to Redirect example.com to www.example.com Using AWS S3, CloudFront & Route 53',
    subtitle:
        'The exact S3, CloudFront and Route 53 setup that serves your site on www and cleanly redirects the root domain to it.',
    brief:
        'The exact setup of S3 buckets, CloudFront distributions and Route 53 records to serve a static site on www.example.com and cleanly redirect the root domain to it — good for SEO, brand consistency and user experience.',
    coverImage: img('architecture.png'),
    publishedAt: '2025-07-10',
    readTime: 2,
    tags: ['domain-redirection', 'aws', 's3-bucket', 'cdn', 'route53', 'aws-tutorials'],
    html,
}
