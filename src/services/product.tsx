import type { Product } from '@/models/product'

const BASE_URL = 'https://fakestoreapi.com'

export async function getProduct(id: number, qty: number): Promise<[null, Product] | [Error, null]> {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`)

    if (!response.ok) {
      return [new Error('Something went wrong'), null]
    }

    const data = (await response.json()) as Omit<Product, 'quantity'>
    const formattedData = {
      ...data,
      quantity: qty
    }

    return [null, formattedData]
  } catch (error) {
    if (error instanceof Error) {
      return [error, null]
    }

    return [new Error('Something went wrong'), null]
  }
}
