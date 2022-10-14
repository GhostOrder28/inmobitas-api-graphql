

function generateDummyListing () {
  const body = {
    clientName: generateRandomName(),
    clientContactPhone: generateRandomContactPhone(),
    district: generateRandomCityName(),
    neighborhood: generateRandomCityName(),
    addressDetails: null,
    contractTypeId: generateZeroOrOne(),
    petsAllowed,
    childrenAllowed,
    estateTypeId,
    estatePrice,
    floorLocation,
    numberOfFloors,
    totalArea,
    builtArea,
    numberOfBedrooms,
    numberOfBathrooms,
    numberOfGarages,
    numberOfKitchens,
    haveNaturalGas,
    estateDetails,
    fee,
    signedDate,
    startDate,
    endDate,
    currencyTypeId,
    isExclusive,
    isPercentage,
    ownerPreferencesDetails,
    utilitiesIncluded,
  };

  if (body.contractTypeId === 2) 
  const contractTypeId = generateRandomContractId();
  body.contractTypeId = contractTypeId;

}

function generateRandomName () {
  const boyName = axios.get('https://names.drycodes.com/1?nameOptions=boy_name');
  const girlName = axios.get('https://names.drycodes.com/1?nameOptions=girl_name');
  const names = [boyName.data[0], girlName.data[0]]
  const selector = Math.round(Math.random());
  const selectedName = names[selector];
  return selectedName;
}

function generateRandomContactPhone () {
  const number = Math.random() * 9000000000;
  return number;
}

function generateRandomCityName () {
  const res = axios.get('https://names.drycodes.com/1?nameOptions=cities');
  const cityName = res.data[0];
  return cityName;
}

function generateZeroOrOne () {
  const number = Math.round(Math.random()) + 1;
  return number;
}
