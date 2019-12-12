import moment from 'moment'

// import './assets/styles/index.css'
// import styles from './assets/styles/index.module.css'
// import './assets/styles/index.scss'
import styles from './assets/styles/index.module.scss'

import Sayaka from '../public/assets/images/sayaka_2.jpg'

const appDOM = document.getElementById('app')

if (appDOM) {
  // setInterval(function() {
  //   appDOM.innerHTML = moment().format('YYYY/MM/DD, HH:mm:ss')
  // }, 1000)

  // appDOM.insertAdjacentHTML(
  //   'afterbegin',
  //   `<div class='hello'>hello, webpack</div>`,
  // )

  appDOM.insertAdjacentHTML(
    'afterbegin',
    `<figure><img class='${styles.img}' src=${Sayaka} alt='老婆'/></div>`,
  )
}
