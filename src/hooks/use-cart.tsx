import type { Cart } from '@/models/cart'
import type { Product } from '@/models/product'
import { getProduct } from '@/services/product'

import { useEffect, useReducer } from 'react'

const initialCart: Cart = (() => {
  const storedCart = localStorage.getItem('cart')

  return storedCart ? JSON.parse(storedCart) : { products: [], createdAt: '', cost: 0, totalProducts: 0 }
})()

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const { product, quantity } = action.payload

      const existingProduct = state.products.find((p) => p.id === product.id)

      let updatedProducts: Product[] = []

      if (existingProduct) {
        updatedProducts = state.products.map((p) =>
          p.id === product.id ? { ...p, quantity: quantity > 0 ? p.quantity + quantity : p.quantity } : p
        )
      } else {
        updatedProducts = [...state.products, { ...product, quantity: quantity > 0 ? quantity : 1 }]
      }

      const updatedCart = {
        ...state,
        products: updatedProducts,
        createdAt:
          state.createdAt ||
          new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit'
          }),
        cost: calculateCost(updatedProducts),
        totalProducts: updatedProducts.length
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return updatedCart
    }

    case 'REMOVE_PRODUCT': {
      const updatedProducts = state.products.filter((product) => product.id !== action.payload.id)

      const updatedCart = {
        ...state,
        products: updatedProducts,
        cost: calculateCost(updatedProducts),
        totalProducts: updatedProducts.length
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return updatedCart
    }

    case 'CHANGE_QTY': {
      const { id, quantity } = action.payload

      const updatedProducts = state.products
        .map((product) => (product.id === id ? { ...product, quantity } : product))
        .filter((p) => p.quantity > 0)

      const updatedCart = {
        ...state,
        products: updatedProducts,
        cost: calculateCost(updatedProducts),
        totalProducts: updatedProducts.length
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return updatedCart
    }

    case 'SET_PRODUCTS': {
      const { products } = action.payload

      const newCart = {
        products: products,
        createdAt: new Date().toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: '2-digit'
        }),
        cost: calculateCost(products),
        totalProducts: products.length
      }

      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    }

    default:
      return state
  }
}

type CartAction =
  | { type: 'ADD_PRODUCT'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_PRODUCT'; payload: { id: number } }
  | { type: 'CHANGE_QTY'; payload: { id: number; quantity: number } }
  | { type: 'SET_PRODUCTS'; payload: { products: Product[] } }

function calculateCost(products: Product[]): number {
  return products.reduce((total, product) => total + product.price * product.quantity, 0)
}

export function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)

  useEffect(() => {
    const products = new URLSearchParams(window.location.search).get('products')

    if (!products) {
      return
    }

    const parsedProducts = products.split(',').map((p) => p.split('-'))
    const productsPromises = parsedProducts.map(([id, quantity]) => getProduct(Number(id), Number(quantity)))

    Promise.all(productsPromises).then((results) => {
      const products = results.map(([error, product]) => {
        if (error) {
          throw error
        }

        return product
      })

      dispatch({ type: 'SET_PRODUCTS', payload: { products } })
    })
  }, [])

  const addProduct = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_PRODUCT', payload: { product, quantity } })
  }

  const removeProduct = (id: number) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: { id } })
  }

  const changeQty = (id: number, quantity: number) => {
    dispatch({ type: 'CHANGE_QTY', payload: { id, quantity } })
  }

  return { cart, addProduct, removeProduct, changeQty }
}
// const parsedProducts = productsParams.split(',').map((p) => p.split('-'))

//     const productsPromises = parsedProducts.map(([id, quantity]) => getProduct(Number(id), Number(quantity)))

//     Promise.all(productsPromises).then((results) => {
//       const products = results.map(([error, product]) => {
//         if (error) {
//           throw error
//         }

//         return product
//       })

//       localStorage.setItem(
//         'cart',
//         JSON.stringify({
//           products,
//           createdAt: new Date().toLocaleDateString('es-ES', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: '2-digit'
//           }),
//           cost: calculateCost(products),
//           totalProducts: products.length
//         })
//       )
//     })
//   }
