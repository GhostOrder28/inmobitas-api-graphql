const { getPresentation } = require('../../models/presentations.model');

function httpGetPresentation (knex) {
  return async (req, res) => {
    const params = req.params;
    const t = req.t;
    try {
      const pdfBuffer = await getPresentation(knex, params, t);
      return res.status(200).send(pdfBuffer)
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

module.exports = {
  httpGetPresentation
}
