import { useState } from 'react';

export default function ProductList({ products, loading, onEdit, onDelete, onOrder }) {
  const [productToDelete, setProductToDelete] = useState(null);
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
                onClick={() => setProductToDelete(product)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setProductToDelete(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent decoration */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-amber-500"></div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setProductToDelete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-sm cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-start gap-3.5 mb-4 mt-1">
              <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-xl shrink-0">
                🗑️
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Delete Product
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to delete this product? This will remove it from MongoDB and cannot be undone.
                </p>
              </div>
            </div>

            {/* Summary box */}
            <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">Product Name:</span>
                <span className="font-bold text-slate-900">{productToDelete.name}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">Price:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ₹{Number(productToDelete.price).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">Product ID:</span>
                <span className="font-mono text-slate-700">#{productToDelete.id.slice(-6)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = productToDelete.id;
                  setProductToDelete(null);
                  onDelete(id);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-md shadow-rose-200 hover:shadow-rose-300 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🗑️</span>
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
