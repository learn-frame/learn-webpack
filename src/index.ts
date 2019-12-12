import moment from 'moment'

// import './assets/styles/index.css'
// import styles from './assets/styles/index.module.css'
// import './assets/styles/index.scss'
import styles from './assets/styles/index.module.scss'

import Picha from './assets/images/picha.jpg'

import { circle } from './area'

const appDOM = document.getElementById('app')

if (appDOM) {
  // setInterval(function() {
  //   appDOM.innerHTML = moment().format('YYYY/MM/DD, HH:mm:ss')
  // }, 1000)
  appDOM.insertAdjacentHTML(
    'afterbegin',
    // `<div class='hello'>hello, webpack</div>`,
    `<figure><img class='${styles.img}' src=${Picha} /></div>`,
    // `<div class='${styles.bg}'></div>`,
  )

  // appDOM.insertAdjacentHTML(
  //   'afterbegin',
  //   `<div class='hello'>${circle(100)}</div>`,
  // )
}
