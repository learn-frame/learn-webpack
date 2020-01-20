import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import moment from 'moment'
import styles from './assets/styles/index.module.scss'

const Hello = () => {
  const [now, setNow] = useState('')

  useEffect(() => {
    setInterval(() => {
      setNow(moment().format('YYYY-MM-DD HH:mm:ss'))
    }, 1000)
  }, [now])
  return (
    <BrowserRouter>
      <div className={styles.hello}>{now}</div>
    </BrowserRouter>
  )
}

ReactDOM.render(<Hello />, document.getElementById('app'))
