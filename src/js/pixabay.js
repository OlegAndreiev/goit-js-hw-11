const DEFAULT_URL = 'https://pixabay.com/api/';
const KEY = '30800366-aecfdce11bab1e79da5c222a8';
import { input, page } from '../index';
import axios from 'axios';
export async function apiPixabay() {
  const params = new URLSearchParams({
    key: KEY,
    q: input.value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40,
  });
  const inputTrim= input.value.trim()
  if (input.value === '') {
    return;
  }
  if (input.value === ' ' || input.value === '  ' || input.value === '   ' || input.value === '    ' || input.value === '     ')  {
    input.value = inputTrim
    return;
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
