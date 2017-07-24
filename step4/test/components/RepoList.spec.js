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
