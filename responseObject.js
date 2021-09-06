'use strict';

exports.regInlineHookCommandsMapping = async response => {
  const userProfile = await userProfileMapping(response);
  return { 
    commands: [{
      type: 'com.okta.user.profile.update',
      value: userProfile
    }]
  }
};

async function userProfileMapping(response) {
  return {
    firstName: response.firstName.S,
    lastName: response.lastName.S,
    email: response.email.S,
    mobilePhone: response.mobile.S,
    position: response.position.S,
    specialization: response.specialization.S,
    experience: response.experience.S,
    latestDegree: response.latestDergee.S,
  } 
}

exports.regInlineHookErrorMapping = response => ({
  error: {
    errorSummary: response.message,
    errorCauses: [
      {
        errorSummary: response.message,
        reason: response.statusCode,
        locationType: 'body',
        location: 'data.userProfile.email',
        domain: 'end-user',
      },
    ],
  },
});