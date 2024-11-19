import { useToast } from '@/hooks/use-toast'
import type { Product } from '@/models/product'

import { useState } from 'react'

export function ShareCart({ products }: { products: Product[] }) {
  const [copy, setCopy] = useState(0)
  const ref = useToast(copy)

  return (
    <div className="relative">
      <button
        type="button"
        className="h-max py-2 px-3 w-max inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-gray-500 focus:outline-none focus:border-gray-500 focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none"
        onClick={() => {
          navigator.clipboard.writeText(
            `${window.location.host}?products=${products.map((p) => `${p.id}-${p.quantity}`).join(',')}`
          )
          setCopy((prevState) => prevState + 1)
        }}
      >
        Compartir
      </button>

      <div
        className="pointer-events-none w-max absolute bottom-4 right-[105%] px-2 py-1 rounded-3xl border border-blue-500 shadow-2xl transition duration-300 ease-in-out"
        style={{ opacity: 0 }}
        role="alert"
        ref={ref}
      >
        <p className="text-sm text-blue-500">¡Url del carrito copiada correctamente!</p>
      </div>
    </div>
  )
}
