import moment from 'moment'
import { Button } from '@components/Button/Button'

const appDOM = document.getElementById('app')

if (appDOM) {
  setInterval(function() {
    appDOM.innerHTML = moment().format('YYYY/MM/DD, HH:mm:ss')
  }, 1000)
}
