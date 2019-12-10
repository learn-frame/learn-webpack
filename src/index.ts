import moment from 'moment'
import join from 'lodash/join'

console.log(join)

const appDOM = document.getElementById('app')

if (appDOM) {
  setInterval(function() {
    appDOM.innerHTML = moment().format('YYYY/MM/DD, HH:mm:ss')
  }, 1000)
}
