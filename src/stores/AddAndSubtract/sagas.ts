import { put, takeEvery, delay } from 'redux-saga/effects';

export function* incrementAsync() {
  yield delay(2000);
  // redux-saga 通过 dispatch 发起一个 INCREASE 的 action
  yield put({ type: 'INCREASE' });
}

export function* watchIncrementAsync() {
  // takeEvery 用于监听所有 INCREASE_ASYNC 的 action
  yield takeEvery('INCREASE_ASYNC', incrementAsync);
}