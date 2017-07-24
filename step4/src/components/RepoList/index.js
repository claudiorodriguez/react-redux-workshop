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
