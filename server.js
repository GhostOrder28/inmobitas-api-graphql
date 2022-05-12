const express = require('express');
require('dotenv').config();
if (process.env.LE_URL && process.env.LE_CONTENT) {
  app.get(process.env.LE_URL, function(req, res) {
    return res.send(process.env.LE_CONTENT)
  });
}
const app = express();
const cors = require('cors');
const { uploadMiddleware } = require('./utils/multer-conf');
var types = require('pg').types;
types.setTypeParser(1082, val => val);
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : process.env.HOST,
    port : process.env.KNEX_PORT,
    user : process.env.DB_USER,
    database : process.env.DB,
    debug: true,
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

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.get('/listings/:userid', listings.listingsHandler(knex))
app.get('/listing/:userid/:estateid', listingData.listingDataHandler(knex))
app.get('/clients/:userid', clients.clientsHandler(knex))
app.get('/client/:userid/:clientid', clientData.clientDataHandler(knex))
app.get('/listings/:userid/:clientid', clientListings.clientListingsHandler(knex))
app.get('/listingformdata', listingFormData.listingFormDataHandler(knex))
app.get('/estatepictures/:userid/:estateid', estatePictures.estatePicturesHandler(knex))
app.post('/newlisting/:userid', listing.listingHandler(knex))
app.post('/signup', signUp.signUpHandler(knex))
app.post('/signin', signIn.signInHandler(knex))
app.post('/upload/:userid/:estateid', uploadMiddleware.single('file'), uploadFile.uploadFileHandler(knex))
app.put('/editlisting/:userid/:clientid/:estateid/:contractid', listing.listingHandler(knex))
app.delete('/deletepicture/:userid/:estateid/:pictureid', deletePictures.deletePicturesHandler(knex))

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listen to port ${PORT}...`);
})
