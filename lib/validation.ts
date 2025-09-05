import { z } from "zod"

export const productFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.string().transform((v)=> (v? parseInt(v,10): undefined)).optional(),
  maxPrice: z.string().transform((v)=> (v? parseInt(v,10): undefined)).optional(),
  q: z.string().optional(),
})

export const favoriteSchema = z.object({
  productId: z.string().uuid().optional(),
  quoteId: z.string().uuid().optional(),
}).refine((d)=> !!d.productId || !!d.quoteId, { message: "Either productId or quoteId is required" })

export type ProductFilter = z.infer<typeof productFilterSchema>
