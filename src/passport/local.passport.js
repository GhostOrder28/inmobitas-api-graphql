const bcrypt = require('bcrypt');
const { ValidationError } = require('../errors/api-errors');
const { AuthenticationError } = require('../errors/db-errors');

const { signin } = require('../models/auth.model');

const AUTH_OPTIONS = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}

async function verifyCallback (req, username, password, done) {
  // username is email
  console.log('verify callback reached');
  const { knexInstance, t } = req;
  try {
    const signinData = await signin(knexInstance, username);

    if (!signinData) throw new AuthenticationError(t('wrongCredentials'));
    
    const match = await bcrypt.compare(password, signinData.password);

    if (match) {
      const user = {
        userId: signinData.user_id,
        names: signinData.names,
      }
      console.log('user credentials matched! info being sent to passport.authenticate callback: ', user);
      done(null, user);
    } else {
      throw new AuthenticationError(t('wrongCredentials'))
    }
  } catch (error) {
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError 
    ) return done(null, false, error);
    return done(error);
  }
}

module.exports = { verifyCallback, AUTH_OPTIONS };
