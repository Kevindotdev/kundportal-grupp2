const baseUrl = process.env.CATALOG_URL ?? 'http://localhost:3000';

async function page(path) {
  const response = await fetch(new URL(path, baseUrl));
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  return response.text();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const firstPage = await page('/products?category=1&category=2');
const secondPage = await page('/products?category=1&category=2&page=2');
const combined = await page('/products?category=1&category=2&search=Essence');
const combinedPage1 = await page('/products?category=1&category=2&search=a');
const combinedPage2 = await page('/products?category=1&category=2&search=a&page=2');
const preservedFilters = await page('/products?category=1&category=2&search=a&stock=inStock&sort=price');
const allProducts = await page('/products');

assert((firstPage.match(/<h2/g) ?? []).length === 6, 'The first OR-filtered page should contain 6 products.');
assert((secondPage.match(/<h2/g) ?? []).length === 4, 'The second OR-filtered page should contain the remaining 4 products.');
const selectedPageCategories = [firstPage, secondPage].flatMap((html) =>
  [...html.matchAll(/<span class="absolute left-3 top-3[^>]*>(.*?)<\/span>/g)].map((match) => match[1]),
);
assert(selectedPageCategories.includes('Beauty') && selectedPageCategories.includes('Fragrances'), 'The selected-category pages should include products from both categories.');
assert(selectedPageCategories.every((category) => ['Beauty', 'Fragrances'].includes(category)), 'The selected-category pages should exclude unselected categories.');
assert(secondPage.includes('Page <!-- -->2'), 'The second page indicator should be rendered.');
assert(combined.includes('Essence Mascara Lash Princess'), 'Search and category filters should return the matching product.');
assert((combined.match(/<h2/g) ?? []).length === 1, 'Search should further narrow the selected categories.');
assert((combinedPage1.match(/<h2/g) ?? []).length === 6, 'Search plus selected categories should paginate after applying both filters.');
assert((combinedPage2.match(/<h2/g) ?? []).length === 4, 'The combined-filter second page should contain the remaining products.');
assert(combinedPage1.includes('search=a&amp;category=1&amp;category=2&amp;page=2'), 'Pagination should retain search and repeated categories.');
assert(preservedFilters.includes('search=a&amp;category=1&amp;category=2&amp;stock=inStock&amp;sort=price&amp;page=2'), 'Pagination should retain existing stock and sort parameters.');
assert((firstPage.match(/checked=""/g) ?? []).length === 2, 'Both selected categories should be restored in the form.');
assert((allProducts.match(/<h2/g) ?? []).length === 6, 'An unfiltered catalog should show the first page of all products.');
assert(!allProducts.includes('checked=""'), 'The unfiltered catalog should have no category selected.');

console.log('Catalog category, search, and page-boundary checks passed.');
