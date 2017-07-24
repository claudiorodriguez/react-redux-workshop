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
