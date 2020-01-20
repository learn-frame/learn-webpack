import { combineReducers } from 'redux'
import AddAndSubtractReducers from './AddAndSubtract/reducers'

const rootReducer = combineReducers({ AddAndSubtractReducers })

export default rootReducer

// eslint-disable-next-line
export type RootState = ReturnType<typeof rootReducer>
