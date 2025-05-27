const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const order = (req, res) => {
  const { items, delivery, totalQuantity, totalPrice, userId } = req.body;

  // 1. 배송 정보 저장
  let sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
  let values = [delivery.address, delivery.receiver, delivery.contact];
  conn.query(sql, values, (err, deliveryResult) => {
    if (err) return res.status(StatusCodes.BAD_REQUEST).end();
    const deliveryId = deliveryResult.insertId;

    // 2. 주문 정보 저장
    const firstBookTitle = items[0]?.title || '';
    sql = "INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)";
    values = [firstBookTitle, totalQuantity, totalPrice, userId, deliveryId];
    conn.query(sql, values, (err, orderResult) => {
      if (err) return res.status(StatusCodes.BAD_REQUEST).end();
      const orderId = orderResult.insertId;

      // 3. 주문 상세(여러 도서) 저장
      sql = "INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?";
      values = items.map(item => [orderId, item.id, item.quantity]);
      conn.query(sql, [values], (err, result) => {
        if (err) return res.status(StatusCodes.BAD_REQUEST).end();
        return res.status(StatusCodes.CREATED).json({ orderId });
      });
    });
  });
};

const getOrders = (req, res) => {
  const { userId } = req.query;
  let sql = `SELECT orderedBook.id, orderedBook.book_id, orderedBook.quantity, orderedBook.order_id, books.title, books.price, orders.total_quantity, orders.total_price, orders.created_at, delivery.address, delivery.receiver, delivery.contact
             FROM orders
             LEFT JOIN delivery ON orders.delivery_id = delivery.id
             LEFT JOIN orderedBook ON orders.id = orderedBook.order_id
             LEFT JOIN books ON orderedBook.book_id = books.id
             WHERE orders.user_id = ?
             ORDER BY orders.created_at DESC`;
  conn.query(sql, [userId], (err, results) => {
    if (err) return res.status(StatusCodes.BAD_REQUEST).end();
    return res.status(StatusCodes.OK).json(results);
  });
};

const getOrderDetail = (req, res) => {
  const { id } = req.params;
  let sql = `SELECT orders.id as order_id, orders.book_title, orders.total_quantity, orders.total_price, orders.created_at,
                    delivery.address, delivery.receiver, delivery.contact,
                    orderedBook.book_id, orderedBook.quantity, books.title, books.price
             FROM orders
             LEFT JOIN delivery ON orders.delivery_id = delivery.id
             LEFT JOIN orderedBook ON orders.id = orderedBook.order_id
             LEFT JOIN books ON orderedBook.book_id = books.id
             WHERE orders.id = ?`;
  conn.query(sql, [id], (err, results) => {
    if (err) return res.status(StatusCodes.BAD_REQUEST).end();
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  order,
  getOrders,
  getOrderDetail,
};
