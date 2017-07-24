# Step 3

Goal: build our actual app with redux and redux-saga

  - `npm install --save-dev babel-plugin-transform-async-to-generator babel-plugin-transform-runtime babel-preset-stage-3 react-redux redux redux-saga whatwg-fetch`
    - `babel-plugin-transform-async-to-generator`: to use async/await
    - `babel-plugin-transform-runtime`: in a real production environment we'd only use this for tests, and babel-preset-env + useBuiltIns + babel-polyfill for the actual bundle, but for simplicity's sake we'll just use this one here on its own - please do look into babel-preset-env
    - `babel-preset-stage-3`: for object rest spread (`{...}`)
    - `react-redux`: to connect redux state to react components
    - `redux-saga`: to handle side effects in our app (e.g. fetching from the github API)
  - Add `stage-3` preset and `transform-runtime` plugin to our `.babelrc` config:
    ```json
    {
      "presets": ["es2015", "stage-3", "react"],
      "plugins": [
        ["transform-runtime", {
          "helpers": false,
          "polyfill": false,
          "regenerator": true
        }]
      ]
    }
    ```
  - Start with the action creators - create `src/actions/repos.js`:
    ```js
    export const types = {
      ERROR_REQUESTING_REPOS: 'ERROR_REQUESTING_REPOS',
      RECEIVED_REPOS: 'RECEIVED_REPOS',
      REQUEST_REPOS: 'REQUEST_REPOS'
    };

    export const errorRequestingRepos = (error) => ({
      payload: {
        error
      },
      type: types.ERROR_REQUESTING_REPOS
    });

    export const receivedRepos = (repos) => ({
      payload: {
        repos
      },
      type: types.RECEIVED_REPOS
    });

    export const requestRepos = (organization) => ({
      payload: {
        organization
      },
      type: types.REQUEST_REPOS
    });
    ```
  - Now the reducer - create `src/reducers/repos.js`:
    ```js
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
    ```
  - And a root reducer which won't make much sense here, but would combine multiple ones in a real app - create `src/reducers/index.js`:
    ```js
    import {combineReducers} from 'redux';
    import repos from './repos';

    const reducers = combineReducers({
      repos
    });

    export default reducers;
    ```
  - Add a `fetch` polyfill to our app - modify `src/index.js` and add this to the very top:
    ```js
    // eslint-disable-next-line import/no-unassigned-import
    import 'whatwg-fetch';
    ```
  - Let's create an API for fetching the repos - create `src/api/repos.js`:
    ```js
    export const fetchByOrg = async (organization) => {
      const endpoint = `https://api.github.com/orgs/${organization}/repos`;
      const response = await fetch(endpoint);
      const json = await response.json();

      if (response.status < 200 || response.status >= 400) {
        const error = new Error(json && json.message || response.statusText);

        error.response = response;
        throw error;
      }

      return json.map(
        // eslint-disable-next-line id-match
        ({name, html_url}) => ({
          name,
          url: html_url
        })
      );
    };
    ```
  - Now it's time to create our saga - create `src/sagas/repos.js`:
    ```js
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
    ```
  - Next, we create a root saga, much like the root reducer - create `src/sagas/index.js`:
    ```js
    import {fork} from 'redux-saga/effects';
    import repos from './repos';

    export default function *sagas () {
      yield [
        fork(repos)
      ];
    }
    ```
  - The only thing left for our redux side of the app is, first, creating a store - create `src/store/configureStore.js`:
    ```js
    import {applyMiddleware, createStore, compose} from 'redux';
    import createSagaMiddleware from 'redux-saga';
    import rootReducer from '../reducers';
    import rootSaga from '../sagas';

    export default function configureStore (preloadedState) {
      const sagaMiddleware = createSagaMiddleware();
      const store = createStore(
        rootReducer,
        preloadedState,
        compose(
          applyMiddleware(sagaMiddleware),
          window && window.devToolsExtension ?
            window.devToolsExtension() :
            (passThrough) => passThrough
        )
      );

      sagaMiddleware.run(rootSaga);

      return store;
    }
    ```
  - And, finally, wiring it into our app via the `react-redux` `Provider` HOC - modify `src/index.js`:
    ```js
    // eslint-disable-next-line import/no-unassigned-import
    import 'whatwg-fetch';
    import React from 'react';
    import {render} from 'react-dom';
    import {Provider} from 'react-redux';
    import configureStore from './store/configureStore';
    import styles from './styles.scss';

    const store = configureStore();

    render(
      <Provider store={store}>
        <div className={styles.container}>Hello world!</div>
      </Provider>,
      document.querySelector('[data-react-workshop]')
    );
    ```

We now have a perfectly workable Redux state tree, with sagas running... except we have no UI components to:
  1) Dispatch the action that will trigger the saga that fetches the repos, and
  2) Display the information conveyed by the state tree to the user

So let's create some components to do just that.

  - Create `src/components/GetReposButton/index.js`:
    ```js
    import React from 'react';
    import PropTypes from 'prop-types';
    import {connect} from 'react-redux';
    import {requestRepos} from '../../actions/repos';
    import styles from './styles.scss';

    const HARDCODED_ORG_NAME = 'github';

    const GetReposButton = ({dispatch, fetching}) => {
      const handleOnClick = () => dispatch(requestRepos(HARDCODED_ORG_NAME));

      return (
        <button
          className={styles.button}
          disabled={fetching}
          onClick={!fetching && handleOnClick}
        >
          Get Repos
        </button>
      );
    };

    GetReposButton.propTypes = {
      dispatch: PropTypes.func.isRequired,
      fetching: PropTypes.bool.isRequired
    };

    const mapStateToProps = (state) => ({
      fetching: state.repos.fetching
    });

    export {GetReposButton as GetReposButtonPureComponent};
    export default connect(mapStateToProps)(GetReposButton);
    ```
  - And its corresponding `src/components/GetReposButton/styles.scss`:
    ```css
    .button {
      background: #4cf;
      font-weight: bold;
      border: 0;
      appearance: none;
      padding: 16px;

      &[disabled] {
        background: #999;
        color: white;
      }
    }
    ```
  - Now to display some results - create `src/components/RepoList/index.js`:
    ```js
    import React from 'react';
    import PropTypes from 'prop-types';
    import {connect} from 'react-redux';

    const RepoList = ({fetching, repos}) => {
      if (fetching) {
        return <p>Loading...</p>;
      }

      if (!repos) {
        return <p>No results</p>;
      }

      return (
        <ul>
          {
            repos.map(
              ({name, url}) =>
                <li key={name}>
                  <a href={url}>{name}</a>
                </li>
            )
          }
        </ul>
      );
    };

    RepoList.propTypes = {
      fetching: PropTypes.bool.isRequired,
      repos: PropTypes.array
    };

    RepoList.defaultProps = {
      repos: null
    };

    const mapStateToProps = (state) => ({
      fetching: state.repos.fetching,
      repos: state.repos.repos
    });

    export {RepoList as RepoListPureComponent};
    export default connect(mapStateToProps)(RepoList);
    ```
  - And now we just wire them together into the root app component - modify `src/index.js`:
    ```js
    // eslint-disable-next-line import/no-unassigned-import
    import 'whatwg-fetch';
    import React from 'react';
    import {render} from 'react-dom';
    import {Provider} from 'react-redux';
    import GetReposButton from './components/GetReposButton';
    import RepoList from './components/RepoList';
    import configureStore from './store/configureStore';
    import styles from './styles.scss';

    const store = configureStore();

    render(
      <Provider store={store}>
        <div className={styles.container}>
          <GetReposButton />
          <RepoList />
        </div>
      </Provider>,
      document.querySelector('[data-react-workshop]')
    );
    ```
  - Run `npm run start` and open `localhost:8080` (or whichever port) - click on the button
  - Congratulations! You should have a fully running react/redux/redux-saga application there, unless something went horribly wrong.

Keep in mind that there's millions of equally valid ways to create a react/redux application - the flexibility offered by these libraries is immense. You'll have to experiment and pick and choose to find what works for you.

Now, no application is complete without tests - so let's see to that in [Step 4](../step4)
