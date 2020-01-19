import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

const getNow = () => moment().format('YYYY-MM-DD HH:mm:ss')

const Hello = () => {
  const [now, setNow] = useState('')

  useEffect(() => {
    setInterval(() => {
      setNow(getNow())
    }, 1000)
  }, [now])
  return <div>{now}</div>
}

ReactDOM.render(<Hello />, document.getElementById('app'))
