import {
  errorRequestingRepos,
  receivedRepos,
  requestRepos
} from '../../src/actions/repos';
import reposReducer, {initialState} from '../../src/reducers/repos';

describe('repos reducer', () => {
  const mockRepos = [
    {
      name: 'reponame',
      url: 'http://github.com/org/reponame'
    }
  ];

  it('error action sets error', () => {
    const error = new Error('error fetching');
    const errorAction = errorRequestingRepos(error);

    expect(reposReducer(initialState, errorAction).error).toBe(error);
  });

  it('receivedRepos sets repos and stops fetching', () => {
    const initialStateWithFetching = {
      ...initialState,
      fetching: true
    };
    const receiveAction = receivedRepos(mockRepos);
    const newState = reposReducer(initialStateWithFetching, receiveAction);

    expect(newState.fetching).toBe(false);
    expect(newState.repos).toBe(mockRepos);
  });

  it('requestRepos starts fetching and empties results', () => {
    const orgName = 'github';
    const stateWithResults = {
      ...initialState,
      fetching: false,
      repos: mockRepos
    };
    const requestAction = requestRepos(orgName);
    const newState = reposReducer(stateWithResults, requestAction);

    expect(newState.fetching).toBe(true);
    expect(newState.repos).toBe(null);
  });
});
