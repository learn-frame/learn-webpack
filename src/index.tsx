import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import moment from 'moment'
import Button from './components/Button'
import Img from './assets/images/picha.jpg'
import styles from './assets/styles/index.module.scss'
// import txt from './assets/texts/demo.txt'

const App = () => {
  const [now, setNow] = useState('')
  const [num, setNum] = useState(0)
  // console.log(txt)

  useEffect(() => {
    setInterval(() => {
      setNow(moment().format('YYYY-MM-DD HH:mm:ss'))
    }, 1000)
  }, [now])
  return (
    <section>
      <div >{now}</div>
      <div className={styles.bg} />
      <img src={Img} alt='' />
      <div>{num}</div>
      <Button onClick={() => setNum(num + 1)}>hello</Button>
    </section>
  )
}

const $rootEl = document.getElementById('app') as HTMLElement
ReactDOM.createRoot($rootEl).render(<App />)
