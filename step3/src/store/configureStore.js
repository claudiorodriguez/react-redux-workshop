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
