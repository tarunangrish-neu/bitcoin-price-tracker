const axios = require('axios');
const vs_currency= 'usd';
const id= 'bitcoin';
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  
  url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&id=${id}`,
  headers: { 
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Content-Type': 'application/json',
  }
};
const fetchData = async() => {
const response = await axios.request(config);
return response.data;
}

module.exports = fetchData;