import Notiflix, { Notify } from 'notiflix';
import { apiPixabay } from './js/pixabay';
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

const observer = new IntersectionObserver(onLoad, options);
let page = 1;

// aaa().then(data => {
//   //   console.log(data);
//   gallery.insertAdjacentHTML('beforeend', createMarkupByPhotos(data.hits));
//   observer.observe(guard);
// });

// loadMore.addEventListener('click', onLoad);

function onLoad(entries) {
  entries.forEach(entry => {
    // console.log(entry);
    if (entry.isIntersecting) {
      page += 1;
      aaa(page).then(data => {
        gallery.insertAdjacentHTML('beforeend', createMarkupByPhotos(data));
        console.log(data);
        if (data.hits === data.totalHits) {
          observer.unobserve(guard);
        }
      });
    }
  });
}

function onSubmit(evt) {
  evt.preventDefault();
  observer.observe(guard);
  aaa();
}

function aaa(page) {
  //   gallery.innerHTML = '';
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
  return fetch(`${DEFAULT_URL}?${params}`)
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .then(data => {
      gallery.insertAdjacentHTML('beforeend', createMarkupByPhotos(data));
      //   const markupPhotos = createMarkupByPhotos(data);
      //   gallery.innerHTML = markupPhotos;
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (data.hits.length !== 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
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
