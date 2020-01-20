import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import styles from './assets/styles/index.module.scss'

const getNow = () => moment().format('YYYY-MM-DD HH:mm:ss')

const Hello = () => {
  const [now, setNow] = useState('')

  useEffect(() => {
    setInterval(() => {
      setNow(getNow())
    }, 1000)
  }, [now])
  return <div className={styles.hello}>{now}</div>
}

ReactDOM.render(<Hello />, document.getElementById('app'))
