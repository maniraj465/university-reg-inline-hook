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
    uid: response.TID.S,
    firstName: response.First_Name.S,
    lastName: response.Last_Name.S,
    email: response.Email.S,
    mobilePhone: response.Mobile.S,
    position: response.Position.S,
    specialization: response.Specialization.S,
    experience: response.Experience.S,
    latestDegree: response.LatestDergee.S,
    RegistrationStatus: 'Success'
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