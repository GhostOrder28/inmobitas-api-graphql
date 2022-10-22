const { UNIQUE_VIOLATION } = require('pg-error-constants');
const { strParseIn } = require('../utils/utility-functions');
const { DuplicateEntityError } = require('../errors/db-errors');
const { formatDbResponse } = require('../utils/utility-functions');

async function signin (knex, userEmail) {
  
  try {
    console.log('selecting info from users table...')
    const userProfileData = await knex.select('user_id', 'email', 'names')
      .from('users')
      .where('email', '=', userEmail)
      .returning('*');

    console.log('userProfileData: ', userProfileData);

    if (!userProfileData.length) return null;
    
    const userCredentials = await knex.select('password')
      .from('users_credentials')
      .where('user_id', '=', userProfileData[0].user_id)
      .returning('*');

    console.log('userCredentials: ', userCredentials);

    const userData = { ...userProfileData[0], ...userCredentials[0] }
    return userData;
  } catch (error) {
    console.log('there is an error when trying to select users or userCredentials tables');
    console.log(error);
  }
}

async function signup (knex, signupData, t) {

  const {
    names,
    email,
    contactPhone,
    password,
    hashedPwd,
  } = signupData;

  try {
    await knex.transaction(async trx => {
      const userData = await trx.insert({
        names: strParseIn(names), // TODO: this should be username
        email,
        contact_phone: contactPhone,
      })
        .into('users')
        .returning('*');
      
      console.log('userData: ', userData);

      const userCredentials = await trx.insert({
        user_id: userData[0].user_id,
        password: hashedPwd
      })
        .into('users_credentials')
        .returning('*');

      console.log('userCredentials: ', userCredentials);
      
    });

    return { email, password }
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION && err.constraint === 'agents_email_key') {
      throw new DuplicateEntityError(t('emailAlreadyExists'));
    }
    throw new Error(`We couldn't register the user, reason: ${err}`)
  }
}

async function findOneUser (knex, userId, isOAuth) {
  console.log('incomming user id: ', userId);
  console.log('is auth?', isOAuth)
  try {
    let user;
    if (isOAuth) {
      user = await knex('users_providers')
        .join('users', 'users_providers.user_id', '=', 'users.user_id')
        .where('users_providers.oauth_id', '=', userId)
        .select('users.user_id', 'users.names', 'users_providers.oauth_id')
        .returning('*');

      console.log('user: ', user);
    } else {
      user = await knex.select('names', 'user_id')
        .from('users')
        .where('user_id', '=', userId)
        .returning('*');

      console.log('user: ', user);
    }
    return user;
  } catch (error) {
    throw new Error(`We coudn't find the user, reason: ${error}`);
  }
}

async function signupWithGoogle (knex, googleUserData) {
  let userData;

  try {
    const googleProviderId = await knex.select('provider_id')
      .from('oauth_providers')
      .where('name', '=', 'google')
      .returning('*');

    await knex.transaction(async trx => {
      const userProfileData = await trx.insert({
        names: strParseIn(googleUserData.names),
        email: googleUserData.email,
      })
        .into('users')
        .returning('*');

      console.log('userProfileData: ', userProfileData);

      const userOAuthData = await trx.insert({
        oauth_id: googleUserData.oAuthId,
        user_id: userProfileData[0].user_id,
        provider_id: googleProviderId[0].provider_id
      })
        .into('users_providers')
        .returning(['oauth_id']);

      console.log('userOAuthData: ', userOAuthData);

      userData = formatDbResponse({ ...userProfileData[0], ...userOAuthData[0] });

      console.log('userData: ', userData)
    });
  } catch (error) {
    throw new Error(`There is an error trying to signup a new user from Google OAuth, reason ${error}`)
  }
  
  return userData;
}

module.exports = {
  signin,
  signup,
  findOneUser,
  signupWithGoogle
}
