import styles from './assets/styles/index.module.scss'
import { circle } from './area'
import { Button } from './components/Button/Button'

const appDOM = document.getElementById('app')

if (appDOM) {
  appDOM.insertAdjacentHTML(
    'afterbegin',
    `<div class=${styles.hello}>${circle(10)}</div>`,
  )
}
