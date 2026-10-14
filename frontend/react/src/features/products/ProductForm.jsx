import { useEffect, useState } from 'react';

const empty = { name: '', price: '', description: '' };

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(product ? { name: product.name, price: product.price, description: product.description } : empty);
  }, [product]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const saved = await onSubmit({ ...form, price: Number(form.price) });
    if (saved && !product) setForm(empty);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
            {product ? '✏️' : '➕'}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {product ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-xs text-slate-500">
              {product ? 'Update product information in MongoDB' : 'Create and save a new product into MongoDB'}
            </p>
          </div>
        </div>

        {product && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Editing #{product.id.slice(-6)}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Wireless Mouse"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 text-sm transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Price (₹) *
            </label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="e.g. 499.00"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 text-sm transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Short details about the product..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 text-sm transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-2"
          >
            <span>{product ? 'Update Product' : 'Add Product'}</span>
          </button>

          {product && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
