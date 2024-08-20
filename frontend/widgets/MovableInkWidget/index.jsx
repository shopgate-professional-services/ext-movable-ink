import React from 'react';
import PropTypes from 'prop-types';
import Handlebars from "handlebars/dist/handlebars";

/**
 * @returns {JSX.Element}
 */
const MovableInkWidget = ({ settings }) => {
  const {imageUrl, linkUrl} = settings;

  if (!imageUrl || !linkUrl) {
    return null;
  }

  const customerDataMock = {
    firstName: 'Anna',
    lastName: 'Minnie',
    externalCustomerNumber: 123,
  };

  const template = Handlebars.compile( imageUrl );
  const parsedUrl = template({customer: customerDataMock});

  return (
    <div>
    <h2>Movable ink widget!!!!!</h2>
    <img src={parsedUrl} />
    </div>
  )
};

MovableInkWidget.propTypes = {
  settings: PropTypes.shape({
    imageUrl: PropTypes.string,
    linkUrl: PropTypes.string,
  }),
};

MovableInkWidget.defaultProps = {
  settings: null,
};

export default MovableInkWidget;
