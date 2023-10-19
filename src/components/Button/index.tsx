import React, { FC, ReactNode } from 'react'

interface Props {
  onClick: () => void
  children: ReactNode
}

const Button: FC<Props> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>
}

export default Button
