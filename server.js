require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");

const app = express();

const port = process.env.PORT || 5500;

connectDB();

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/login", require("./routes/authenticateApi/login"));
app.use("/register", require("./routes/authenticateApi/register"));
app.use("/refresh", require("./routes/authenticateApi/refresh"));
app.use("/logout", require("./routes/authenticateApi/logout"));

app.use(verifyJWT);

app.use("/users", require("./routes/dataApi/users"));

mongoose.connection.once("open", () => {
    console.log("mongodb connected!");
    app.listen(port, () => {
        console.log(`Server listening at port ${port}`);
    });
});
// app.listen(port, () => {
//     console.log(`Server listening at port ${port}`);
// });
