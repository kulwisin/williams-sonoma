require('dotenv').config();
const axios = require('axios');

// Axios Client declaration
const api = axios.create({
  baseURL: 'https://www.westelm.com/services/catalog/v4/category/shop/new/all-new/index.json',
  timeout: process.env.TIMEOUT || 5000,
});

// Generic GET request function
const get = async () => {
  const response = await api.get();
  const { data } = response;
  if (data) {
    return data;
  }
  throw new Error(data.error);
};

module.exports = {
  getRates: () => get(),
};