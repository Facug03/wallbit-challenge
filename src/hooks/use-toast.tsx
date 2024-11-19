import { useEffect, useRef } from 'react'

export function useToast(show: number) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (show === 0) return

    const { current } = ref

    if (!current) return

    current.style.opacity = '1'
    const timeout = setTimeout(() => {
      current.style.opacity = '0'
    }, 1500)

    return () => clearTimeout(timeout)
  }, [show])

  return ref
}
