export default function ProductList({ products, loading, onEdit, onDelete, onOrder }) {
  if (loading && products.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-500 shadow-sm">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"></div>
        <p className="text-sm">Loading products from MongoDB...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500">
        <div className="text-3xl mb-2">📦</div>
        <h4 className="font-semibold text-slate-800">No products found</h4>
        <p className="text-sm text-slate-500 mt-1">Get started by creating your first product above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Products ({products.length})
        </h4>
        <span className="text-xs text-slate-400">Stored in MongoDB</span>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-bold text-slate-900 text-base truncate">
                  {product.name}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  ₹{Number(product.price).toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  #{product.id.slice(-6)}
                </span>
              </div>

              {product.description && (
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => onOrder(product)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🛒</span>
                <span>Order Now</span>
              </button>

              <button
                type="button"
                onClick={() => onEdit(product)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>✏️</span>
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete(product.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
