const axios = require('axios');
const bcrypt = require('bcrypt');
const { randomNumberGenerator } = require('../utils/utility-functions');

async function generateDummyListing () {
  const body = {
    clientName: await generateRandomName(),
    clientContactPhone: generateRandomContactPhone(),
    district: await generateRandomCityName(),
    neighborhood: await generateRandomCityName(),
    addressDetails: await generaeRandomLorem(),
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
    estateDetails: await generaeRandomLorem(),
    isExclusive: generateRandomBoolean(),
    ownerPreferencesDetails: await generaeRandomLorem(),
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

async function generateGuestUser () {
  const userName = await generateRandomName();
  const password = randomNumberGenerator();
  const saltRounds = 10;
  const hashedPwd = await bcrypt.hash(password, saltRounds);

  const user = {
    names: userName,
    email: `${userName}@test.com`,
    contactPhone: generateRandomContactPhone(),
    password,
    hashedPwd,
  };

  return user;
}

async function generateRandomName () {
  const boyName = await axios.get('https://names.drycodes.com/1?nameOptions=boy_names')
  const girlName = await axios.get('https://names.drycodes.com/1?nameOptions=girl_names');
  const names = [boyName.data[0], girlName.data[0]]
  console.log(names)
  const selector = generateRandomNumber(0, 1) 
  const selectedName = names[selector];
  return selectedName;
}

function generateRandomContactPhone () {
  const number = Math.floor(Math.random() * 9000000000);
  return number;
}

async function generateRandomCityName () {
  const res = await axios.get('https://names.drycodes.com/1?nameOptions=cities');
  const cityName = res.data[0];
  return cityName;
}

async function generaeRandomLorem () {
  const res = await axios.get('https://loripsum.net/api/plaintext/1/short');
  const lorem = res.data;
  return lorem;
}

function generateRandomNumber (min, max, excludeZero) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const result = Math.floor(Math.random() * (max - min + 1)) + min;
  if (excludeZero && result === 0) {
    return generateRandomNumber(min, max, excludeZero);
  }
  return result;
}

function generateRandomBoolean () {
  const bol = Boolean(generateRandomNumber(0, 1));
  return bol;
}

module.exports = {
  generateDummyListing,
  generateGuestUser,
}
