async function getAllUsers (knex) {
  const users = await knex.select('user_id', 'names', 'email', 'contact_phone')
    .from('users')
    .returning('*');

  const payload = users.map(user => ({
    userId: user.user_id,
    names: user.names,
    email: user.email,
    contactPhone: user.contact_phone
  }));
  console.log(typeof payload[0].contactPhone);

  return payload;
};

module.exports = {
  getAllUsers
}
