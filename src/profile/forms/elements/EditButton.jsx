import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';

import messages from './EditButton.messages';

function EditButton({
                      onClick, className, style, intl, content
                    }) {

  const buttonContent = React.createElement("p", {
    className: "h6",
  }, content);

  return (
      <button
          className={`btn btn-sm ${className}`}
          onClick={onClick}
          style={style}
      >
        {buttonContent}
      </button>
  );
}

export default injectIntl(EditButton);

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
  content: PropTypes.string,
  // i18n
  intl: intlShape.isRequired,
};

EditButton.defaultProps = {
  className: null,
  style: null,
  content: null
};
