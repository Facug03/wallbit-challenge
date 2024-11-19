import type { Product } from './product'

export interface Cart {
  products: Product[]
  totalProducts: number
  cost: number
  createdAt: string
}
