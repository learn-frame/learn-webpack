const INCREASE = 'INCREASE'
const DECREASE = 'DECREASE'
const INCREASE_ASYNC = 'INCREASE_ASYNC'

const actions = {
  increase: () => ({ type: INCREASE, payload: { name: 'yancey' } }),
  decrease: () => ({ type: DECREASE }),
  increaseAsync: () => ({
    type: INCREASE_ASYNC,
  }),
}

export default actions
