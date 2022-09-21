const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('node:path');
require('dotenv').config();
const app = express();
const cors = require('cors');
const middleware = require('i18next-http-middleware');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const helmet = require('helmet');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const { errorHandler } = require('./errors/error-handler');
const { checkLoggedIn } = require('./middlewares/login.middlewares');
const types = require('pg').types;
types.setTypeParser(1082, val => val);

const i18next = require('./translations/i18n-config');
const knex = require('./knex/knex-config');

// routes
const listingsRouter = require('./routes/listings/listings.router');
const clientRouter = require('./routes/clients/clients.router');
const picturesRouter = require('./routes/pictures/pictures.router');
const presentationsRouter = require('./routes/presentations/presentations.router');
const eventsRouter = require('./routes/events/events.router');
const listingPresetsRouter = require('./routes/listing-presets/listing-presets.router');
const checkVerifiedRouter = require('./routes/check-verified/check-verified.router');
const authRouter = require('./routes/auth/auth.router');

const googleAuth = require('./passport/google.passport');
const localAuth = require('./passport/local.passport');
const corsOptions = {
  origin: process.env.NODE_ENV ===  'production' ? 'https://inmobitas-client.herokuapp.com' : 'http://localhost:3000',
  credentials: true
}

passport.use(new GoogleStrategy(googleAuth.AUTH_OPTIONS, googleAuth.verifyCallback));
passport.use(new LocalStrategy(localAuth.AUTH_OPTIONS, localAuth.verifyCallback));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((id, done) => {
  done(null, id);
});
app.use(helmet());
app.use(cookieSession({
  name: 'session',
  sameSite: 'none',
  maxAge: 24 * 60 * 60 * 1000,
  keys: [ process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2 ]
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: false
}));
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(middleware.handle(i18next));

app.use('/auth', authRouter);
app.use(checkLoggedIn)
app.use('/listings', listingsRouter);
app.use('/clients', clientRouter);
app.use('/pictures', picturesRouter);
app.use('/presentations', presentationsRouter);
app.use('/events', checkLoggedIn, eventsRouter);
app.use('/listingpresets', listingPresetsRouter);
app.use('/checkverified', checkVerifiedRouter);
app.use(errorHandler);
app.use((err, req, res, next) => res.sendStatus(500));

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
  http.createServer(app).listen(PORT, () => { console.log(`Http server listening to port ${PORT}`) });
} else {
  https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }, app).listen(PORT, () => {
    console.log(`Https server listening to port ${PORT}...`);
  })
}

