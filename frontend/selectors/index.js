import { createSelector } from 'reselect';
import { getCustomer } from '@shopgate/engage/account/selectors/customer';

export const getEditedCustomer = createSelector(
  getCustomer,
  (customer) => {
    if (!customer) {
      return null;
    }

    const billingAddress = customer?.contacts.find(contact => contact.isDefaultBilling === true);
    const shippingAddress = customer?.contacts.find(contact => contact.isDefaultShipping === true);

    const restructuredAttributes = customer.attributes.reduce((acc, attribute) => {
      if (attribute.value.name) {
        acc[attribute.code] = attribute.value.name;
      } else if (Array.isArray(attribute.value)) {
        acc[attribute.code] = attribute.value.map(value => value.name);
      } else {
        acc[attribute.code] = attribute.value;
      }
      return acc;
    }, {});

    return {
      ...customer,
      attributes: restructuredAttributes,
      defaultBillingAddress: billingAddress,
      defaultShippingAddress: shippingAddress,
    };
  }
);

