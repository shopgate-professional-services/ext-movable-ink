import { fetchCustomerData } from '@shopgate/engage/account/actions/fetchCustomer';
import { appDidStart$ } from '@shopgate/engage/core';
import { userDidLogin$, isUserLoggedIn } from '@shopgate/engage/user';

export default (subscribe) => {
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    if (isUserLoggedIn(getState())) {
      dispatch(fetchCustomerData());
    }
  });

  subscribe(userDidLogin$, ({ dispatch, getState }) => {
    if (isUserLoggedIn(getState())) {
      dispatch(fetchCustomerData());
    }
  });
};
