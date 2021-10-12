import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { StatusAlert, Hyperlink } from '@edx/paragon';

// Actions
import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
} from './data/actions';

// Components
import ProfileAvatar from './forms/ProfileAvatar';
import Name from './forms/Name';
import Country from './forms/Country';
import PreferredLanguage from './forms/PreferredLanguage';
import Education from './forms/Education';
import SocialLinks from './forms/SocialLinks2';
import Bio from './forms/Bio';
import Certificates from './forms/Certificates';
import AgeMessage from './AgeMessage';
import DateJoined from './DateJoined';
import PageLoading from './PageLoading';

import Banner from './Banner';

import profileWhiteIcon from '../assets/icon-user-white.svg'
import outWhiteIcon from '../assets/icon-out-white.svg'
import patternVertical from '../assets/pattern-vertical.svg'

// Selectors
import { profilePageSelector } from './data/selectors';

// i18n
import messages from './ProfilePage.messages';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL'], 'ProfilePage');

class DesktopProfilePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    const recordsUrl = this.getRecordsUrl(context);

    this.state = {
      viewMyRecordsUrl: recordsUrl,
      accountSettingsUrl: `${context.config.LMS_BASE_URL}/account/settings`,
    };

    this.handleSaveProfilePhoto = this.handleSaveProfilePhoto.bind(this);
    this.handleDeleteProfilePhoto = this.handleDeleteProfilePhoto.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchProfile(this.props.match.params.username);
    sendTrackingLogEvent('edx.profile.viewed', {
      username: this.props.match.params.username,
    });
  }

  getRecordsUrl(context) {
    let recordsUrl = null;

    if (getConfig().ENABLE_LEARNER_RECORD_MFE) {
      recordsUrl = getConfig().LEARNER_RECORD_MFE_BASE_URL;
    } else {
      const credentialsBaseUrl = context.config.CREDENTIALS_BASE_URL;
      recordsUrl = credentialsBaseUrl ? `${credentialsBaseUrl}/records` : null;
    }

    return recordsUrl;
  }

  isAuthenticatedUserProfile() {
    return this.props.match.params.username === this.context.authenticatedUser.username;
  }

  handleSaveProfilePhoto(formData) {
    this.props.saveProfilePhoto(this.context.authenticatedUser.username, formData);
  }

  handleDeleteProfilePhoto() {
    this.props.deleteProfilePhoto(this.context.authenticatedUser.username);
  }

  handleClose(formId) {
    this.props.closeForm(formId);
  }

  handleOpen(formId) {
    this.props.openForm(formId);
  }

  handleSubmit(formId) {
    this.props.saveProfile(formId, this.context.authenticatedUser.username);
  }

  handleChange(name, value) {
    this.props.updateDraft(name, value);
  }

  // Inserted into the DOM in two places (for responsive layout)
  renderViewMyRecordsButton() {
    if (!(this.state.viewMyRecordsUrl && this.isAuthenticatedUserProfile())) {
      return null;
    }

    return (
        <a href={this.state.viewMyRecordsUrl} target="_blank" className="btn btn-link">
          <ul className="list-inline">
            <li className="list-inline-item">
              <img src={outWhiteIcon} alt={null} />
            </li>
            <li className="list-inline-item">
              <u className="text-white">{this.props.intl.formatMessage(messages['profile.viewMyRecords'])}</u>
            </li>
          </ul>

        </a>
    );
  }

  // Inserted into the DOM in two places (for responsive layout)
  renderHeadingLockup() {
    const { dateJoined } = this.props;

    return (
      <>
        <ul className="px-2 mb-3 badge badge-pill badge-primary-dark list-inline">
          <li className="list-inline-item">
            <img src={profileWhiteIcon} alt={null} />
          </li>
          <li className="list-inline-item">
            <small className="ms-2">{this.props.match.params.username}</small>
          </li>
        </ul>
        <DateJoined date={dateJoined} />
      </>
    );
  }

  renderPhotoUploadErrorMessage() {
    const { photoUploadError } = this.props;

    if (photoUploadError === null) {
      return null;
    } else {
      notify(photoUploadError);
    }

    return (
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <StatusAlert alertType="danger" dialog={photoUploadError.userMessage} dismissible={false} open />
        </div>
      </div>
    );
  }

  renderAgeMessage() {
    const { requiresParentalConsent } = this.props;
    const shouldShowAgeMessage = requiresParentalConsent && this.isAuthenticatedUserProfile();

    if (!shouldShowAgeMessage) {
      return null;
    }
    return <AgeMessage accountSettingsUrl={this.state.accountSettingsUrl} />;
  }

  renderContent() {
    const {
      profileImage,
      name,
      visibilityName,
      country,
      visibilityCountry,
      levelOfEducation,
      visibilityLevelOfEducation,
      socialLinks,
      draftSocialLinksByPlatform,
      visibilitySocialLinks,
      languageProficiencies,
      visibilityLanguageProficiencies,
      visibilityCourseCertificates,
      bio,
      visibilityBio,
      requiresParentalConsent,
      isLoadingProfile,
      intl
    } = this.props;

    if (isLoadingProfile) {
      return <PageLoading srMessage={intl.formatMessage(messages['profile.loading'])} />;
    }

    const commonFormProps = {
      openHandler: this.handleOpen,
      closeHandler: this.handleClose,
      submitHandler: this.handleSubmit,
      changeHandler: this.handleChange,
    };

    return (
      <div className="container-fluid px-0">
        <div className="d-flex bg-primary pb-0 flex-row justify-content-between align-items-stretch mb-4">
          <img src={patternVertical} alt={null} style={{ width: '20rem' }} />
          <div className="d-flex flex-column align-items-center justify-content-center">
            <ProfileAvatar
                src={profileImage.src}
                isDefault={profileImage.isDefault}
                onSave={this.handleSaveProfilePhoto}
                onDelete={this.handleDeleteProfilePhoto}
                savePhotoState={this.props.savePhotoState}
                isEditable={this.isAuthenticatedUserProfile() && !requiresParentalConsent}
            />
            <h6 className="lead mt-3 mb-3 text-white">{name}</h6>
            {this.renderHeadingLockup()}
            {this.renderViewMyRecordsButton()}
          </div>
          <img src={patternVertical} alt={null} style={{ width: '20rem' }} />
        </div>
        {this.renderPhotoUploadErrorMessage()}
        <div className="col-12 d-flex justify-content-around">
          <div className="col-7">
            <div className="my-4">
              <h5 className="section-heading">
                <span className="pe-1">🤖</span> Main Information
              </h5>
            </div>
            <div className="row">
              <div className="col-6">
                <Name
                    name={name}
                    visibilityName={visibilityName}
                    formId="name"
                    {...commonFormProps}
                />
              </div>
              <div className="col-6">
                <Country
                    country={country}
                    visibilityCountry={visibilityCountry}
                    formId="country"
                    {...commonFormProps}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <PreferredLanguage
                    languageProficiencies={languageProficiencies}
                    visibilityLanguageProficiencies={visibilityLanguageProficiencies}
                    formId="languageProficiencies"
                    {...commonFormProps}
                />
              </div>
              <div className="col-6">
                <Education
                    levelOfEducation={levelOfEducation}
                    visibilityLevelOfEducation={visibilityLevelOfEducation}
                    formId="levelOfEducation"
                    {...commonFormProps}
                />
              </div>
            </div>

            <div className="hstack gap-2 justify-content-between align-content-start">


            </div>
            <hr className="mt-2 mb-3"/>
            <div className="my-4">
              <h5 className="section-heading">
                <span className="pe-1">🤖</span> {intl.formatMessage(messages['profile.sociallinks.social.links'])}
              </h5>
              <p className="text-secondary">Optionally, link your personal accounts to the social media icons on your ЦОПП profile.</p>
            </div>
            <div className="row">
              {socialLinks.map(platform => (
                  <div className="col-6">
                    <SocialLinks
                        socialLinks={platform}
                        draftSocialLinksByPlatform={draftSocialLinksByPlatform}
                        visibilitySocialLinks={visibilitySocialLinks}
                        formId={`socialLinks-${platform.platform}`}
                        {...commonFormProps}
                    />
                  </div>
              ))}
            </div>
            {/*<div className="hstack gap-2 justify-content-between">*/}
            {/*  */}
            {/*  <SocialLinks*/}
            {/*      socialLinks={socialLinks}*/}
            {/*      draftSocialLinksByPlatform={draftSocialLinksByPlatform}*/}
            {/*      visibilitySocialLinks={visibilitySocialLinks}*/}
            {/*      formId="socialLinks"*/}
            {/*      {...commonFormProps}*/}
            {/*  />*/}
            {/*</div>*/}
            <hr className="mt-2 mb-3"/>
            <Bio
                bio={bio}
                visibilityBio={visibilityBio}
                formId="bio"
                {...commonFormProps}
            />
            <div className="mb-4">

              {/*TODO: Нужно забирать название организации из конфига*/}
              {/*<p className="text-secondary">Optionally, link your personal accounts to the social media icons on your ЦОПП profile.</p>*/}
            </div>
            <hr className="mt-2 mb-3"/>
            <div className="mb-4 pb-4">
              <Certificates
                  visibilityCourseCertificates={visibilityCourseCertificates}
                  formId="certificates"
                  {...commonFormProps}
              />
              {/*TODO: Нужно забирать название организации из конфига*/}
              {/*<p className="text-secondary">Optionally, link your personal accounts to the social media icons on your ЦОПП profile.</p>*/}
            </div>
            {this.renderAgeMessage()}
          </div>
        </div>

      </div>
    );
  }

  render() {
    return (
      <div className="profile-page">
        {/*<Banner />*/}
        {this.renderContent()}
      </div>
    );
  }
}

DesktopProfilePage.contextType = AppContext;

DesktopProfilePage.propTypes = {
  // Account data
  requiresParentalConsent: PropTypes.bool,
  dateJoined: PropTypes.string,

  // Bio form data
  bio: PropTypes.string,
  visibilityBio: PropTypes.string.isRequired,

  // Certificates form data
  courseCertificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  visibilityCourseCertificates: PropTypes.string.isRequired,

  // Country form data
  country: PropTypes.string,
  visibilityCountry: PropTypes.string.isRequired,

  // Education form data
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.string.isRequired,

  // Language proficiency form data
  languageProficiencies: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
  })),
  visibilityLanguageProficiencies: PropTypes.string.isRequired,

  // Name form data
  name: PropTypes.string,
  visibilityName: PropTypes.string.isRequired,

  // Social links form data
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibilitySocialLinks: PropTypes.string.isRequired,

  // Other data we need
  profileImage: PropTypes.shape({
    src: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isLoadingProfile: PropTypes.bool.isRequired,

  // Page state helpers
  photoUploadError: PropTypes.objectOf(PropTypes.string),

  // Actions
  fetchProfile: PropTypes.func.isRequired,
  saveProfile: PropTypes.func.isRequired,
  saveProfilePhoto: PropTypes.func.isRequired,
  deleteProfilePhoto: PropTypes.func.isRequired,
  openForm: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,

  // Router
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,

  // i18n
  intl: intlShape.isRequired,
};

DesktopProfilePage.defaultProps = {
  saveState: null,
  savePhotoState: null,
  photoUploadError: {},
  profileImage: {},
  name: null,
  levelOfEducation: null,
  country: null,
  socialLinks: [],
  draftSocialLinksByPlatform: {},
  bio: null,
  languageProficiencies: [],
  courseCertificates: null,
  requiresParentalConsent: null,
  dateJoined: null,
};

export default connect(
  profilePageSelector,
  {
    fetchProfile,
    saveProfilePhoto,
    deleteProfilePhoto,
    saveProfile,
    openForm,
    closeForm,
    updateDraft,
  },
)(injectIntl(DesktopProfilePage));
