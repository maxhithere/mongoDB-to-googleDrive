const { google } = require('googleapis');

let vars = {
  db: '',
  driveClientId: '',
  driveClientSecret: '',
  driveRedirectUris: [],
  driveAccessToken: '',
  driveRefreshToken: '', //G_DRIVE_REFRESH_TOKEN
  driveTokenExpirationDate: '', // G_DRIVE_TOKEN_EXPIRY_DATE
  driveBackupId: '',
};

Object.keys(vars).forEach((key) => {
  if (process.env[key] === undefined)
    throw new Error(`${key} not found in ENV`);

  if (Array.isArray(vars[key])) vars[key] = JSON.parse(process.env[key]);
  else vars[key] = process.env[key];
});

const oAuth2Client = new google.auth.OAuth2(
  vars.driveClientId,
  vars.driveClientSecret,
  vars.driveRedirectUris[0]
);
oAuth2Client.setCredentials({
  driveAccessToken: vars.driveAccessToken,
  driveRefreshToken: vars.driveRefreshToken,
  driveTokenExpirationDate: Number(vars.driveTokenExpirationDate),
  token_type: 'Bearer',
});

module.exports = { vars, oAuth2Client };
