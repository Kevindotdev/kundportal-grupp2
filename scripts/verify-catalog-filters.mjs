const baseUrl = process.env.CATALOG_URL ?? 'http://localhost:3000';

async function document(path) {
  const response = await fetch(new URL(path, baseUrl));
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  return response.text();
}

async function page(path) {
  const html = await document(path);
  const content = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  if (!content) throw new Error(`${path} did not render a main catalog region`);
  return content;
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
const inclusivePriceBounds = await page('/products?category=1&minPrice=8.99&maxPrice=8.99');
const minimumPriceOnly = await page('/products?category=1&minPrice=9.99');
const maximumPriceOnly = await page('/products?category=1&maxPrice=8.99');
const outOfStockPage = await page('/products?category=14');
const inStockPage = await page('/products?category=14&inStock=true');
const combinedFilters = await page('/products?category=1&category=2&search=a&minPrice=8.99&maxPrice=129.99&inStock=true');
const combinedFiltersDocument = await document('/products?category=1&category=2&search=a&minPrice=8.99&maxPrice=129.99&inStock=true');
const combinedFiltersPage2 = await page('/products?category=1&category=2&search=a&minPrice=8.99&maxPrice=129.99&inStock=true&page=2');
const zeroMinimum = await page('/products?category=1&category=2&search=a&minPrice=0&maxPrice=129.99&inStock=true');
const firstPageDocument = await document('/products?category=1&category=2');
const allProductsDocument = await document('/products');
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
assert((inclusivePriceBounds.match(/<h2/g) ?? []).length === 1 && inclusivePriceBounds.includes('Red Nail Polish'), 'Equal minimum and maximum bounds should include a product priced exactly on both boundaries.');
assert((minimumPriceOnly.match(/<h2/g) ?? []).length === 4 && !minimumPriceOnly.includes('Red Nail Polish'), 'A minimum-only bound should work without a maximum.');
assert((maximumPriceOnly.match(/<h2/g) ?? []).length === 1 && maximumPriceOnly.includes('Red Nail Polish'), 'A maximum-only bound should include a product priced exactly at the maximum.');
assert(outOfStockPage.includes('Samsung Galaxy S8'), 'The unfiltered phone category should contain its out-of-stock product.');
assert(!inStockPage.includes('Samsung Galaxy S8') && inStockPage.includes('Vivo X21'), 'The in-stock filter should exclude zero-stock products and keep positive-stock products.');
assert((combinedFilters.match(/<h2/g) ?? []).length === 6, 'Combined search, category, price, and stock filters should paginate the matching results.');
assert(combinedFilters.includes('Page <!-- -->1<!-- --> of <!-- -->2'), 'Applying combined filters without a page parameter should show the first page.');
assert(combinedFiltersPage2.includes('Page <!-- -->2'), 'Combined filters should retain a second page when more than 6 results match.');
assert(combinedFilters.includes('search=a&amp;category=1&amp;category=2&amp;minPrice=8.99&amp;maxPrice=129.99&amp;inStock=true&amp;page=2'), 'Pagination should retain search, repeated categories, both price bounds, and stock filter.');
assert(/<input\b(?=[^>]*name="minPrice")(?=[^>]*value="8\.99")[^>]*>/.test(combinedFiltersDocument), 'The minimum price control should restore its URL value.');
assert(/<input\b(?=[^>]*name="maxPrice")(?=[^>]*value="129\.99")[^>]*>/.test(combinedFiltersDocument), 'The maximum price control should restore its URL value.');
assert(/<input\b(?=[^>]*name="inStock")(?=[^>]*value="true")(?=[^>]*checked="")[^>]*>/.test(combinedFiltersDocument), 'The in-stock control should restore its URL value.');
assert(zeroMinimum.includes('minPrice=0&amp;maxPrice=129.99&amp;inStock=true&amp;page=2'), 'A zero minimum should remain in the URL and pagination.');
assert((firstPageDocument.match(/checked=""/g) ?? []).length === 2, 'Both selected categories should be restored in the form.');
assert((allProducts.match(/<h2/g) ?? []).length === 6, 'An unfiltered catalog should show the first page of all products.');
assert(!allProductsDocument.includes('checked=""'), 'The unfiltered catalog should have no category selected.');

console.log('Catalog category, search, price, stock, and page-boundary checks passed.');
