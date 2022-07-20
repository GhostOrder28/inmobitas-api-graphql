const getClientsList = knex => (req, res) => {

  const userId = req.params.userid;

  (async function () {

    try {

      const clientsData = await knex.select('client_id', 'name', 'contact_phone', 'client_type')
      .from('clients')
      .where('clients.user_id', '=', userId)
      .returning('*');

      console.log('clientsData: ', clientsData);

      const dbPayload = clientsData.map(client => ({
        clientId: client.client_id,
        clientName: client.name,
        clientContactPhone: client.contact_phone,
        clientType: client.client_type,
      }))
      res.status(200).json(dbPayload)
    } catch (err) {
      throw new Error(err)
    }

  })()

}

module.exports = {
  getClientsList
}
