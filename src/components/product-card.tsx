import type { Product } from '@/models/product'

import { MinusCircle, PlusCircle, Star, TrashSimple } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

export function ProductCard({
  product,
  removeProduct,
  changeQty
}: { product: Product; removeProduct: (id: number) => void; changeQty: (id: number, quantity: number) => void }) {
  const [more, setMore] = useState(false)

  return (
    <motion.article
      layout="position"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="flex gap-4 p-4 items-center border border-gray-300 rounded-lg mb-4 flex-wrap sm:flex-nowrap"
    >
      <motion.img
        layout="position"
        src={product.image}
        alt={product.title}
        className="w-full rounded-lg max-w-24 aspect-square object-contain"
      />

      <motion.div layout="position" className="flex flex-col gap-1">
        <motion.h2 layout="position" className="text-lg sm:text-xl font-bold">
          {product.title}
        </motion.h2>
        <motion.p layout="position" className="text-sm text-gray-500">
          ${product.price}
        </motion.p>

        <motion.div layout="position" className="flex gap-x-2 items-center flex-wrap">
          <motion.p layout="position" className="text-sm text-blue-500 font-semibold">
            Cantidad:
          </motion.p>

          <div className="flex gap-x-2 items-center">
            <motion.button
              layout="position"
              type="button"
              className="flex justify-center items-center text-sm font-medium rounded-lg border-transparent text-blue-600 hover:text-blue-400 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => changeQty(product.id, product.quantity + 1)}
            >
              <PlusCircle size={24} />
            </motion.button>

            <motion.p layout="position" className="text-sm text-gray-500">
              {product.quantity}
            </motion.p>

            <motion.button
              layout="position"
              type="button"
              className="flex justify-center items-center text-sm font-medium rounded-lg border-transparent text-blue-600 hover:text-blue-400 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => changeQty(product.id, product.quantity - 1)}
            >
              <MinusCircle size={24} />
            </motion.button>
          </div>
        </motion.div>

        <motion.button
          layout="position"
          whileTap={{ scale: 0.95 }}
          type="button"
          className="py-1 px-2 w-max inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-gray-500 focus:outline-none focus:border-gray-500 focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none"
          onClick={() => setMore((prevState) => !prevState)}
        >
          {more ? 'Ver menos' : 'Ver más'}
        </motion.button>

        <AnimatePresence mode="popLayout">
          {more && (
            <motion.div
              layout="position"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0, y: -25 }}
              className="flex flex-col gap-1"
            >
              <motion.p className="text-sm text-gray-500">
                <span className="text-blue-500 font-semibold">Categoría</span>: {product.category}
              </motion.p>
              <motion.p className="text-sm text-gray-500 flex gap-1 items-center">
                {product.rating.rate} <Star size={16} />
              </motion.p>
              <motion.p className="text-sm text-gray-500">{product.description}</motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.button
        layout="position"
        type="button"
        className="ml-auto py-3 px-3 flex justify-center items-center text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        onClick={() => removeProduct(product.id)}
      >
        <TrashSimple size={20} />
      </motion.button>
    </motion.article>
  )
}
