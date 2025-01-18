const express = require("express");
require("dotenv").config();
const connectDB = require("./App/dbconnect/db-connect");
const bookRoute = require("./App/routes/book.router");
const path = require("path");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
connectDB();

app.use(process.env.API_URL, bookRoute);

const port = process.env.PORT || 7000
app.listen(port, ()=> console.log(`Server is running on ${port} port`));