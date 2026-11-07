/**
 * Heading text to a URL fragment. Shared by the ui components (which render the ids)
 * and scripts/build-search-index.mjs (which links to them), so the two always agree.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return (
    text
      .replace(/^\s*\d+\s*·\s*/, '')
      .toLowerCase()
      /* letters with diacritics keep their base letter: ș to s, ă to a */
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}
