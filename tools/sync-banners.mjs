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
  ['host-check', 'Host Check', 'READ THE POSTURE OF ONE MACHINE'],
  ['open-ports', 'Open Ports', 'SEE WHAT IS LISTENING AND WHAT CHANGED'],
  ['ssh-guard', 'SSH Guard', 'REVIEW OPENSSH POLICY BEFORE IT OPENS A DOOR'],
  ['honeyfile', 'Honeyfile', 'WATCH WHAT SHOULD STAY UNTOUCHED'],
  ['file-watch', 'File Watch', 'KEEP A LOCAL INTEGRITY BASELINE'],
  ['secret-sweep', 'Secret Sweep', 'CATCH CREDENTIALS BEFORE THEY TRAVEL'],
  ['container-check', 'Container Check', 'READ COMPOSE EXPOSURE BEFORE DEPLOYMENT'],
  ['firewall-kit', 'Firewall Kit', 'REVIEW THE RULES BEFORE YOU LOAD THEM'],
  ['log-howl', 'Log Howl', 'TURN MEANINGFUL LOG LINES INTO ALERTS'],
  ['safe-share', 'Safe Share', 'OPEN A TEMPORARY ROUTE TO ONE FILE']
];

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function banner(title, line) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">${escapeXml(line)}</desc>
  <rect width="1200" height="360" fill="#0D292D"/>
  <g fill="none" stroke="#17464B" stroke-width="2">
    <path d="M-50 66c173-83 308 50 472-8s308-56 475 7 245 38 349-13"/>
    <path d="M-35 112c178-72 315 38 475-4s304-49 467 3 237 34 327-8"/>
    <path d="M-45 288c165-48 306 21 469-22s310-27 468 12 239 18 343-15"/>
    <path d="M-25 326c161-39 310 13 470-18s302-19 463 10 228 13 318-12"/>
  </g>
  <g transform="translate(55 52) scale(.96)">
    <path fill="#82B9B8" fill-rule="evenodd" d="M18 18 79 52l49-34 49 34 61-34-22 91 22 38-45 91-65-29-65 29-45-91 22-38Zm53 65 29 31 28 51 28-51 29-31-18 80-39 31-39-31Z"/>
  </g>
  <text x="365" y="155" fill="#F3F6F2" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="800" letter-spacing="-3">${escapeXml(title)}</text>
  <text x="370" y="207" fill="#82B9B8" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" letter-spacing="4">${escapeXml(line)}</text>
  <path d="M370 249h700" stroke="#397A7E" stroke-width="3"/>
  <text x="370" y="292" fill="#D9E9E6" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="5">DISPERSAL WOLVES</text>
</svg>
`;
}

fs.mkdirSync(output, {recursive: true});
for (const [slug, title, line] of services) {
  const svg = banner(title, line);
  const generated = path.join(output, `${slug}.svg`);
  fs.writeFileSync(generated, svg, 'utf8');
  if (apply) {
    const target = path.resolve(root, '..', slug, 'docs', 'banner.svg');
    if (!fs.existsSync(path.dirname(target))) throw new Error(`Sibling repository not found: ${slug}`);
    fs.writeFileSync(target, svg, 'utf8');
    console.log(`updated ${target}`);
  } else {
    console.log(`generated ${generated}`);
  }
}
