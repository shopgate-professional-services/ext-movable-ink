import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars/dist/handlebars';
import { fetchCustomerData } from '@shopgate/engage/account/actions/fetchCustomer';
import { connect } from 'react-redux';
import { isUserLoggedIn } from '@shopgate/engage/user';
import { getCustomer } from '@shopgate/engage/account/selectors/customer';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @param {Object} props Component props.
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  isLoggedIn: isUserLoggedIn(state, props),
  customer: getCustomer(state),
});

/**
 * @param {Function} dispatch Dispatch.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  fetchCustomer: () => dispatch(fetchCustomerData()),
});

/**
 * @param {Object} settings the settings for the widget
 * @param {Function} fetchCustomer fetch current customer
 * @param {boolean} isLoggedIn whether customer is logged in
 * @param {Object} customer the customer data
 * @returns {JSX.Element}
 */
const MovableInkWidget = ({
  settings, fetchCustomer, isLoggedIn, customer,
}) => {
  const { imageUrl, linkUrl } = settings;

  useEffect(() => {
    if (isLoggedIn) {
      fetchCustomer();
    }
  }, [fetchCustomer, isLoggedIn]);

  if (!imageUrl || !linkUrl || !customer) {
    return null;
  }

  const template = Handlebars.compile(imageUrl, { options: { noEscape: true } });
  const parsedUrl = template({ customer });

  return (
    <div>
      <img src={parsedUrl} alt="" />
    </div>
  );
};

MovableInkWidget.propTypes = {
  fetchCustomer: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  customer: PropTypes.shape(),
  settings: PropTypes.shape({
    imageUrl: PropTypes.string,
    linkUrl: PropTypes.string,
  }),
};

MovableInkWidget.defaultProps = {
  settings: null,
  customer: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(MovableInkWidget);
