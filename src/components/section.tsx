import { motion } from 'framer-motion'

export function Section({ children }: { children: React.ReactNode }) {
  return (
    <motion.section layout="position" className="border border-gray-300 rounded-lg p-4 mb-12">
      {children}
    </motion.section>
  )
}
