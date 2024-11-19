import { ProductCard } from '@/components/product-card'
import { Section } from '@/components/section'
import { ShareCart } from '@/components/share-cart'
import { useCart } from '@/hooks/use-cart'
import { getProduct } from '@/services/product'

import { ShoppingCartSimple } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

function App() {
  const { cart, addProduct, removeProduct, changeQty } = useCart()
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const id = formData.get('id')
    const qty = formData.get('quantity')

    console.log({
      formData,
      id,
      qty
    })

    if (!id || !qty) {
      return
    }

    const [error, product] = await getProduct(Number(id), Number(qty))

    if (error) {
      setError('Error obteniendo el producto')
      return
    }

    setError(null)
    addProduct(product, Number(qty))
  }

  return (
    <main className="py-5 px-4">
      <h1 className="font-bold text-3xl mb-12">
        El topo <img src="/mole.png" alt="logo" className="size-8 inline" />
      </h1>

      <Section>
        <h2 className="text-xl mb-6 font-semibold text-blue-500">Agrega los productos al carro de compras</h2>

        <form className="flex gap-4 flex-wrap" onSubmit={onSubmit}>
          <div className="max-w-sm w-full">
            <label htmlFor="input-qty" className="block text-sm font-medium mb-2">
              Cantidad
            </label>
            <input
              type="number"
              name="quantity"
              id="input-qty"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Ej: 10"
            />
          </div>

          <div className="max-w-sm w-full">
            <label htmlFor="input-id" className="block text-sm font-medium mb-2">
              Id del producto
            </label>
            <input
              type="number"
              name="id"
              id="input-id"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Ej: 1"
            />
          </div>

          <button
            type="submit"
            className="py-3 self-end px-4 inline-flex h-max items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            Agregar
          </button>
        </form>
        <p className="text-red-600 text-sm mt-2">{error}</p>
      </Section>

      <Section>
        <header className="flex justify-between mb-6">
          <div className="flex flex-col gap-x-4">
            <h2 className="text-xl font-semibold text-blue-500">Carrito</h2>
            {cart.createdAt && <span className="text-sm text-gray-500">Creado: {cart.createdAt}</span>}
          </div>

          <ShareCart products={cart.products} />
        </header>

        <AnimatePresence mode="popLayout">
          {cart.products.map((product) => (
            <ProductCard key={product.id} product={product} removeProduct={removeProduct} changeQty={changeQty} />
          ))}

          {cart.products.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <ShoppingCartSimple className="mb-4" size={36} />
              <h4 className="text-center text-gray-800 text-xl">Tu carrito está vacío</h4>
              <p className="text-center text-gray-500 text-sm">Agrega algunos productos al carrito para comenzar</p>
            </motion.div>
          )}
        </AnimatePresence>

        {cart.products.length > 0 && (
          <div className="flex flex-col justify-center items-end">
            <p className="text-[15px] text-gray-700">Productos: {cart.totalProducts}</p>
            <p className="text-[15px] text-gray-700">Total: ${cart.cost.toFixed(2)}</p>
          </div>
        )}
      </Section>
    </main>
  )
}

export default App
