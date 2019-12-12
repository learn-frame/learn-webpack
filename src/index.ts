import styles from './assets/styles/index.module.scss'
import { circle } from './area'

const appDOM = document.getElementById('app')

if (appDOM) {
  appDOM.insertAdjacentHTML(
    'afterbegin',
    `<div class=${styles.hello}>${circle(100)}</div>`,
  )
}
