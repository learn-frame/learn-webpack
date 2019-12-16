import styles from './assets/styles/index.module.scss'
import { circle } from './area'
import { Button } from './components/Button/Button'
import moment from 'moment'

import sayaka_1 from './assets/images/sayaka_1.jpg'
import sayaka_2 from './assets/images/sayaka_2.jpg'

const appDOM = document.getElementById('app')

if (appDOM) {
  appDOM.insertAdjacentHTML(
    'afterbegin',
    // `<div class=${styles.hello}>${circle(10)}</div>`,
    `<figure><img class='${styles.img}' src='${sayaka_1}'/><img class='${styles.img}' src='${sayaka_2}'/></figure>`,
    // `<div class=${styles.hello}>${moment().toJSON()}</div>`,
  )
}
