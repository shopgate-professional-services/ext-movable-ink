import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars/dist/handlebars';
import { connect } from 'react-redux';
import { getEditedCustomer } from '../../selectors´';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  customer: getEditedCustomer(state),
});

/**
 * @param {Function} dispatch Dispatch.
 * @returns {Object}
 */
const mapDispatchToProps = () => ({
  // historyPush
});

/**
 * @param {Object} settings the settings for the widget
 * @param {Object} customer the customer data
 * @returns {JSX.Element}
 */
const ImageWidget = ({
  settings, customer,
}) => {
  const { imageUrl, linkUrl } = settings || {};

  const parsedImageUrl = useMemo(() => {
    if (!imageUrl) {
      return '';
    }
    try {
      const template = Handlebars.compile(imageUrl, { strict: true });
      return template({ customer });
    } catch (error) {
      return '';
    }
  }, [customer, imageUrl]);

  const parsedLinkUrl = useMemo(() => {
    if (!linkUrl) {
      return '';
    }
    try {
      const template = Handlebars.compile(linkUrl, { strict: true });
      return template({ customer });
    } catch (error) {
      return '';
    }
  }, [customer, linkUrl]);

  const handleClick = useCallback(() => {
    if (parsedLinkUrl) {
      // redirect to deep link url
    }
  }, [parsedLinkUrl]);

  if (!parsedImageUrl) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: parsedImageUrl ? 'pointer' : 'default',
      }}
    >
      <img src={parsedImageUrl} alt="" />
    </button>
  );
};

ImageWidget.propTypes = {
  customer: PropTypes.shape(),
  settings: PropTypes.shape({
    imageUrl: PropTypes.string,
    linkUrl: PropTypes.string,
  }),
};

ImageWidget.defaultProps = {
  settings: null,
  customer: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageWidget);
