import Notiflix, { Notify } from 'notiflix';
// import { apiPixabay } from './js/pixabay';
const form = document.querySelector('form');
const input = document.querySelector('input');
const submitBtn = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.guard');
const loadMore = document.querySelector('.more');
const DEFAULT_URL = 'https://pixabay.com/api/';
const KEY = '30800366-aecfdce11bab1e79da5c222a8';
const options = {
  root: null,
  rootMargin: '50px',
  threshold: 1,
};

form.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', onLoad);
const observer = new IntersectionObserver(onLoad, options);
let page = 1;

function onSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  apiPixabay().then(data => {
    gallery.insertAdjacentHTML('beforeend', createMarkupByPhotos(data));
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (data.hits.length !== 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    // onLoad();
    observer.observe(guard);
    return data;
  });
}

function onLoad(entries) {
  console.log(entries[0].isIntersecting);
  entries.forEach(entry => {
    // console.log(entry);
    if (entry.isIntersecting) {
      page += 1;
      apiPixabay(page).then(data => {
        gallery.insertAdjacentHTML('beforeend', createMarkupByPhotos(data));
        console.log(data);
        if (data.hits === []) {
          observer.unobserve(guard);
        }
      });
    }
  });
}

async function apiPixabay() {
  const params = new URLSearchParams({
    key: KEY,
    q: input.value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 5,
  });
  console.log(page);
  //   console.log(input.value);
  if (input.value === '') {
    return;
  }

  return await fetch(`${DEFAULT_URL}?${params}`)
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }
      //   observer.observe(guard);
      return response.json();
    })
    .catch(err => console.log(err));
}

function createMarkupByPhotos(arr) {
  //   console.log(arr.hits);
  return arr.hits
    .map(
      item =>
        `<div class="photo-card">
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${item.downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
}
