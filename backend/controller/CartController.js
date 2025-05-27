const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const addToCart = (req, res) => {
    const {book_id, quantity,user_id} = req.body;

    let sql = "INSERT INTO cartItems (book_id, quantity,user_id) VALUES (?, ?, ?)";
    let values = [book_id, quantity,user_id];

    conn.query(sql, values, (err, result) => {
        if(err) return res.status(StatusCodes.BAD_REQUEST).end();
        return res.status(StatusCodes.CREATED).json(result);
    })
}

const getCartItems = (req, res) => {
    const {user_id, selected} = req.body;

    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems LEFT JOIN books ON cartItems.book_id = books.id WHERE user_id=? AND cartItems.id IN (?)`;
    let values = [user_id, selected];
    conn.query(sql, values, (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(results);
    })

}

const deleteCartItem = (req, res) => {
    const { id, user_id } = req.body;
    // id가 배열이면 IN, 아니면 단일 삭제
    let sql, values;
    if (Array.isArray(id)) {
        sql = "DELETE FROM cartItems WHERE id IN (?) AND user_id = ?";
        values = [id, user_id];
    } else {
        sql = "DELETE FROM cartItems WHERE id = ? AND user_id = ?";
        values = [id, user_id];
    }
    conn.query(sql, values, (err, result) => {
        if (err) return res.status(StatusCodes.BAD_REQUEST).end();
        return res.status(StatusCodes.NO_CONTENT).end();
    });
}

module.exports = {
    addToCart,
    getCartItems,
    deleteCartItem
}

