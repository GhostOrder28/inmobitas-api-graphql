const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('node:path');
require('dotenv').config();
const enforce = require('express-sslify');
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
const { clientBaseUrl } = require('./constants/urls');
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

//server
//const server = http.createServer(app);
//const server = https.createServer({
  //cert: fs.readFileSync(`${path.resolve()}/src/cert.pem`),
  //key: fs.readFileSync(`${path.resolve()}/src/key.pem`)
//}, app);

//options
const corsOptions = {
  origin: clientBaseUrl,
  credentials: true,
}
const cookieSessionOptions = {
  name: 'session',
  sameSite: 'none',
  //secure: true,
  secureProxy: true,
  maxAge: 24 * 60 * 60 * 1000,
  keys: [ process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2 ]
}
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      scriptSrc: ["'self'"],
      'img-src': ["'self'", 'https://res.cloudinary.com'],
    }
  },
}
const urlencodedOptions = {
  limit: '50mb',
  extended: false
}

//passport
passport.use(new GoogleStrategy(googleAuth.AUTH_OPTIONS, googleAuth.verifyCallback));
passport.use(new LocalStrategy(localAuth.AUTH_OPTIONS, localAuth.verifyCallback));
passport.serializeUser((user, done) => {
  console.log('serializing user: ', user)
  done(null, user);
});
passport.deserializeUser((id, done) => {
  console.log('deserializing user: ', id)
  done(null, id); 
});

//middelwares
app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(cookieSession(cookieSessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded(urlencodedOptions));
app.use(morgan('combined'));
app.use(middleware.handle(i18next));
//app.use(enforce.HTTPS({ trustProtoHeader: true }))

//routes
app.use('/auth', authRouter);
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.use(checkLoggedIn);
app.use('/listings', listingsRouter);
app.use('/clients', clientRouter);
app.use('/pictures', picturesRouter);
app.use('/presentations', presentationsRouter);
app.use('/events', eventsRouter);
app.use('/listingpresets', listingPresetsRouter);
app.use('/checkverified', checkVerifiedRouter);
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'service-worker.js'));
});
app.use(errorHandler);
//app.use((err, req, res, next) => res.sendStatus(500));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { console.log(`Listening to port ${PORT}`) });
