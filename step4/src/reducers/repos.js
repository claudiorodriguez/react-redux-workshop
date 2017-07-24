import {types} from '../actions/repos';

const {
  ERROR_REQUESTING_REPOS,
  RECEIVED_REPOS,
  REQUEST_REPOS
} = types;

export const initialState = {
  error: null,
  fetching: false,
  repos: null
};

export default function repos (state = initialState, action) {
  switch (action.type) {
  case ERROR_REQUESTING_REPOS:
    return {
      ...state,
      error: action.payload.error
    };
  case RECEIVED_REPOS:
    return {
      ...state,
      fetching: false,
      repos: action.payload.repos
    };
  case REQUEST_REPOS:
    return {
      ...state,
      fetching: true,
      repos: null
    };
  default:
    return state;
  }
}
