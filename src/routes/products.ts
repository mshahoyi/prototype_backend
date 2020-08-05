import express, { Request, Response } from "express";
import { Db } from "mongodb";

const productsRoute = express.Router();

const getAll = async (req, res: Response) => {
	try {
		const products = await req.db.getAllProducts();
		res.status(200).json(products);
	} catch (e) {
		res.status(500).send("Error Fetching Products");
	}
};

const create = async (req, res: Response) => {
	const product = req.body;
	try {
		await req.db.createProduct(product);
		res.status(201).send(null);
	} catch (e) {
		res.status(500).send("Error Creating Product");
	}
};

const update = async (req, res: Response) => {
	const update = req.body;
	const id = req.params.id;
	try {
		const updated = await req.db.updateProduct(id, update);
		res.status(200).send(updated);
	} catch (e) {
		res.status(500).send("Error Updating Product");
	}
};

const deleteProduct = async (req, res: Response) => {
	const id = req.params.id;
	try {
		await req.db.deleteProduct(id);
		res.status(200).send(null);
	} catch (e) {
		res.status(500).send("Error Deleting Product");
	}
};

const getProduct = async (req, res: Response) => {
	const id = req.params.id;
	try {
		const product = await req.db.getProduct(id);
		res.status(200).send(product);
	} catch (e) {
		res.status(500).send("Error Getting Product");
	}
};

productsRoute.route("/products").get(getAll).post(create);

productsRoute.route("/products/:id").patch(update).delete(deleteProduct).get(getProduct);

export default productsRoute;
