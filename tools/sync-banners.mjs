#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const output = path.join(root, 'docs', 'banners');
const apply = process.argv.includes('--apply');

const services = [
  ['host-check', 'Host Check', 'Reports host posture, services and firewall state.'],
  ['open-ports', 'Open Ports', 'Records listening ports and reports what changed.'],
  ['ssh-guard', 'SSH Guard', 'Reviews OpenSSH configuration and prepares policy changes.'],
  ['honeyfile', 'Honeyfile', 'Records access to files that should remain untouched.'],
  ['file-watch', 'File Watch', 'Maintains a local SHA-256 integrity baseline.'],
  ['secret-sweep', 'Secret Sweep', 'Scans local files and staged changes for credentials.'],
  ['container-check', 'Container Check', 'Reviews Compose files for host exposure.'],
  ['firewall-kit', 'Firewall Kit', 'Renders firewall rules for review before installation.'],
  ['log-howl', 'Log Howl', 'Matches meaningful log events and sends notifications.'],
  ['safe-share', 'Safe Share', 'Opens a temporary route to one selected file.']
];

const markSource = fs.readFileSync(path.join(root, 'docs', 'brand', 'mark.svg'), 'utf8');
const viewBox = markSource.match(/viewBox="([^"]+)"/)?.[1];
const markPath = markSource.match(/<path\s+id="mark"[^>]*\sd="([^"]+)"/)?.[1];
if (!viewBox || !markPath) throw new Error('Could not read the canonical walking-wolf mark.');

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function forest(width, height) {
  const trunks = [
    [30, 44, 7, 170], [90, 88, 10, 154], [155, 22, 17, 232], [235, 65, 9, 178],
    [310, 28, 21, 226], [905, 52, 12, 184], [976, 19, 24, 242], [1065, 73, 10, 173],
    [1138, 31, 18, 221]
  ];
  return `<g aria-hidden="true" opacity=".56">
    <path d="M0 ${height * .73}C175 ${height * .61} 286 ${height * .78} 470 ${height * .67}S814 ${height * .62} ${width} ${height * .72}V${height}H0Z" fill="#10231F"/>
    ${trunks.map(([x, y, w, h]) => `<path d="M${x} ${y}h${w}l${Math.round(w * .45)} ${h}h-${Math.round(w * 1.9)}Z" fill="#1D3530"/>`).join('\n    ')}
    <path d="M0 ${height - 57}C180 ${height - 79} 363 ${height - 35} 554 ${height - 59}S923 ${height - 83} ${width} ${height - 45}V${height}H0Z" fill="#071310"/>
  </g>`;
}

function banner(title, line) {
  const safeTitle = escapeXml(title);
  const safeLine = escapeXml(line);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" role="img" aria-labelledby="title desc">
  <title id="title">${safeTitle}</title>
  <desc id="desc">${safeLine}</desc>
  <rect width="1200" height="360" fill="#071310"/>
  ${forest(1200, 360)}
  <g transform="translate(62 124) scale(.185)" fill="#9CAAA6"><path fill-rule="evenodd" d="${markPath}"/></g>
  <path d="M400 84H1124" stroke="#41645D" stroke-width="2"/>
  <text x="400" y="164" fill="#E8E8DF" font-family="Georgia, 'Times New Roman', serif" font-size="68" letter-spacing="-1">${safeTitle}</text>
  <text x="404" y="213" fill="#9CAAA6" font-family="Arial Narrow, Helvetica Neue, Arial, sans-serif" font-size="19" letter-spacing=".7">${safeLine}</text>
  <text x="404" y="296" fill="#41645D" font-family="Arial Narrow, Helvetica Neue, Arial, sans-serif" font-size="13" letter-spacing="4">DISPERSAL WOLVES / DEFENSIVE UTILITIES FOR LINUX HOSTS</text>
</svg>\n`;
}

function fieldBanner() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 500" role="img" aria-labelledby="title desc">
  <title id="title">Dispersal Wolves</title>
  <desc id="desc">Defensive utilities for Linux hosts.</desc>
  <rect width="1400" height="500" fill="#071310"/>
  ${forest(1400, 500)}
  <path d="M85 86H1315" stroke="#41645D" stroke-width="2"/>
  <text x="85" y="178" fill="#E8E8DF" font-family="Georgia, 'Times New Roman', serif" font-size="82" letter-spacing="-1">Dispersal Wolves</text>
  <text x="90" y="231" fill="#9CAAA6" font-family="Arial Narrow, Helvetica Neue, Arial, sans-serif" font-size="20" letter-spacing="1">Defensive utilities for Linux hosts.</text>
  <g transform="translate(850 264) scale(.29)" fill="#9CAAA6"><path fill-rule="evenodd" d="${markPath}"/></g>
  <text x="90" y="424" fill="#41645D" font-family="Arial Narrow, Helvetica Neue, Arial, sans-serif" font-size="13" letter-spacing="4">TEN REPOSITORIES / LOCAL REPORTS / REVIEWABLE CHANGES</text>
</svg>\n`;
}

const targetFor = (slug) => path.resolve(root, '..', slug, 'docs', 'banner.svg');
if (apply) {
  const missing = services.map(([slug]) => slug).filter((slug) => !fs.existsSync(path.dirname(targetFor(slug))));
  if (missing.length) throw new Error(`Sibling repositories not found, nothing was written: ${missing.join(', ')}`);
}

fs.mkdirSync(output, {recursive: true});
fs.writeFileSync(path.join(root, 'docs', 'field-banner.svg'), fieldBanner(), 'utf8');
console.log(`generated ${path.join(root, 'docs', 'field-banner.svg')}`);

for (const [slug, title, line] of services) {
  const svg = banner(title, line);
  const generated = path.join(output, `${slug}.svg`);
  fs.writeFileSync(generated, svg, 'utf8');
  if (apply) {
    const target = targetFor(slug);
    fs.writeFileSync(target, svg, 'utf8');
    console.log(`updated ${target}`);
  } else {
    console.log(`generated ${generated}`);
  }
}
