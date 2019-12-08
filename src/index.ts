import moment from 'moment'
import { Button } from '@components/Button'

const appDOM = document.getElementById('app')

console.log(Button)

if (appDOM) {
  setInterval(function() {
    appDOM.innerHTML = moment().format('YYYY/MM/DD, HH:mm:ss')
  }, 1000)
}
