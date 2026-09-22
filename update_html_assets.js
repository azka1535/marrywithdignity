const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'about.html',
  'donate.html',
  'stories.html',
  'contact.html',
  'terms.html',
  'privacy-policy.html'
];

const faviconTags = `  <!-- Favicon & Brand Icons -->
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
  <link rel="shortcut icon" href="favicon.ico">
  <link rel="manifest" href="site.webmanifest">
  <meta name="theme-color" content="#065f46">`;

const navLogoCss = `    .nav-logo-link {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      flex-shrink: 0;
      gap: 12px;
    }

    .nav-logo {
      height: 52px;
      width: auto;
      object-fit: contain;
      transition: transform 0.2s ease;
      filter: drop-shadow(0 2px 5px rgba(6, 78, 59, 0.12));
    }

    .nav-logo-link:hover .nav-logo {
      transform: scale(1.08);
    }

    .nav-logo-text {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--primary-900);
      letter-spacing: -0.35px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      line-height: 1;
      text-decoration: none;
      white-space: nowrap;
    }`;

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add Favicon tags if not present
  if (!content.includes('rel="icon"') && !content.includes('favicon.svg')) {
    if (content.includes('<link rel="canonical"')) {
      content = content.replace(/(<link rel="canonical"[^>]*>)/, `$1\n\n${faviconTags}`);
    } else if (content.includes('</title>')) {
      content = content.replace(/(<\/title>)/, `$1\n\n${faviconTags}`);
    }
  }

  // 2. Update OG and Twitter image to og-image.png in index.html or other files
  content = content.replace(/content="https:\/\/marrywithdignity\.org\/images\/logo\.png"/g, 'content="https://marrywithdignity.org/images/og-image.png"');

  // 3. Update nav-logo CSS
  const oldCssPattern = /\.nav-logo-link\s*\{[\s\S]*?\.nav-logo-text\s*\{[\s\S]*?\}/;
  if (oldCssPattern.test(content)) {
    content = content.replace(oldCssPattern, navLogoCss);
  }

  // 4. Update nav-logo image to images/logo-icon.svg
  content = content.replace(/<img src="images\/logo\.png" alt="MarryWithDignity" class="nav-logo">/g, '<img src="images/logo-icon.svg" alt="MarryWithDignity" class="nav-logo">');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
