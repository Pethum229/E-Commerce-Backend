import express from "express";
import { createOrder, getOrder, getOrdersForUser } from "../application/order";
import { isAuthenticated } from "./middleware/authentication-middleware";

export const orderRouter = express.Router();

orderRouter.route("/").post(isAuthenticated, createOrder);
orderRouter.route("/user").get(isAuthenticated, getOrdersForUser);
orderRouter.route("/:id").get(getOrder);
