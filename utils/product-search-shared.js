function matchesProductQuery(product, query) {
  const normalize = (value) => value.toLowerCase().replace(/[\u2019\u2018'`]/g, '');
  const queryWords = normalize(query.trim()).split(/\s+/);
  const fields = [product.title, ...(product.tags || []), product.sku, product.brand, product.category?.name];

  return fields.some((field) => {
    const words = field && normalize(field).split(/\s+/);
    return words?.some((_, index) => queryWords.every((word, offset) => words[index + offset]?.startsWith(word)));
  });
}

module.exports = { matchesProductQuery };
