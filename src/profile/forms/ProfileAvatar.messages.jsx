import {defineMessages, FormattedMessage} from '@edx/frontend-platform/i18n';
import React from "react";

const messages = defineMessages({
  'profile.image.alt.attribute': {
    id: 'profile.image.alt.attribute',
    defaultMessage: 'profile avatar',
    description: 'Alt attribute for a profile photo',
  },
  'profile.profileavatar.remove.button': {
    id: 'profile.profileavatar.change-button',
    defaultMessage: 'Remove',
    description: 'Remove photo button',
  },
  'profile.profileavatar.upload-button': {
    id: 'profile.profileavatar.upload-button',
    defaultMessage: 'Upload Photo',
    description: 'Upload photo button',
  }
});

export default messages;
