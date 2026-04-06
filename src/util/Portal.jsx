import { createPortal } from 'react-dom'

export default function Portal({ children }) {
  const el = document.getElementById('portal-root')
  return createPortal(children, el)
}