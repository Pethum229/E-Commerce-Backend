import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ValidationError from "../domain/errors/validation-error";
import Order from "../infrastructure/schemas/Order";
import { getAuth } from "@clerk/express";
import NotFoundError from "../domain/errors/not-found-error";
import Address from "../infrastructure/schemas/Address";
import { CreateOrderDTO } from "../domain/dto/order";
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = CreateOrderDTO.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError("Invalid order data");
    }

    const userId = req.auth.userId;

    const address = await Address.create({
      ...result.data.shippingAddress,
    });

    await Order.create({
      userId,
      items: result.data.items,
      addressId: address._id,
    });

    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).populate({
      path: "addressId",
      model: "Address",
    })
    // .populate({
    //   path:"items."
    // });
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// export const getOrderForUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const auth = getAuth(req)
//     const id = auth.userId;
//     console.log("UserID",id);
//     const order = await Order.findById({userId:id})
//     if (!order) {
//       throw new NotFoundError("Order not found");
//     }
//     res.status(200).json(order);
//   } catch (error) {
//     next(error);
//   }
// };

export const getOrderForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = getAuth(req);
    const id = auth?.userId;

    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find orders for the authenticated user
    const order = await Order.findOne({ userId: id }); // ✅ Corrected query

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrdersForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user ID from the authenticated request
    const userId = req.auth.userId;  // Clerk provides the userId in req.auth
    
    // Find all orders for this user
    const orders = await Order.find({ userId: userId });
    
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
