const { getPool } = require('../config/mysql');

// Map a DB row to the API shape from the spec (orderId, userId, productIds, totalAmount).
const toOrder = (row) =>
  row && {
    orderId: row.order_id,
    userId: row.user_id,
    productIds: typeof row.product_ids === 'string' ? JSON.parse(row.product_ids) : row.product_ids,
    totalAmount: Number(row.total_amount),
    createdAt: row.created_at,
  };

async function create({ userId, productIds, totalAmount }) {
  const [result] = await getPool().execute(
    'INSERT INTO orders (user_id, product_ids, total_amount) VALUES (?, ?, ?)',
    [userId, JSON.stringify(productIds), totalAmount]
  );
  return findById(result.insertId);
}

async function findById(orderId) {
  const [rows] = await getPool().execute('SELECT * FROM orders WHERE order_id = ?', [orderId]);
  return toOrder(rows[0]);
}

async function update(orderId, { productIds, totalAmount }) {
  await getPool().execute('UPDATE orders SET product_ids = ?, total_amount = ? WHERE order_id = ?', [
    JSON.stringify(productIds),
    totalAmount,
    orderId,
  ]);
  return findById(orderId);
}

async function findByUserId(userId) {
  const [rows] = await getPool().execute(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY order_id DESC',
    [userId]
  );
  return rows.map(toOrder);
}

async function remove(orderId) {
  const [result] = await getPool().execute('DELETE FROM orders WHERE order_id = ?', [orderId]);
  return result.affectedRows > 0;
}

module.exports = { create, findById, findByUserId, update, remove };
