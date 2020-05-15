import { User } from '../user.model'

export interface State {
  user: User
}

const initialState: State = {
  user: null,
}

export function authReduecer(state = initialState, action) {
  switch (action.type) {
    // case value:

    //   break;

    default:
      return state
  }
}
