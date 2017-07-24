import {call, put} from 'redux-saga/effects';
import {errorRequestingRepos, receivedRepos, requestRepos} from '../../src/actions/repos';
import {fetchByOrg} from '../../src/api/repos';
import {fetchReposFromApi} from '../../src/sagas/repos';

describe('repo sagas', () => {
  describe('fetchReposFromApi', () => {
    it('puts receivedRepos action after fetching successfully', () => {
      const orgName = 'github';
      const requestAction = requestRepos(orgName);
      const mockResults = [
        {
          name: 'somerepo',
          url: 'http://github.com/github/somerepo'
        }
      ];
      const iterator = fetchReposFromApi(requestAction);

      expect(iterator.next().value).toEqual(call(fetchByOrg, orgName));
      expect(iterator.next(mockResults).value).toEqual(put(receivedRepos(mockResults)));
      expect(iterator.next().done).toBe(true);
    });

    it('puts error action if requesting repos failed', () => {
      const orgName = 'github';
      const requestAction = requestRepos(orgName);
      const error = new Error('error fetching repos');
      const iterator = fetchReposFromApi(requestAction);

      expect(iterator.next().value).toEqual(call(fetchByOrg, orgName));
      expect(iterator.throw(error).value).toEqual(put(errorRequestingRepos(error)));
      expect(iterator.next().done).toBe(true);
    });
  });
});
