import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ProductForm from '../features/products/ProductForm';
import ProductList from '../features/products/ProductList';
import OrderList from '../features/orders/OrderList';
import {
  addProduct,
  clearProductError,
  editProduct,
  fetchProducts,
  removeProduct,
} from '../features/products/productSlice';
import {
  cancelOrder,
  fetchOrders,
  placeOrder,
} from '../features/orders/orderSlice';
import WeatherCard from '../features/weather/WeatherCard';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: products, status: productStatus, error: productError } = useSelector((state) => state.products);
  const { items: orders, status: orderStatus } = useSelector((state) => state.orders);
  const user = useSelector((state) => state.auth.user);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleAddProduct = async (product) => {
    dispatch(clearProductError());
    const result = await dispatch(addProduct(product));
    if (addProduct.fulfilled.match(result)) {
      toast.success(`Product "${product.name}" created successfully!`);
      return true;
    } else {
      toast.error(result.payload || 'Failed to add product');
      return false;
    }
  };

  const handleUpdateProduct = async (product) => {
    dispatch(clearProductError());
    const result = await dispatch(editProduct({ id: editing.id, ...product }));
    if (editProduct.fulfilled.match(result)) {
      toast.success(`Product "${product.name}" updated successfully!`);
      setEditing(null);
      return true;
    } else {
      toast.error(result.payload || 'Failed to update product');
      return false;
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await dispatch(removeProduct(id));
      if (removeProduct.fulfilled.match(result)) {
        toast.success('Product deleted successfully!');
      } else {
        toast.error(result.payload || 'Failed to delete product');
      }
    }
  };

  const handlePlaceOrder = async (product) => {
    const result = await dispatch(placeOrder([product.id]));
    if (placeOrder.fulfilled.match(result)) {
      toast.success(`Order #${result.payload.orderId} created in MySQL! Total: ₹${result.payload.totalAmount}`);
    } else {
      toast.error(result.payload || 'Failed to place order');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to cancel order #${orderId}?`)) {
      const result = await dispatch(cancelOrder(orderId));
      if (cancelOrder.fulfilled.match(result)) {
        toast.success(`Order #${orderId} deleted from MySQL!`);
      } else {
        toast.error(result.payload || 'Failed to cancel order');
      }
    }
  };

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Stat Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Products</span>
            <span className="text-lg">📦</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{products.length}</span>
            <span className="text-xs text-slate-500 font-medium">in MongoDB</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Orders Placed</span>
            <span className="text-lg">🛒</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600">{orders.length}</span>
            <span className="text-xs text-slate-500 font-medium">in MySQL (`orders`)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Spent</span>
            <span className="text-lg">💰</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">₹{totalSpent.toFixed(2)}</span>
            <span className="text-xs text-slate-500 font-medium">user orders</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Products + Orders on left, Weather Widget on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <ProductForm
            product={editing}
            onSubmit={editing ? handleUpdateProduct : handleAddProduct}
            onCancel={() => setEditing(null)}
          />

          {productError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
              {productError}
            </div>
          )}

          <ProductList
            products={products}
            loading={productStatus === 'loading'}
            onEdit={setEditing}
            onDelete={handleDeleteProduct}
            onOrder={handlePlaceOrder}
          />

          <OrderList
            orders={orders}
            products={products}
            loading={orderStatus === 'loading'}
            onCancelOrder={handleCancelOrder}
          />
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <WeatherCard />
        </aside>
      </div>
    </div>
  );
}
