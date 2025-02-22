import express from "express";

import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import "dotenv/config";
import { categoryRouter } from "./api/category";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import { orderRouter } from "./api/order";
import { productRouter } from "./api/product";
import { connectDB } from "./infrastructure/db";
import bodyParser from "body-parser";

const app = express();

app.use(clerkMiddleware());
// app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(cors({ origin: "http://localhost:5173" }));

// app.post(
//   "/api/stripe/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   handleWebhook
// );

app.use(express.json()); // For parsing JSON requests

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
// app.use("/api/payments", paymentsRouter);

app.use(globalErrorHandlingMiddleware);

connectDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
