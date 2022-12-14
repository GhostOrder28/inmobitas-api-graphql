const { getPresentation } = require('../../models/presentations.model');

function httpGetPresentation () {
  return async (req, res) => {
    const { params, knexInstance, t, user: { userType } } = req;
    try {
      const pdfBuffer = await getPresentation(knexInstance, params, t, userType);
      return res.status(200).send(pdfBuffer)
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

module.exports = {
  httpGetPresentation
}
