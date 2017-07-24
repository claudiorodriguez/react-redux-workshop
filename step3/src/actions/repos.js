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
