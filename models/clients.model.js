const types = require('pg').types;
types.setTypeParser(20, function(value){
  return parseInt(value, 10)
})

async function getOneClient (knex, params) {
  const { userid, clientid } = params;
  try {

    const client = await knex.select('*')
    .from('clients')
    .where('clients.user_id', '=', userid)
    .andWhere('clients.client_id', '=', clientid)
    .returning('*');

    const formattedClient = {
      clientId: client[0].client_id,
      clientName: client[0].name,
      clientContactPhone: client[0].contact_phone,
      clientAge: client[0].age,
      clientType: client[0].client_type,
      clientDetails: client[0].client_details,
    }

    console.log('formattedClient: ', formattedClient);

    return formattedClient;

  } catch (err) {
    throw new Error(err)
  }
}

async function getAllClients (knex, params) {
  const { userid } = params
  try {
    const clients = await knex.select('client_id', 'name', 'contact_phone', 'client_type')
    .from('clients')
    .where('clients.user_id', '=', userid)
    .returning('*');

    const formattedClients = clients.map(client => ({
      clientId: client.client_id,
      clientName: client.name,
      clientContactPhone: client.contact_phone,
      clientType: client.client_type,
    }))

    console.log('formattedClients: ', formattedClients);

    return formattedClients; 
    
  } catch (error) {
    throw new Error(error);
  }
}


module.exports = {
  getOneClient,
  getAllClients,
}
