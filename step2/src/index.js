import React from 'react';
import {render} from 'react-dom';
import styles from './styles.scss';

render(
  <div className={styles.container}>Hello world!</div>,
  document.querySelector('[data-react-workshop]')
);
