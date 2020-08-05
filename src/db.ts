import { MongoClient, Db, ObjectID } from "mongodb";
import { EventEmitter } from "events";

export default class DB extends EventEmitter {
	private db: Db;

	constructor(uri: string, dbName: string) {
		super();
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		client.connect((e) => {
			if (e) {
				this.emit("dbConnectionFailure");
				return console.error("could not connect to db.", e);
			}

			this.emit("dbConnectionSuccess");
			this.db = client.db(dbName);
		});
	}

	getAllProducts = () =>
		new Promise((resolve, reject) => {
			this.db
				.collection("products")
				.find({})
				.toArray((err, docs) => {
					if (err) return reject(err);
					resolve(docs);
				});
		});

	createProduct = (product) =>
		new Promise((resolve, reject) => {
			this.db.collection("products").insertOne(product, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});

	updateProduct = (id, update) =>
		new Promise((resolve, reject) => {
			this.db
				.collection("products")
				.updateOne({ _id: new ObjectID(id) }, { $set: update }, (err, result) => {
					if (err) return reject(err);
					resolve(result);
				});
		});

	deleteProduct = (id) =>
		new Promise((resolve, reject) => {
			this.db.collection("products").deleteOne({ _id: new ObjectID(id) }, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});

	getProduct = (id) =>
		new Promise((resolve, reject) => {
			this.db.collection("products").findOne({ _id: new ObjectID(id) }, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			});
		});
}

export const appender = (db) => (req, res, next) => {
	req.db = db;
	next();
};
