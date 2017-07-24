# Step 4

Goal: add tests with jest

In these kinds of apps, it's a good idea to make components as dumb as possible - they take in state, and dispatch actions. Some inevitable exceptions will arise, but the general rule should be to keep them as simple as possible. The real meat-and-bones will be in the sagas, actions and reducers - so our focus while testing should be on those.

I'll just provide example tests for the main saga, the reducer, and the components (using both enzyme and jest snapshots to showcase both approaches, which are not exclusive at all).

  - `npm install --save-dev babel-jest jest identity-obj-proxy enzyme react-test-renderer`
    - `babel-jest`: for jest to run js files through babel
    - `jest`: to run our test suite
    - `identity-obj-proxy`: we're not going through webpack, so we need something to replace CSS modules - this is just a proxy that, when trying to access any property, will return the key as a string
  - Modify your `package.json`, adding a new `jest` section, and a `test` script in `scripts`:
    ```json
    {
      ...
      "scripts": {
        ...
        "test": "jest"
      },
      ...
      "jest": {
        "collectCoverageFrom": [
          "src/**/*.js"
        ],
        "moduleNameMapper": {
          "\\.(scss)$": "identity-obj-proxy"
        },
        "transform": {
          "^.+\\.js$": "babel-jest"
        }
      }
    }
    ```
  - Create `test/.eslintrc.json` to add some jest-specific rules:
    ```json
    {
      "extends": "mailonline/jest"
    }
    ```
  - Create `test/sagas/repos.spec.js`:
    ```js
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
    ```
  - Create `test/reducers/repos.spec.js`:
    ```js
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

      it('receivedRepos sets repos and stops loading', () => {
        const initialStateWithLoading = {
          ...initialState,
          loading: true
        };
        const receiveAction = receivedRepos(mockRepos);
        const newState = reposReducer(initialStateWithLoading, receiveAction);

        expect(newState.loading).toBe(false);
        expect(newState.repos).toBe(mockRepos);
      });

      it('requestRepos starts loading and empties results', () => {
        const orgName = 'github';
        const stateWithResults = {
          ...initialState,
          loading: true,
          repos: mockRepos
        };
        const requestAction = requestRepos(orgName);
        const newState = reposReducer(stateWithResults, requestAction);

        expect(newState.loading).toBe(true);
        expect(newState.repos).toBe(null);
      });
    });
    ```
  - Create `test/components/GetReposButton.spec.js` (using enzyme):
    ```js
    import React from 'react';
    import {shallow} from 'enzyme';
    import {GetReposButtonPureComponent as GetReposButton} from '../../src/components/GetReposButton';
    import {requestRepos} from '../../src/actions/repos';

    const HARDCODED_ORG_NAME = 'github';

    describe('<GetReposButton/>', () => {
      it('disables button while fetching', () => {
        const dispatch = jest.fn();
        const component = shallow(
          <GetReposButton dispatch={dispatch} fetching={true} />
        );

        expect(component.find('button').prop('disabled')).toBe(true);
        component.simulate('click');
        expect(dispatch).not.toHaveBeenCalled();
      });

      it('dispatches requestRepos on click when not disabled', () => {
        const dispatch = jest.fn();
        const component = shallow(
          <GetReposButton dispatch={dispatch} fetching={false} />
        );

        expect(component.find('button').prop('disabled')).toBe(false);
        component.simulate('click');
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(requestRepos(HARDCODED_ORG_NAME));
      });
    });
    ```
  - Create `test/components/RepoList.spec.js` (using snapshots):
    ```js
    import React from 'react';
    import renderer from 'react-test-renderer';
    import {RepoListPureComponent as RepoList} from '../../src/components/RepoList';

    const mockRepos = [
      {
        name: 'firstrepo',
        url: 'https://github.com/orgname/firstrepo'
      },
      {
        name: 'secondrepo',
        url: 'https://github.com/orgname/secondrepo'
      }
    ];

    describe('<RepoList/>', () => {
      it('renders "Loading" while fetching', () => {
        const tree = renderer.create(<RepoList fetching={true} />).toJSON();

        expect(tree).toMatchSnapshot();
      });

      it('renders "No results" when repos prop is null', () => {
        const tree = renderer.create(<RepoList fetching={false} repos={null} />).toJSON();

        expect(tree).toMatchSnapshot();
      });

      it('renders repo list with results when not fetching', () => {
        const tree = renderer.create(<RepoList fetching={false} repos={mockRepos} />).toJSON();

        expect(tree).toMatchSnapshot();
      });
    });
    ```
  - Get a coverage report with `npm run test -- --coverage`


That's it! I hope you enjoyed the workshop. Feel free to contact me if you have any questions, or create an issue in this repository.
