const DEFAULT_URL = 'https://pixabay.com/api/';
const KEY = '30800366-aecfdce11bab1e79da5c222a8';
import { input, page, form } from '../index';
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
  console.log(input.value);
  console.log(page);
  if (input.value === '') {
    return;
  }

  return await fetch(`${DEFAULT_URL}?${params}`)
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(err => console.log(err));
}
