import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './rootReducer'
import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState?: {}) {
  // 收集中间件
  const middlewares = [sagaMiddleware, logger]

  // 应用中间件
  const middlewareEnhancer = applyMiddleware(...middlewares)

  // 收集增强，增强可以包含中间件和一些手写的增强
  const enhancers = [middlewareEnhancer]

  // 组合增强
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(rootReducer, initialState, composedEnhancers)

  sagaMiddleware.run(rootSaga)

  // @ts-ignore
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    // @ts-ignore
    module.hot.accept('./rootReducer', () => store.replaceReducer(rootReducer))
  }

  return store
}
