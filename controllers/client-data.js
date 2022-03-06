const fs = require('fs-extra');
const { strParseIn } = require('../utils/utility-functions');

const clientDataHandler = knex => (req, res) => {

  const userId = req.params.userid;
  const clientId = req.params.clientid;

  (async function () {

    try {

      const clientData = await knex.select('*')
      .from('clients')
      .where('clients.user_id', '=', userId)
      .andWhere('clients.client_id', '=', clientId)
      .returning('*');

      // console.log('--------------- LOGGING: clientData');
      // console.log(clientData);

      const dbPayload = clientData.map(client => ({
        clientId: client.client_id,
        name: client.name,
        contactPhone: client.contact_phone,
        age: client.age,
        clientType: client.client_type,
        clientDetails: client.client_details,
      }))

      console.log('--------------- LOGGING: dbPayload');
      console.log(dbPayload);

      res.status(200).json(dbPayload)

    } catch (err) {
      throw new Error(err)
    }

  })()

}

module.exports = {
  clientDataHandler
}
