require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/save-order", require("./routes/saveOrder"));
app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {

    console.log(
        "Server running on port 3000"
    );

});