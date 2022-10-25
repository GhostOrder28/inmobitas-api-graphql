const passport = require('passport');
const { signupWithGoogle, findOneUser } = require('../models/auth.model');
const { knexMain } = require('../knex/knex-config');

const AUTH_OPTIONS = {
  callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`,
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}

async function verifyCallback (accessToken, refreshToken, profile, done) {
  console.log('veryfing signing in with google...');
  const userData = {
    oAuthId: profile.id,
    names: profile._json.name,
    email: profile._json.email
  }
  console.log('before requesting user...')
  const dbUser = await findOneUser(knexMain, userData.oAuthId, true);
  console.log('dbUser: ', dbUser);
  const user = {
    userId: null,
    userType: 'normal'
  }
  if (dbUser.length) {
    user.userId = dbUser[0].user_id;
    done(null, user);
  } else {
    console.log('user is not registered');
    const newUser = await signupWithGoogle(knexMain, userData);
    console.log('new user: ', newUser);
    user.userId = newUser.userId;
    done(null, user);
  }
  //console.log('google profile: ', profile);
}

module.exports = {
  AUTH_OPTIONS,
  verifyCallback
}
