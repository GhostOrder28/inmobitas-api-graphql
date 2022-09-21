const passport = require('passport');
const { apiBaseUrl } = require('../constants/urls');

const AUTH_OPTIONS = {
  callbackURL: `${apiBaseUrl}/auth/google/callback`,
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}

function verifyCallback (accessToken, refreshToken, profile, done) {
  const user = {
    oAuthId: profile.id,
    names: profile._json.name,
    email: profile._json.email
  }
  console.log('google profile: ', profile);
  done(null, user);
}

module.exports = {
  AUTH_OPTIONS,
  verifyCallback
}
