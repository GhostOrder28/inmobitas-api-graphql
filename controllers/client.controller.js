const types = require('pg').types;
types.setTypeParser(20, function(value){
  return parseInt(value, 10)
})

const getClient = knex => (req, res) => {

  const userId = req.params.userid;
  const clientId = req.params.clientid;

  (async function () {

    try {

      const clientData = await knex.select('*')
      .from('clients')
      .where('clients.user_id', '=', userId)
      .andWhere('clients.client_id', '=', clientId)
      .returning('*');

      console.log('clientData: ', clientData);

      const dbPayload = {
        clientId: clientData[0].client_id,
        clientName: clientData[0].name,
        clientContactPhone: clientData[0].contact_phone,
        clientAge: clientData[0].age,
        clientType: clientData[0].client_type,
        clientDetails: clientData[0].client_details,
      }

      console.log('dbPayload: ', dbPayload);

      res.status(200).json(dbPayload)

    } catch (err) {
      throw new Error(err)
    }

  })()

}

module.exports = {
  getClient
}
