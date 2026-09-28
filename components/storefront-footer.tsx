export default function StorefrontFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Webshop</p>
      </div>
    </footer>
  );
}
