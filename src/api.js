import axios from 'axios';

const API_KEY = '37318087-ecb94321c9fa946f42e60ed92';
const BASE_URL = 'https://pixabay.com/api/';
export const searchFormEl = document.getElementById('search-form');

export const myRequest = async function (pageNum, perPage) {
  return await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: searchFormEl.elements.searchQuery.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: pageNum,
      per_page: perPage,
    },
  });
};
