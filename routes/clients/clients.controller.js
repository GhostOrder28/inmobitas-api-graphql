const {
  getOneClient,
  getAllClients,
} = require('../../models/clients.model');

function httpGetOneClient (knex) {
  return async (req, res) => {
    const params = req.params;
    try {
      const client = await getOneClient(knex, params);
      return res.status(200).json(client);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}

function httpGetAllClients (knex) {
  return async (req, res) => {
    const params = req.params;
    try {
      const clients = await getAllClients(knex, params);
      return res.status(200).json(clients);
    } catch (error) {
      return res.status(400).json({ error }); 
    }
  }
}

module.exports = {
  httpGetOneClient,
  httpGetAllClients
}
