import React, { FC } from 'react'
import ReactDOM from 'react-dom'

export const Button: FC = ({ children }) => {
  return <button>{children}</button>
}

ReactDOM.render(<Button>hello</Button>, document.getElementById('app'))
