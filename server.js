const express = require('express');
const path = require('node:path');
require('dotenv').config();
const app = express();
const cors = require('cors');
const i18next = require('./translations/i18n-config');
const middleware = require('i18next-http-middleware');
var types = require('pg').types;
types.setTypeParser(1082, val => val);
const knex = require('./knex/knex-config');

// routes
const listingsRouter = require('./routes/listings/listings.router');
const clientRouter = require('./routes/clients/clients.router');
const picturesRouter = require('./routes/pictures/pictures.router');
const presentationsRouter = require('./routes/presentations/presentations.router');
const eventsRouter = require('./routes/events/events.router');
const listingPresetsRouter = require('./routes/listing-presets/listing-presets.router');
const checkVerifiedRouter = require('./routes/check-verified/check-verified.router');
const signupRouter = require('./routes/signup/signup.router');
const signinRouter = require('./routes/signin/signin.router');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: false
}));
app.use(cors());
app.use(middleware.handle(i18next))

app.use('/listings', listingsRouter);
app.use('/clients', clientRouter);
app.use('/pictures', picturesRouter);
app.use('/presentations', presentationsRouter);
app.use('/events', eventsRouter);
app.use('/listingpresets', listingPresetsRouter);
app.use('/checkverified', checkVerifiedRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listen to port ${PORT}...`);
})
