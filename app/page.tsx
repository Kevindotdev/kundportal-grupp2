export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header categories={categories} />

      <div className="container max-w-7xl mx-auto px-6 py-6">
        <InventoryStatistics />

        <SearchForm categories={categories} selectedCategory={categoryParams} selectedStock={stockParams} queryParam={queryParams} />
        <section className="mt-5">
          <ProductListComponent
            products={products}
            categories={categories}
            categoryParam={categoryParams}
            stockParam={stockParams}
            queryParam={queryParams}
            currentPage={productResponse.success ? productResponse.data.page : currentPage}
            totalPage={productResponse.success ? productResponse.data.pages : 0}
          />
        </section>
      </div>
    </main>
  );
}
