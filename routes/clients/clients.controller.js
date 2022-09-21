const {
  getOneClient,
  getAllClients,
  updateOneClient,
  deleteOneClient,
} = require('../../models/clients.model');

const { clientsValidationSchema } = require('../../joi/clients-validation.schema');

function httpGetOneClient (knex) {
  return async (req, res) => {
    const params = req.params;
    try {
      const client = await getOneClient(knex, params);
      return res.status(200).json(client);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
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
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpUpdateOneClient (knex) {
  return async (req, res) => {
    const params = req.params;
    const t = req.t;
    const clientData = req.body;

    const { error } = clientsValidationSchema(t).validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ validationErrors: error.details });

    try {
      const updatedClient = await updateOneClient(knex, params, clientData);
      return res.status(200).json(updatedClient);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpDeleteOneListing (knex) {
  return async (req, res) => {
    const params = req.params;

    try {
      const deletedClientId = await deleteOneClient(knex, params);
      return res.status(200).json(deletedClientId);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

module.exports = {
  httpGetOneClient,
  httpGetAllClients,
  httpUpdateOneClient,
  httpDeleteOneListing,
}
