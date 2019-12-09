import moment from 'moment'
import join from 'lodash/join'
import { Button } from '@components/Button/Button'

console.log(join)
console.log(Button)

const appDOM = document.getElementById('app')

if (appDOM) {
  setInterval(function() {
    appDOM.innerHTML = moment().format('YYYY/MM/DD, HH:mm:ss')
  }, 1000)
}
