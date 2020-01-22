import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import moment from 'moment'
import styles from './assets/styles/index.module.scss'
import configureStore from './stores/configureStore'
import txt from './assets/texts/demo.txt'

const store = configureStore()

const Hello = () => {
  const [now, setNow] = useState('')

  console.log(txt)

  useEffect(() => {
    setInterval(() => {
      setNow(moment().format('YYYY-MM-DD HH:mm:ss'))
    }, 1000)
  }, [now])
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className={styles.hello}>{now}</div>
      </BrowserRouter>
    </Provider>
  )
}

ReactDOM.render(<Hello />, document.getElementById('app'))
