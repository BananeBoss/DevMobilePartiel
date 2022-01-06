const initialState = { favActorsID: [] }

function favActors(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'SAVE_ACTOR':
      nextState = {
        ...state,
        favActorsID: [...state.favActorsID, action.value]
      };
      return nextState || state
    case 'UNSAVE_ACTOR':
      nextState = {
        ...state,
        favActorsID: state.favActorsID.filter(id => id !== action.value)
      };
      return nextState || state
    default:
      return state
  };
}

export default favActors;