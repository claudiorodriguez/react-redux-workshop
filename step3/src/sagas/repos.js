import {call, fork, put, takeLatest} from 'redux-saga/effects';
import {fetchByOrg} from '../api/repos';
import {
  errorRequestingRepos,
  receivedRepos,
  types
} from '../actions/repos';

export const fetchReposFromApi = function *(action) {
  try {
    const {payload: {organization}} = action;

    const reposFromApi = yield call(fetchByOrg, organization);

    yield put(receivedRepos(reposFromApi));
  } catch (error) {
    yield put(errorRequestingRepos(error));
  }
};

const watchRequestRepos = function *() {
  yield takeLatest(types.REQUEST_REPOS, fetchReposFromApi);
};

export default function *repos () {
  yield [
    fork(watchRequestRepos)
  ];
}
