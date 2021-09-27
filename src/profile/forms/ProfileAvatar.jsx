import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { DropdownButton } from "react-bootstrap";
import DefaultAvatar from '../../assets/icon-user.svg';

import messages from './ProfileAvatar.messages';

import uplodIcon from '../../assets/icon-upload.svg'

class ProfileAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.fileInput = React.createRef();
    this.form = React.createRef();

    this.onClickUpload = this.onClickUpload.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onClickUpload() {
    this.fileInput.current.click();
  }

  onClickDelete() {
    this.props.onDelete();
  }

  onChangeInput() {
    this.onSubmit();
  }

  onSubmit(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.onSave(new FormData(this.form.current));
    this.form.current.reset();
  }

  renderPending() {
    return (
      <div
        id="panding"
        className="d-flex justify-content-center align-items-center rounded-circle"
        style={{ width: this.props.size, height: this.props.size }}
      >
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  renderMenuContent() {
    const { intl } = this.props;

    const RoundAvatarDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
        <button
            id="upload-button"
            ref={ref}
            aria-labelledby="image"
            aria-describedby="image"
            className="btn btn-light btn-circle btn-lg d-flex justify-content-center"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClick(e);
            }}
        >
          <img src={uplodIcon} alt={null} />
        </button>
    ));

    if (this.props.isDefault) {
      return (
          <button
              id="upload-button"
              aria-labelledby="image"
              aria-describedby="image"
              className="btn btn-light btn-lg btn-circle d-flex justify-content-center"
              type="button"
              onClick={this.onClickUpload}
          >
            <img src={uplodIcon} alt={null} />
          </button>
      );
    }

    return (
        <>
          <Dropdown>
            <Dropdown.Toggle as={RoundAvatarDropdownToggle}>
              <img src={uplodIcon} alt={null} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item type="button" onClick={this.onClickUpload}>
                <FormattedMessage
                    id="profile.profileavatar.upload-button"
                    defaultMessage="Upload Photo"
                    description="Upload photo button"
                />
              </Dropdown.Item>
              <Dropdown.Item type="button" onClick={this.onClickDelete}>
                <FormattedMessage
                    id="profile.profileavatar.remove.button"
                    defaultMessage="Remove"
                    description="Remove photo button"
                />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
    );
  }

  renderMenu() {
    if (!this.props.isEditable) {
      return null;
    }

    return (
      <div className="profile-avatar-menu-container">
        {this.renderMenuContent()}
      </div>
    );
  }

  renderAvatar() {
    const { intl, isDefault, size, src } = this.props;

    return (
        <div id="avatar" className="d-flex justify-content-center align-items-center">
          <img
              src={isDefault ? DefaultAvatar : src}
              width={isDefault ? null : size - 10}
              height={isDefault ? null : size - 10}
              alt={intl.formatMessage(messages['profile.image.alt.attribute'])}
              className="rounded-circle overflow-hidden"
              style={{
                objectFit: 'cover',
                width: isDefault ? 100 - 10 : null,
                height: isDefault ? 100 - 10 : null
              }}
          />
        </div>
    );
  }

  render() {
    return (
        <>
          <div className="bg-primary">
            <div>
              <form
                  ref={this.form}
                  onSubmit={this.onSubmit}
                  encType="multipart/form-data"
              >
                {/* The name of this input must be 'file' */}
                <input
                    className="d-none form-control-file"
                    ref={this.fileInput}
                    type="file"
                    name="file"
                    id="image"
                    onChange={this.onChangeInput}
                    accept=".jpg, .jpeg, .png"
                />
              </form>
              <div id="preview">
                {this.props.savePhotoState === 'pending' ? this.renderPending() :this.renderAvatar()}
                {this.renderMenu() }
              </div>
            </div>
          </div>
        </>
    );
  }
}

export default injectIntl(ProfileAvatar);

ProfileAvatar.propTypes = {
  src: PropTypes.string,
  isDefault: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isEditable: PropTypes.bool,
  intl: intlShape.isRequired,
  size: PropTypes.number
};

ProfileAvatar.defaultProps = {
  src: null,
  isDefault: true,
  savePhotoState: null,
  isEditable: false,
  size: 150
};
