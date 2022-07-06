const express = require('express');
const path = require('node:path');
require('dotenv').config();
const app = express();
const cors = require('cors');
const { uploadMiddleware } = require('./utils/multer-conf');
const i18next = require('./translations/i18n-config');
const middleware = require('i18next-http-middleware');
var types = require('pg').types;
types.setTypeParser(1082, val => val);
const knex = require('knex')({
  client: 'pg',
  connection: process.env.POSTGRES_CONNECTION_STRING || {
    host : '127.0.0.1',
    port : 5432,
    user : 'ghost',
    database : 'inmobitas'
  } 
});

// controllers

const listing = require('./controllers/listing');
const signUp = require('./controllers/signup');
const signIn = require('./controllers/signin');
const listings = require('./controllers/listings');
const listingData = require('./controllers/listing-data');
const clients = require('./controllers/clients');
const clientData = require('./controllers/client-data');
const clientListings = require('./controllers/client-listings');
const listingFormData = require('./controllers/listing-form-data');
const uploadFile = require('./controllers/upload');
const estatePictures = require('./controllers/estate-pictures');
const deletePictures = require('./controllers/delete-pictures');
const getDocument = require('./controllers/get-document')
const deleteDocument = require('./controllers/delete-document');
const event = require('./controllers/event');
const events = require('./controllers/events');
const deleteEvent = require('./controllers/delete-event');
const todayEvents = require('./controllers/today-events');
const checkVerifiedUser = require('./controllers/check-verified-user');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: false
}));
app.use(cors());
app.use(middleware.handle(i18next))

app.get('/listings/:userid', listings.listingsHandler(knex));
app.get('/listing/:userid/:estateid', listingData.listingDataHandler(knex));
app.get('/clients/:userid', clients.clientsHandler(knex));
app.get('/client/:userid/:clientid', clientData.clientDataHandler(knex));
app.get('/listings/:userid/:clientid', clientListings.clientListingsHandler(knex));
app.get('/listingformdata', listingFormData.listingFormDataHandler(knex));
app.get('/estatepictures/:userid/:estateid', estatePictures.estatePicturesHandler(knex));
app.get('/genpdf/:userid/:estateid', getDocument.getDocumentHandler(knex));
app.get('/events/:userid/:currentmonth/:currentyear', events.eventsHandler(knex));
app.get('/todayevents/:userid', todayEvents.todayEventsHandler(knex));
app.get('/checkverified/:userid/:estateid/:uploadquantity', checkVerifiedUser.checkVerifiedUserHanlder(knex));
app.post('/newlisting/:userid', listing.listingHandler(knex));
app.post('/signup', signUp.signUpHandler(knex));
app.post('/signin', signIn.signInHandler(knex));
app.post('/upload/:userid/:estateid', uploadMiddleware.single('file'), uploadFile.uploadFileHandler(knex));
app.post('/event/:userid', event.eventHandler(knex));
app.put('/editlisting/:userid/:clientid/:estateid/:contractid', listing.listingHandler(knex));
app.put('/editevent/:userid/:eventid', event.eventHandler(knex));
app.delete('/deletepicture/:userid/:estateid/:pictureid', deletePictures.deletePicturesHandler(knex));
app.delete('/deletedocument/:userid/:estateid', deleteDocument.deleteDocumentHandler(knex));
app.delete('/deleteevent/:userid/:eventid', deleteEvent.deleteEventHandler(knex));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listen to port ${PORT}...`);
})
