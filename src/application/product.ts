import { CreateProductDTO } from "../domain/dto/product";
import { CreateInventoryDTO, UpdateInventoryItemDTO } from "../domain/dto/inventory";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import Product from "../infrastructure/schemas/Product";
import Inventory from "../infrastructure/schemas/Inventory";

import { Request, Response, NextFunction } from "express";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      const data = await Product.find();
      res.status(200).json(data);
      return;
    }

    const data = await Product.find({ categoryId });
    res.status(200).json(data);
    return;
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = CreateProductDTO.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError("Invalid product data");
    }
    await Product.create(result.data);
    res.status(201).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const result = CreateInventoryDTO.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError("Invalid inventory data");
    }
    await Inventory.create(result.data);
    res.status(201).send();
    return;
  } catch (error) {
    next(error);
  }
}

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("categoryId");
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(200).json(product).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const id = req.params.id;
    const count = await Inventory.findOne({productId:id})
    if (!count) {
      throw new NotFoundError("No inventory record found");
    }
    res.status(200).json(count);
    return;
  }catch (error) {
    next(error);
  }
}

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(204).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).send(product);
    return;
  } catch (error) {
    next(error);
  }
};

export const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = req.body; // Array of {productId, quantity}
    
    // Process all inventory updates
    const updateOperations = items.map(async (item: { productId: any; quantity: number; }) => {
      let inventory = await Inventory.findOne({ productId: item.productId });
      
      if (!inventory) {
        throw new NotFoundError(`Inventory not found for product ${item.productId}`);
      }

      if (inventory.quantity < item.quantity) {
        throw new ValidationError(`Insufficient inventory for product ${item.productId}`);
      }

      // Decrease the inventory quantity
      let quantity = inventory.quantity -= item.quantity;
      
      await Inventory.findByIdAndUpdate(inventory._id, {quantity: quantity});

    });

    res.status(200).json({ message: "Inventory updated successfully" });
  } catch (error) {
    next(error);
  }
};


