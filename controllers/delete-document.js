const { deleteResource } = require('../utils/cloudinary');

const deleteDocumentHandler = knex => async (req, res) => {

  console.log('aaaaaaaaaaaaaaaaaa');
  const { userid, estateid } = req.params;

  const documentData = await knex.select('*')
    .from('documents')
    .where('user_id', '=', userid)
    .andWhere('estate_id', '=', estateid)
    .returning('*')

  console.log('documentData: ', documentData);
  console.log(documentData[0]?.cloudinary_public_id);

  if (documentData[0]?.cloudinary_public_id) {
    await deleteResource(documentData[0].cloudinary_public_id);
    const deletedPicture = await knex('documents')
      .where('document_id', '=', documentData[0].document_id)
      .del()
      .returning('*')
    res.status(200).json('document deleted');    
  } else {
    res.status(200).json('there is no document to delete');
  }

}

module.exports = {
  deleteDocumentHandler
};
