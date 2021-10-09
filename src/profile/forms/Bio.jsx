import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { ValidationFormGroup } from '@edx/paragon';

import messages from './Bio.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeaderSingle from './elements/EditableItemHeaderSingle';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';
import EditButton from "./elements/EditButton";

class Bio extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.props.changeHandler(name, value);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitHandler(this.props.formId);
  }

  handleClose() {
    this.props.closeHandler(this.props.formId);
  }

  handleOpen() {
    this.props.openHandler(this.props.formId);
  }

  render() {
    const {
      formId, bio, visibilityBio, editMode, saveState, error, intl,
    } = this.props;

    const headerBody = React.createElement(
        'h5',
        {},
        `${intl.formatMessage(messages['profile.bio.about.me'])}`
    )

    return (
      <SwitchContent
        className="mb-3"
        expression={editMode}
        cases={{
          editing: (
              <>
                  <EditableItemHeaderSingle
                      content={headerBody}
                      onClickEdit={this.handleOpen}
                      showVisibility={visibilityBio !== null}
                      visibility={visibilityBio}
                  />
                  <div role="dialog" aria-labelledby={`${formId}-label`}>
                      <form onSubmit={this.handleSubmit}>
                          <ValidationFormGroup
                              for={formId}
                              invalid={error !== null}
                              invalidMessage={error}
                          >
                              {/*<label className="edit-section-header" htmlFor={formId}>*/}
                              {/*  {intl.formatMessage(messages['profile.bio.about.me'])}*/}
                              {/*</label>*/}
                              <textarea
                                  className="form-control"
                                  id={formId}
                                  name={formId}
                                  value={bio}
                                  onChange={this.handleChange}
                              />
                          </ValidationFormGroup>
                          <FormControls
                              visibilityId="visibilityBio"
                              saveState={saveState}
                              visibility={visibilityBio}
                              cancelHandler={this.handleClose}
                              changeHandler={this.handleChange}
                          />
                      </form>
                  </div>
              </>

          ),
          editable: (
            <>
                <EditableItemHeaderSingle
                    content={headerBody}
                    showEditButton
                    onClickEdit={this.handleOpen}
                    showVisibility={visibilityBio !== null}
                    visibility={visibilityBio}
                />
                <p data-hj-suppress className="lead text-wrap text-break">{bio}</p>
                <button
                    className="btn btn-md btn-outline-primary"
                    style={{ marginTop: '-.35rem' }}
                    onClick={this.handleOpen}
                >
                    <span><i className="fa fa-pencil pe-2"></i></span>
                    {intl.formatMessage(messages['profile.bio.edit'])}
                </button>
            </>
          ),
          empty: (
            <>
                <EditableItemHeaderSingle content={headerBody} />
                <EmptyContent onClick={this.handleOpen}>
                    <FormattedMessage
                      id="profile.bio.empty"
                      defaultMessage="Add a short bio"
                      description="instructions when the user hasn't written an About Me"
                    />
                </EmptyContent>
            </>
          ),
          static: (
            <>
              <EditableItemHeaderSingle content={intl.formatMessage(messages['profile.bio.about.me'])} />
              <p data-hj-suppress className="lead">{bio}</p>
            </>
          ),
        }}
      />
    );
  }
}

Bio.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  bio: PropTypes.string,
  visibilityBio: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,

  // Actions
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

Bio.defaultProps = {
  editMode: 'static',
  saveState: null,
  bio: null,
  visibilityBio: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Bio));
