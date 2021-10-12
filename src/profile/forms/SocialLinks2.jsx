import React from 'react';
import PropTypes from 'prop-types';
import { StatusAlert } from '@edx/paragon';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';

import messages from './SocialLinks.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

import facebook from '../assets/social/facebook.svg'
import linkedin from '../assets/social/linkedin.svg'
import twitter from '../assets/social/twitter.svg'

// Selectors
import { editableFormSelector } from '../data/selectors';
import EditButton from "./elements/EditButton";

const platformDisplayInfo = {
    facebook: {
        icon: facebook,
        name: 'Facebook',
    },
    twitter: {
        icon: twitter,
        name: 'Twitter',
    },
    linkedin: {
        icon: linkedin,
        name: 'LinkedIn',
    },
};

let icons = {
    'Facebook': facebook,
    'Twitter': twitter,
    'LinkedIn': linkedin,
}


class SocialLinks extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;

        // The social links are a bit special. If we're updating them, we need to merge them
        // with any existing social link drafts, essentially sending a fresh copy of the whole
        // data structure back to the reducer. This helps the reducer stay simple and keeps
        // special cases out of it, concentrating them here, where they began.
        if (!name.includes('visibilitySocialLinks')) {
            this.props.changeHandler(
                'socialLinks',
                this.mergeWithDrafts({
                    platform: name,
                    // If it's an empty string, send it as null.
                    // The empty string is just for the input.  We want nulls.
                    socialLink: value,
                }),
            );
        } else {
            console.log(name)
            console.log(value)
            this.props.changeHandler(name, value);
        }
    }

    mergeWithDrafts(newSocialLink) {
        const knownPlatforms = ['twitter', 'facebook', 'linkedin'];
        const updated = [];
        knownPlatforms.forEach((platform) => {
            if (newSocialLink.platform === platform) {
                updated.push(newSocialLink);
            } else if (this.props.draftSocialLinksByPlatform[platform] !== undefined) {
                updated.push(this.props.draftSocialLinksByPlatform[platform]);
            }
        });
        return updated;
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
            socialLinks, visibilitySocialLinks, editMode, saveState, error, intl,
        } = this.props;
        console.log(visibilitySocialLinks)
        return (
            <SwitchContent
                className="mb-3"
                expression={editMode}
                cases={{
                    empty: (
                        <>
                            <EmptyListItem
                                key={socialLinks.platform}
                                onClick={this.handleOpen}
                                name={platformDisplayInfo[socialLinks.platform].name}
                            />
                        </>

                    ),
                    static: (
                        <StaticListItem
                            key={socialLinks.platform}
                            name={platformDisplayInfo[socialLinks.platform].name}
                            url={socialLinks.socialLink}
                            platform={socialLinks.platform}
                        />
                    ),
                    editable: (
                        <div>
                            <EditableItemHeader
                                content={platformDisplayInfo[socialLinks.platform].name}
                                showEditButton
                                onClickEdit={this.handleOpen}
                                showVisibility={visibilitySocialLinks !== null}
                                visibility={visibilitySocialLinks}
                            />
                            <div className="d-flex flex-column justify-content-start">
                                <EditButton
                                    style={{ marginTop: '-.35rem' }}
                                    content={<EditButtonContent socialLink={socialLinks.socialLink} icon={icons[platformDisplayInfo[socialLinks.platform].name]}/>}
                                    onClick={this.handleOpen}
                                    className="float-left px-0 text-start btn-link"
                                >
                                </EditButton>
                            </div>
                        </div>

                        // <EditableListItem
                        //     key={socialLinks.platform}
                        //     platform={socialLinks.platform}
                        //     name={platformDisplayInfo[socialLinks.platform].name}
                        //     url={socialLinks.socialLink}
                        //     onClickEmptyContent={this.handleOpen}
                        // />
                    ),
                    editing: (
                        <>
                            <div role="dialog" aria-labelledby="social-links-label">
                                <form onSubmit={this.handleSubmit}>
                                    {/* TODO: Replace this alert with per-field errors. Needs API update. */}
                                    <div id="social-error-feedback">
                                        {error !== null ? <StatusAlert alertType="danger" dialog={error} dismissible={false} open /> : null}
                                    </div>
                                    <EditingListItem
                                        key={socialLinks.platform}
                                        name={platformDisplayInfo[socialLinks.platform].name}
                                        platform={socialLinks.platform}
                                        value={socialLinks.socialLink}
                                        /* TODO: Per-field errors: error={error !== null ? error[platform] : null} */
                                        onChange={this.handleChange}
                                    />
                                    <FormControls
                                        visibilityId={`visibilitySocialLinks`}
                                        saveState={saveState}
                                        visibility={visibilitySocialLinks}
                                        cancelHandler={this.handleClose}
                                        changeHandler={this.handleChange}
                                    />
                                </form>
                            </div>
                        </>

                    ),
                }}
            />
        );
    }
}

SocialLinks.propTypes = {
    // It'd be nice to just set this as a defaultProps...
    // except the class that comes out on the other side of react-redux's
    // connect() method won't have it anymore. Static properties won't survive
    // through the higher order function.
    formId: PropTypes.string.isRequired,

    // From Selector
    socialLinks: PropTypes.arrayOf(PropTypes.shape({
        platform: PropTypes.string,
        socialLink: PropTypes.string,
    })).isRequired,
    draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
        platform: PropTypes.string,
        socialLink: PropTypes.string,
    })),
    visibilitySocialLinks: PropTypes.oneOf(['private', 'all_users']),
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

SocialLinks.defaultProps = {
    editMode: 'static',
    saveState: null,
    draftSocialLinksByPlatform: {},
    visibilitySocialLinks: 'private',
    error: null,
};

export default connect(
    editableFormSelector,
    {},
)(injectIntl(SocialLinks));

function EditButtonContent({ socialLink, icon }) {
    return (
        <ul className="d-flex align-items-center list-inline">
            <li className="list-inline-item"><img src={icon} alt={null} /></li>
            <li className="list-inline-item">{ socialLink.split("/").pop() }</li>
        </ul>
    );
}

EditButtonContent.propTypes = {
    socialLink: PropTypes.string.isRequired,
    icon: PropTypes.any
};

function SocialLink({ url, name, platform }) {
    return (
        <a href={url} className="font-weight-bold">
            <FontAwesomeIcon className="mr-2" icon={platformDisplayInfo[platform].icon} />
            {name}
        </a>
    );
}

SocialLink.propTypes = {
    url: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

function EditableListItem({
                              url, platform, onClickEmptyContent, name,
                          }) {
    const linkDisplay = url ? (
        <SocialLink name={name} url={url} platform={platform} />
    ) : (
        <EmptyContent onClick={onClickEmptyContent}>Add {name}</EmptyContent>
    );

    return <div className="form-group">{linkDisplay}</div>;
}

EditableListItem.propTypes = {
    url: PropTypes.string,
    platform: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClickEmptyContent: PropTypes.func,
};
EditableListItem.defaultProps = {
    url: null,
    onClickEmptyContent: null,
};

function EditingListItem({
                             platform, name, value, onChange, error,
                         }) {
    return (
        <div className="form-group">
            <label htmlFor={`social-${platform}`}>{name}</label>
            <input
                className={classNames('form-control', { 'is-invalid': Boolean(error) })}
                type="text"
                id={`social-${platform}`}
                name={platform}
                value={value || ''}
                onChange={onChange}
                aria-describedby="social-error-feedback"
            />
        </div>
    );
}

EditingListItem.propTypes = {
    platform: PropTypes.string.isRequired,
    value: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};

EditingListItem.defaultProps = {
    value: null,
    error: null,
};

function EmptyListItem({ onClick, name }) {

    return (
        <div className="mb-4">
            <ul className="list-inline">
                <li className="list-inline-item"><img src={icons[name]} alt={null}/> </li>
                <li className="list-inline-item">
                    <EmptyContent onClick={onClick}>
                        <FormattedMessage
                            id="profile.sociallinks.add"
                            defaultMessage="Add {network}"
                            values={{
                                network: name,
                            }}
                            description="{network} is the name of a social network such as Facebook or Twitter"
                        />
                    </EmptyContent>
                </li>
            </ul>

        </div>
    );
}

EmptyListItem.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

function StaticListItem({ name, url, platform }) {
    return (
        <li className="mb-2">
            <SocialLink name={name} url={url} platform={platform} />
        </li>
    );
}

StaticListItem.propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    platform: PropTypes.string.isRequired,
};

StaticListItem.defaultProps = {
    url: null,
};
