import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Handlebars from 'handlebars/dist/handlebars';
import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product/helpers';
import { getCategoryRoute } from '@shopgate/pwa-common-commerce/category';
import { getEditedCustomer } from '../../selectors';
import { getRedirectUrl } from '../../helpers';

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
const mapDispatchToProps = dispatch => ({
  navigate: pathname => dispatch(historyPush({ pathname })),
});

/**
 * @param {Object} settings the settings for the widget
 * @param {Object} customer the customer data
 * @param {Function} navigate navigate to the link of the image widget
 * @returns {JSX.Element}
 */
const ImageWidget = ({
  settings, customer, navigate,
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

  const handleClick = useCallback(async () => {
    if (parsedLinkUrl) {
      // redirect to deep link url
      const redirectUrl = await getRedirectUrl(parsedLinkUrl);

      if (!redirectUrl) {
        return;
      }

      if (redirectUrl.includes('/product/')) {
        const productCode = redirectUrl.split('/product/')[1];
        navigate(getProductRoute(productCode));
      } else if (redirectUrl.includes('/cat/')) {
        const catCode = redirectUrl.split('/cat/')[1];
        navigate(getCategoryRoute(catCode));
      } else if (redirectUrl.includes('/page/')) {
        const cmsPage = redirectUrl.split('/page/')[1];
        navigate(`/page/${cmsPage}`);
      }
    }
  }, [navigate, parsedLinkUrl]);

  if (!parsedImageUrl) {
    return null;
  }

  return (
    <button
      aria-hidden
      onClick={handleClick}
      type="button"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: parsedLinkUrl ? 'pointer' : 'default',
        display: 'flex',
      }}
    >
      <img src={parsedImageUrl} alt="" />
    </button>
  );
};

ImageWidget.propTypes = {
  customer: PropTypes.shape(),
  navigate: PropTypes.func,
  settings: PropTypes.shape({
    imageUrl: PropTypes.string,
    linkUrl: PropTypes.string,
  }),
};

ImageWidget.defaultProps = {
  settings: null,
  customer: null,
  navigate: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageWidget);
