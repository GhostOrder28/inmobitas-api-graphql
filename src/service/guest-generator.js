const { randomNumberGenerator } = require('../utils/utility-functions');
const { loremIpsum } = require("lorem-ipsum");
const { getAllGuestsPictures, postGuestPicture } = require('../models/pictures.model');
const { postListing } = require('../models/listings.model');
const { postEvent } = require('../models/events.model');
const { 
  getDayOfYear, 
  setDayOfYear,
  setHours,
  setMinutes,
  subHours,
  getHours,
} = require('date-fns');

const userNamePool = [
  'Luke Skywalker',
  'Jim Raynor',
  'Jhon Galt',
  'Mara Slania',
  'Sarah Kerrigan',
  'Alayna'
];

const clientNamePool = [
  'Princess Leia',
  'Ariel Hanson',
  'Kaelee Gry',
  'Radobod Lorenza',
  'Lakshmi Naoise',
];

const districtNamePool = [
  'Midtown twuft',
  'Sector Koprulu',
  'Hohood Park',
  'pailacleb Circle',
  'Upper South lennunk',
]

const neighborhoodNamePool = [
  'Villa Grove',
  'Painted Hills',
  'Blodgett Mills',
  'South Shore',
  'Beulaville',
]

function generateDummyListing () {
  const body = {
    clientName: generateRandomName(clientNamePool),
    clientContactPhone: generateRandomContactPhone(),
    district: generateRandomName(districtNamePool),
    neighborhood: generateRandomName(neighborhoodNamePool),
    addressDetails: generateRandomLorem('sentences', 2),
    contractTypeId: generateRandomNumber(1, 2),
    petsAllowed: null,
    childrenAllowed: null,
    estateTypeId: generateRandomNumber(1, 4),
    floorLocation: null,
    numberOfFloors: null,
    totalArea: generateRandomNumber(150, 400),
    builtArea: null,
    numberOfBedrooms: null,
    numberOfBathrooms: null,
    numberOfGarages: null,
    numberOfKitchens: null,
    haveNaturalGas: null,
    estateDetails: generateRandomLorem('sentences', 2),
    isExclusive: generateRandomBoolean(),
    ownerPreferencesDetails: generateRandomLorem('sentences', 2),
  };

  if (body.contractTypeId === 2 && body.estateTypeId !== 4) {
    body.petsAllowed = generateRandomBoolean();
    body.childrenAllowed = generateRandomBoolean();
  } 

  if (body.estateTypeId === 1) { // if it's a house
    const numberOfFloors = generateRandomNumber(2, 5);
    const bedrooms = generateRandomNumber(2, 3);
    const bathrooms = bedrooms + (generateRandomNumber(-1, 1));

    body.numberOfFloors = numberOfFloors;
    body.numberOfBedrooms = bedrooms * numberOfFloors;
    body.numberOfBathrooms = bathrooms * numberOfFloors;
    body.numberOfKitchens = numberOfFloors + (generateRandomNumber(-1, 0));
    body.numberOfGarages = generateRandomNumber(0, 2);
    body.haveNaturalGas = generateRandomBoolean();
  } else if (body.estateTypeId === 4) { // if is not a house
    const bathrooms = generateRandomNumber(0, 1);
    if (bathrooms === 1) body.numberOfBathrooms = bathrooms;
    body.floorLocation = generateRandomNumber(1, 6);
  } else {
    const bedrooms = generateRandomNumber(2, 3);

    body.floorLocation = generateRandomNumber(1, 6);
    body.numberOfBedrooms = bedrooms; 
    body.numberOfBathrooms = bedrooms + (generateRandomNumber(-1, 1));
    body.numberOfKitchens = 1 
    body.numberOfGarages = generateRandomNumber(0, 1);
    body.haveNaturalGas = generateRandomBoolean();
  }
  body.builtArea = body.totalArea - generateRandomNumber(25, 40);
  return body;
}

function generateGuestUser () {
  const userName = generateRandomName(userNamePool);
  const emailNick = userName.replaceAll(' ', '');
  const password = randomNumberGenerator();
  const randomIdentifier = Math.floor(Math.random() * 1000000000);

  const user = {
    names: userName,
    email: `${emailNick}_${randomIdentifier}@test.com`,
    contactPhone: generateRandomContactPhone(),
    password,
  };

  return user;
}

function generateEvent (timePeriod, tzOffset) {
  const eventTitle = generateRandomLorem('words', 3);
  const now = new Date();
  let startDate = now;
  let endDate = null;
  let actualHour = getHours(startDate) - tzOffset;
  if (actualHour < 0) actualHour = 24 + actualHour;
  const minHour = 8;
  const maxHour = 18;
  const possibleMinutes = [0, 30, 15];
  const startMinute = possibleMinutes[generateRandomNumber(0, 2)];
  const eventLength = generateRandomNumber(0, 2);

  if (timePeriod === 'future') {
    const startDay = getDayOfYear(startDate) + generateRandomNumber(1, 30);
    startDate = setDayOfYear(startDate, startDay);
  } else if (timePeriod === 'past') {
    const startDay = getDayOfYear(startDate) - generateRandomNumber(1, 30);
    startDate = setDayOfYear(startDate, startDay);
  } else {
    if (actualHour > maxHour) {
      startDate = subHours(startDate, generateRandomNumber(actualHour - maxHour, actualHour - minHour));
    } else if (actualHour < minHour) {
      startDate = addHours(startDate, generateRandomNumber(maxHour - actualHour, minHour - actualHour));
    } else {
      const addOrSub = generateRandomNumber(0, 1);
      if (addOrSub === 0) startDate = addHours(startDate, generateRandomNumber(0, maxHour - actualHour));
      if (addOrSub === 1) startDate = subHours(startDate, generateRandomNumber(0, actualHour - minHour));
    }
    startDate = setMinutes(startDate, startMinute);
  }

  startDate = setHours(startDate, startHour);
  startDate = setMinutes(startDate, startMinute);

  if (eventLength !== 0) endDate = addHours(startDate, eventLength);

  const event = {
    title: eventTitle,
    startDate,
    endDate,
  }

  return event;
}

async function populateGuestData (knexInstance, userId, t, clientLang, tzOffset) {
  const pictures = await getAllGuestsPictures(knexInstance);
  for (let i = 0; i < 15; i++) {
    const listingData = generateDummyListing();
    const listing = await postListing(knexInstance, { userid: userId }, listingData, t, clientLang);
    const estateId = listing.estateId;

    for (let j = 0; j < 3; j++) {
      const guestPictureIdx = generateRandomNumber(0, pictures.length - 1);
      const picture = await postGuestPicture(
        knexInstance, 
        { userid: userId, estateid: estateId },
        pictures[guestPictureIdx].filename
      );
    }
  }
  for (let i = 0; i < 5; i++) {
    const eventData = generateEvent('present', tzOffset);
    const data = await postEvent(knexInstance, { userid: userId }, eventData);
  }
  for (let i = 0; i < 10; i++) {
    const eventData = generateEvent('future', tzOffset);
    const data = await postEvent(knexInstance, { userid: userId }, eventData);
  }
  for (let i = 0; i < 10; i++) {
    const eventData = generateEvent('past', tzOffset);
    const data = await postEvent(knexInstance, { userid: userId }, eventData);
  }
}

function generateRandomName (pool) {
  const idx = generateRandomNumber(0, pool.length - 1);
  const selectedName = pool[idx];
  return selectedName;
}

function generateRandomContactPhone () {
  const number = Math.floor(Math.random() * 9000000000);
  return number;
}

function generateRandomLorem (units, count) {
  const lorem = loremIpsum({ units, count })
  return lorem;
}

function generateRandomNumber (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const result = Math.floor(Math.random() * (max - min + 1)) + min;
  return result;
}

function generateRandomBoolean () {
  const bol = Boolean(generateRandomNumber(0, 1));
  return bol;
}

module.exports = {
  generateDummyListing,
  generateGuestUser,
  generateEvent,
  generateRandomNumber,
  populateGuestData,
}
