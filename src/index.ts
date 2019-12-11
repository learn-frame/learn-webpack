import moment from 'moment'

// import './assets/styles/index.css'
// import styles from './assets/styles/index.module.css'
import './assets/styles/index.scss'

const appDOM = document.getElementById('app')

if (appDOM) {
  // setInterval(function() {
  //   appDOM.innerHTML = moment().format('YYYY/MM/DD, HH:mm:ss')
  // }, 1000)

  appDOM.insertAdjacentHTML(
    'afterbegin',
    `<div class='hello'>hello, webpack</div>`,
  )

  // appDOM.insertAdjacentHTML(
  //   'afterbegin',
  //   `<div class='${styles.hello}'>hello, webpack</div>`,
  // )
}
