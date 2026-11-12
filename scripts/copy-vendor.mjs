/**
 * Copies the GSAP and three.js builds that the live previews use into public/vendor/<package>/<version>/.
 * The preview code shows jsDelivr URLs, which is what a reader pastes into their own project; inside the tutorial
 * those URLs are rewritten to these copies (lib/demos.ts), so previews still run on networks that block CDNs.
 * Runs before dev and build. The output is generated, so it is not committed.
 */
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const FILES = {
  gsap: ['dist/gsap.min.js', 'dist/ScrollTrigger.min.js', 'dist/SplitText.min.js', 'dist/DrawSVGPlugin.min.js'],
  three: ['build/three.module.js', 'build/three.core.js'],
};

for (const [pkg, files] of Object.entries(FILES)) {
  const { version } = JSON.parse(await readFile(join('node_modules', pkg, 'package.json'), 'utf8'));
  const out = join('public', 'vendor', pkg, version);
  await mkdir(out, { recursive: true });
  for (const f of files) await copyFile(join('node_modules', pkg, f), join(out, f.split('/').pop()));
  console.log(`vendor: ${pkg}@${version} → ${out}`);
}
