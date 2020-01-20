import { all } from 'redux-saga/effects'
import { watchIncrementAsync } from './AddAndSubtract/sagas'

export default function* rootSaga() {
  yield all([watchIncrementAsync()])
}
