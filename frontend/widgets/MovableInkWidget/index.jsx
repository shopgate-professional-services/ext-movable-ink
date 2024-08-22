import React, { useCallback, useEffect } from 'react';
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
    if (isLoggedIn && !customer) {
      fetchCustomer();
    }
  }, [fetchCustomer, isLoggedIn, customer]);

  const checkHandlebarsVariables = useCallback((url, customerData) => {
    // Use match to find all handlebars variables that start with {{customer.
    const matches = url.match(/{{customer\.(\w+)}}/g);

    if (!matches) return true;

    // Check if every extracted key exists in the customer object
    return matches.every((match) => {
      const key = match.match(/{{customer\.(\w+)}}/)?.[1];

      return key && customerData.hasOwnProperty(key);
    });
  }, []);

  if (!imageUrl || !customer) {
    return null;
  }

  const variablesResolved = checkHandlebarsVariables(imageUrl, customer);

  if (!variablesResolved) {
    return null;
  }

  const template = Handlebars.compile(imageUrl);
  const parsedUrl = template({ customer });

  return (
    <div>
      <a href={linkUrl || ''}>
        <img src={parsedUrl} alt="" />
      </a>
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
