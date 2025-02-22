import {z} from "zod";

export const CreateInventoryDTO = z.object({
    productId: z.string(),
    quantity: z.number(),
  });

export const UpdateInventoryItemDTO = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
});

export const UpdateInventoryDTO = z.array(UpdateInventoryItemDTO);