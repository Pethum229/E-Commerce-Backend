import express from "express";
import {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  createInventory,
  getInventory,
  updateInventory,
} from "../application/product";
import { isAuthenticated } from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";

export const productRouter = express.Router();

productRouter
  .route("/")
  .get(getProducts)
  .post(createProduct); //Remove isAuthenticated and isAdmin for using with Postman
productRouter
  .route("/:id")
  .get(getProduct)
  .delete(isAuthenticated, isAdmin, deleteProduct)
  // .patch(isAuthenticated, isAdmin, updateProduct);
productRouter
  .route("/inventory")
  .post(createInventory)
  .patch(updateInventory);
productRouter
  .route("/:id/inventory")
  .get(getInventory)
