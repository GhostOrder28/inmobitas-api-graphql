const {
  getOneClient,
  getAllClients,
  updateOneClient,
  deleteOneClient,
} = require('../../models/clients.model');

const { clientsValidationSchema } = require('../../joi/clients-validation.schema');

function httpGetOneClient () {
  return async (req, res) => {
    const { params, knexInstance } = req;
    try {
      const client = await getOneClient(knexInstance, params);
      return res.status(200).json(client);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpGetAllClients () {
  return async (req, res) => {
    const { params, knexInstance } = req;
    try {
      const clients = await getAllClients(knexInstance, params);
      return res.status(200).json(clients);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpUpdateOneClient () {
  return async (req, res) => {
    const { params, knexInstance, t, body: clientData } = req;
    const { error } = clientsValidationSchema(t).validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ validationErrors: error.details });

    try {
      const updatedClient = await updateOneClient(knexInstance, params, clientData);
      return res.status(200).json(updatedClient);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpDeleteOneListing () {
  return async (req, res) => {
    const { params, knexInstance } = req;
    try {
      const deletedClientId = await deleteOneClient(knexInstance, params);
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
