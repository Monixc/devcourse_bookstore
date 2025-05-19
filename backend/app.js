const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");
const categoryRouter = require("./routes/category");
const likeRouter = require("./routes/likes");
const cartRouter = require("./routes/carts");
const orderRouter = require("./routes/orders");

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
