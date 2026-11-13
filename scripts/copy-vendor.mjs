/**
 * Copies the GSAP and three.js builds that the live previews use into public/vendor/<package>/<version>/.
 * The preview code shows jsDelivr URLs, which is what a reader pastes into their own project; inside the tutorial
 * those URLs are rewritten to these copies (lib/demos.ts), so previews still run on networks that block CDNs.
 *
 * The example sites get the same treatment: public/examples/<site>/ keeps the jsDelivr URLs (the code tabs and
 * StackBlitz read it), and public/live/<site>/ is a copy pointing at /vendor, which is what the frames show.
 * Runs before dev and build. The output is generated, so it is not committed.
 */
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const FILES = {
  gsap: ['dist/gsap.min.js', 'dist/ScrollTrigger.min.js', 'dist/SplitText.min.js', 'dist/DrawSVGPlugin.min.js', 'dist/MotionPathPlugin.min.js'],
  three: ['build/three.module.js', 'build/three.core.js'],
};

for (const [pkg, files] of Object.entries(FILES)) {
  const { version } = JSON.parse(await readFile(join('node_modules', pkg, 'package.json'), 'utf8'));
  const out = join('public', 'vendor', pkg, version);
  await mkdir(out, { recursive: true });
  for (const f of files) await copyFile(join('node_modules', pkg, f), join(out, f.split('/').pop()));
  console.log(`vendor: ${pkg}@${version} → ${out}`);
}

/* the same rewrite as lib/demos.ts: jsDelivr gsap or three URLs become /vendor/<package>/<version>/ */
const local = (code) => code.replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/(gsap|three)@([\d.]+)\/(?:dist|build)\//g, '/vendor/$1/$2/');
for (const site of await readdir(join('public', 'examples'))) {
  const out = join('public', 'live', site);
  await mkdir(out, { recursive: true });
  for (const f of await readdir(join('public', 'examples', site)))
    await writeFile(join(out, f), local(await readFile(join('public', 'examples', site, f), 'utf8')));
}
console.log('live: example sites copied to public/live with local library URLs');
