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
