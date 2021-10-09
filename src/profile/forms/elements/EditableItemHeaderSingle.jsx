import React from 'react';
import PropTypes from 'prop-types';

import { Visibility } from './Visibility';

function EditableItemHeaderSingle({
  content,
  showVisibility,
  visibility,
  headingId,
}) {
  return (
    <>
      <div className="editable-item-header">
        <ul className="list-inline mb-0 edit-section-header" id={headingId}>
          <li className="list-inline-item h5">{headingId === "certificates" ? "⭐": "📝"}</li>
          <li className="list-inline-item h5">{content}</li>
          <li className="list-inline-item h5">{showVisibility ? <p className="mb-0"><Visibility to={visibility} /></p> : null}</li>
        </ul>
      </div>
    </>
  );
}

export default EditableItemHeaderSingle;

EditableItemHeaderSingle.propTypes = {
  onClickEdit: PropTypes.func,
  showVisibility: PropTypes.bool,
  showEditButton: PropTypes.bool,
  content: PropTypes.node,
  visibility: PropTypes.oneOf(['private', 'all_users']),
  headingId: PropTypes.string,
};

EditableItemHeaderSingle.defaultProps = {
  onClickEdit: () => {},
  showVisibility: false,
  showEditButton: false,
  content: '',
  visibility: 'private',
  headingId: null,
};
