import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

const Hello = () => <div>{moment().toISOString()}</div>

ReactDOM.render(<Hello />, document.getElementById('app'))
