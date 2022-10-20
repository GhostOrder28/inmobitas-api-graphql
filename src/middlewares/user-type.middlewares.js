const { knexGuest, knexMain } = require('../knex/knex-config');

function checkUserType (req, res, next) {
  const userType = req.user.userType;
  console.log('checking user type...');
  if (userType === 'guest') {
    console.log('user is guest');
    req.knexInstance = knexGuest;  
  } else {
    console.log('user is normal')
    req.knexInstance = knexMain;
  }
  //next();
}

module.exports = {
  checkUserType
}
