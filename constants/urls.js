const clientBaseUrl = process.env.NODE_ENV === 'production' ? 'https://inmobitas-client.herokuapp.com' : 'http://localhost:3000';
const apiBaseUrl = process.env.NODE_ENV === 'production' ? 'https://inmobitas-api.herokuapp.com' : 'https://localhost:3001';

module.exports = {
  clientBaseUrl,
  apiBaseUrl
}
