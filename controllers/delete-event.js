const deleteEventHandler = knex => (req, res) => {

  const { userid, eventid } = req.params;

  (async function () {
    
    try {
      
      const deletedEvent = await knex('events')
        .where('user_id', '=', userid)
        .andWhere('event_id', '=', eventid)
        .del()
        .returning('*')

      console.log('deletedEvent: ', deletedEvent);

      res.status(200).json(eventid);
    } catch (err) {
      throw new Error (`there was an error: ${err}`)
    }

  })()
}

module.exports = {
  deleteEventHandler
}
