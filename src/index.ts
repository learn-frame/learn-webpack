import moment from 'moment'
import join from 'lodash/join'
import { Button } from '@components/Button/Button'

const appDOM = document.getElementById('app')

if (appDOM) {
  setInterval(function() {
    // appDOM.innerHTML = moment().format('YYYY/MM/DD, HH:mm:ss')
    appDOM.innerHTML = join(['a', 'b', 'c'], '~')
  }, 1000)
}
