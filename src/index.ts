import express from "express";
import productsRoute from "./routes/products";
require("dotenv").config();
import DB, { appender } from "./db";

const app = express();
const db = new DB(process.env.DB_URI, process.env.DB_NAME);
db.on("dbConnectionFailure", (e) => {
	console.error("could not connect to db. Server will exit", e);
	process.exit();
});

app.use(appender(db));
app.use(express.json());
app.use("/api/v1", productsRoute);

const PORT = 7000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
