
const RECEIVE_USER = "'receive_user'"

function userid(state = '', action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.data
    default:
      return state
  }
}

export default userid