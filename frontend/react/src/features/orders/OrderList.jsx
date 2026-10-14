import { useState } from 'react';

export default function OrderList({ orders, products = [], loading, onCancelOrder }) {
  const [orderToCancel, setOrderToCancel] = useState(null);
  const productMap = new Map((products || []).map((p) => [p.id, p]));

  const getOrderItems = (order) => {
    // If backend already attached full products
    if (Array.isArray(order.products) && order.products.length > 0) {
      return order.products;
    }
    // Fallback: look up product IDs from product list
    if (Array.isArray(order.productIds)) {
      return order.productIds.map((id) => {
        const found = productMap.get(id);
        return found || { id, name: `Product #${id.slice(-6)}`, price: null };
      });
    }
    return [];
  };

  if (loading && orders.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center text-slate-500 shadow-sm">
        <div className="inline-block animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full mb-1"></div>
        <p className="text-xs">Loading orders from MySQL...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400">
        <p className="text-sm font-medium">No orders placed yet.</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Click the <span className="font-semibold text-emerald-600">"Order Now"</span> button on any product to create an order in MySQL.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛒</span>
          <h3 className="font-bold text-slate-900 text-base">Your Orders</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {orders.length}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Stored in MySQL (`orders` table)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3 font-bold">Order ID</th>
              <th className="py-2.5 px-3 font-bold">User ID</th>
              <th className="py-2.5 px-3 font-bold">Ordered Products</th>
              <th className="py-2.5 px-3 font-bold">Total Amount</th>
              <th className="py-2.5 px-3 font-bold">Date</th>
              <th className="py-2.5 px-3 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const items = getOrderItems(order);
              return (
                <tr key={order.orderId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    #{order.orderId}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono whitespace-nowrap">
                    {order.userId}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1.5 py-0.5">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/80 border border-indigo-100/90 text-[11px] font-medium text-slate-800"
                        >
                          <span className="font-semibold text-slate-900">{item.name}</span>
                          {item.price !== null && item.price !== undefined && (
                            <span className="text-emerald-700 font-bold">
                              ₹{Number(item.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-600 text-sm whitespace-nowrap">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setOrderToCancel(order)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {orderToCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setOrderToCancel(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent decoration */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-rose-400 to-amber-500"></div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setOrderToCancel(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-sm cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-start gap-3.5 mb-4 mt-1">
              <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-xl shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cancel Order #{orderToCancel.orderId}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to cancel this order? This action will permanently remove it from the database.
                </p>
              </div>
            </div>

            {/* Summary box */}
            <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-900">#{orderToCancel.orderId}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">Total Amount:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ₹{Number(orderToCancel.totalAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">User ID:</span>
                <span className="font-mono text-slate-700">{orderToCancel.userId}</span>
              </div>
              {orderToCancel.createdAt && (
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-500">Placed On:</span>
                  <span className="text-slate-700">
                    {new Date(orderToCancel.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = orderToCancel.orderId;
                  setOrderToCancel(null);
                  onCancelOrder(id);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-md shadow-rose-200 hover:shadow-rose-300 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🗑️</span>
                <span>Confirm Cancellation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
