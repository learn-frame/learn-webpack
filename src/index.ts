import moment from 'moment'

const now = moment()

const appDOM = document.getElementById('app')
if (appDOM) {
  appDOM.innerHTML = now.toISOString()
}
