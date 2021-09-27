import React from 'react';
import PropTypes from 'prop-types';

import EditButton from './EditButton';
import { Visibility } from './Visibility';

function EditableItemHeader({
  content,
  showVisibility,
  visibility,
  showEditButton,
  onClickEdit,
  headingId,
}) {
  return (
    <>
      <div className="editable-item-header">
        <h4 className="edit-section-header" id={headingId}>
          <ul className="list-inline mb-0">
            <li className="list-inline-item h6">{content}</li>
            <li className="list-inline-item h6">{showVisibility ? <p className="mb-0"><Visibility to={visibility} /></p> : null}</li>
          </ul>
          {/*{showEditButton ? <EditButton style={{ marginTop: '-.35rem' }} className="float-right px-0" onClick={onClickEdit} /> : null}*/}
        </h4>
        {/*{showVisibility ? <p className="mb-0"><Visibility to={visibility} /></p> : null}*/}
      </div>
    </>
  );
}

export default EditableItemHeader;

EditableItemHeader.propTypes = {
  onClickEdit: PropTypes.func,
  showVisibility: PropTypes.bool,
  showEditButton: PropTypes.bool,
  content: PropTypes.node,
  visibility: PropTypes.oneOf(['private', 'all_users']),
  headingId: PropTypes.string,
};

EditableItemHeader.defaultProps = {
  onClickEdit: () => {},
  showVisibility: false,
  showEditButton: false,
  content: '',
  visibility: 'private',
  headingId: null,
};
