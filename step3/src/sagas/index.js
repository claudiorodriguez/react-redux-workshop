import {fork} from 'redux-saga/effects';
import repos from './repos';

export default function *sagas () {
  yield [
    fork(repos)
  ];
}
