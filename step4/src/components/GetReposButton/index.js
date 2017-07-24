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
