const { knexGuest, knexMain } = require('../knex/knex-config');

function checkUserType (req, res, next) {
  console.log('req.user: ', req.user);
  console.log('req.params.usertype: ', req.params.usertype);

  const userTypeInCookie = req.user?.userType || null;
  const userTypeInParams = req.params?.usertype || null;
  console.log('checking user type...');

  if (userTypeInCookie === 'guest' || userTypeInParams === 'guest') {
    console.log('user is guest');
    req.knexInstance = knexGuest;  
  } else if (userTypeInCookie === 'normal' || userTypeInParams === 'normal'){
    console.log('user is normal')
    req.knexInstance = knexMain;
  } else {
    throw Error('user type is neither guest nor normal');
  }
  next();
}

module.exports = {
  checkUserType
}
