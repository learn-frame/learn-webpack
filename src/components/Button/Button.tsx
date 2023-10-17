import React, { FC, ReactNode } from 'react'
import ReactDOM from 'react-dom/client'

interface Props {
  children: ReactNode
}

export const Button: FC<Props> = ({ children }) => {
  return <button>{children}</button>
}

const $rootEl = document.getElementById('app') as HTMLElement
ReactDOM.createRoot($rootEl).render(<Button>hello</Button>)
