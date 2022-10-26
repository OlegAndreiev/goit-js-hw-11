const DEFAULT_URL = 'https://pixabay.com/api/';
const KEY = '30800366-aecfdce11bab1e79da5c222a8';
import { input, page } from '../index';
import Notiflix, { Notify } from 'notiflix';
import axios from 'axios';
export async function apiPixabay() {
  const inputValue = input.value;
  // console.log(inputValue.split(''));
  const inputTrim = inputValue.trim();
  // console.log(inputTrim.split(''));
  const params = new URLSearchParams({
    key: KEY,
    q: inputTrim,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40,
  });

  if (inputTrim === '') {
    return Notiflix.Notify.failure(
      'Sorry, the search field must not contain only a space. Please try again.'
    );
  }

  return await axios
    .get(`${DEFAULT_URL}?${params}`)
    .then(response => {
      if (!response.status) {
        throw new Error();
      }
      return response;
    })
    .catch(err => console.log(err));
}
