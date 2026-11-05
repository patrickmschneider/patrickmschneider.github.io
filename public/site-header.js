/*
 * Shared site header for patrickmschneider.com tools.
 *
 * Usage (one line in a tool's HTML <head>):
 *   <script src="https://www.patrickmschneider.com/site-header.js" defer></script>
 *
 * It inserts the main site's header (name, Imperial Business School logo, menu) at the top
 * of the page. Styles live in a shadow root, so the tool's CSS can't affect the header and
 * the header can't affect the tool. Sizes are in px so a tool's root font-size doesn't matter.
 * Edit this one file to change the header on every tool.
 */
(function () {
  if (customElements.get('ps-site-header')) return;

  var SITE = 'https://www.patrickmschneider.com';

  // Fonts must be declared on the document (browsers ignore @font-face inside shadow roots).
  if (!document.getElementById('ps-site-header-fonts')) {
    var f = document.createElement('style');
    f.id = 'ps-site-header-fonts';
    f.textContent =
      "@font-face{font-family:'PS Plex Sans';font-style:normal;font-weight:400;font-display:swap;src:url(" + SITE + "/fonts/ibm-plex-sans-latin-400-normal.woff2) format('woff2')}" +
      "@font-face{font-family:'PS Plex Sans';font-style:normal;font-weight:500;font-display:swap;src:url(" + SITE + "/fonts/ibm-plex-sans-latin-500-normal.woff2) format('woff2')}";
    document.head.appendChild(f);
  }

  var CSS = [
    ':host{display:block;all:initial;display:block;font-family:"PS Plex Sans","IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;',
    '--bg:#faf9f6;--text:#1f2328;--soft:#2d3138;--rule:#e7e4dd;--blue:#0000cd;--hover:#0000cd}',
    '@media (prefers-color-scheme: dark){:host{--bg:#121315;--text:#e8e7e4;--soft:#cfcdc8;--rule:#2a2b2f;--hover:#9aa6ff}}',
    'header{background:var(--bg);border-top:3px solid var(--blue);border-bottom:1px solid var(--rule)}',
    '.wrap{box-sizing:border-box;max-width:1120px;margin:0 auto;padding:11px 24px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 32px}',
    '.brand{display:flex;align-items:center;gap:16px}',
    'a{text-decoration:none;color:inherit}',
    '.name{color:var(--text);font-size:17px;font-weight:500;letter-spacing:-0.01em;line-height:1.3}',
    '.logo{display:block;padding-left:16px;border-left:1px solid var(--rule);line-height:0}',
    '.logo img{height:26px;width:auto;display:block}',
    'nav{display:flex;flex-wrap:wrap;gap:28px}',
    'nav a{color:var(--soft);font-size:15px;font-weight:500;line-height:1.4;padding:6px 0;border-bottom:1.5px solid transparent}',
    'nav a:hover,.name:hover{color:var(--hover)}',
    'nav a[aria-current=page]{color:var(--text);border-bottom-color:var(--blue)}',
    'a:focus-visible{outline:2px solid var(--blue);outline-offset:3px;border-radius:2px}',
    '@media (max-width:544px){.wrap{row-gap:6px}.logo img{height:23px}nav{gap:20px}}',
  ].join('');

  var NAV = [
    ['research', 'Research', SITE + '/research/'],
    ['teaching', 'Teaching', SITE + '/teaching/'],
    ['tools', 'Tools', SITE + '/tools/'],
    ['cv', 'CV', SITE + '/files/cv.pdf'],
  ];

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      var current = this.getAttribute('current') || 'tools';
      var root = this.attachShadow({ mode: 'open' });
      var links = NAV.map(function (n) {
        return '<a href="' + n[2] + '"' + (n[0] === current ? ' aria-current="page"' : '') + '>' + n[1] + '</a>';
      }).join('');
      root.innerHTML =
        '<style>' + CSS + '</style>' +
        '<header><div class="wrap">' +
        '<div class="brand">' +
        '<a class="name" href="' + SITE + '/">Patrick Schneider</a>' +
        '<a class="logo" href="https://www.imperial.ac.uk/business-school/">' +
        '<picture><source srcset="' + SITE + '/images/imperial-business-school-white.svg" media="(prefers-color-scheme: dark)">' +
        '<img src="' + SITE + '/images/imperial-business-school.svg" alt="Imperial Business School" width="315" height="80"></picture></a>' +
        '</div>' +
        '<nav aria-label="Site">' + links + '</nav>' +
        '</div></header>';
    }
  }
  customElements.define('ps-site-header', SiteHeader);

  function insert() {
    if (!document.querySelector('ps-site-header')) {
      document.body.insertBefore(document.createElement('ps-site-header'), document.body.firstChild);
    }
  }
  if (document.body) insert();
  else document.addEventListener('DOMContentLoaded', insert);
})();
