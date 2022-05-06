const strParseIn = str => {
  if (str) {
    return str.replaceAll(' ', '-').toLowerCase();
  } else {
    return null
  }
};

const strParseOut = str => {
  if (str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  } else {
    return null
  }
};

const randomNumbersGenerator = () => {
  return Date.now() + '-' + Math.round(Math.random() * 1E9)
};

const generateUniqueFileName = (entity, name) => { // repetitive code
  return entity+'_'+name+'_'+uuidv4();
};

const suffixGenerator = mimeType => {
  return mimeType.substring(mimeType.lastIndexOf('/')+1);
}

module.exports = {
  strParseIn,
  strParseOut,
  randomNumbersGenerator,
  generateUniqueFileName,
  suffixGenerator,
}
