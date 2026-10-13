export default function OrderList({ orders, products = [], loading, onCancelOrder }) {
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
                      onClick={() => onCancelOrder(order.orderId)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold hover:underline cursor-pointer"
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
    </div>
  );
}
