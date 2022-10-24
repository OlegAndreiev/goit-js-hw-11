import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { apiPixabay } from './js/pixabay';
export const form = document.querySelector('form');
export const input = document.querySelector('input');
const imagesContainer = document.querySelector('.gallery');
const guard = document.querySelector('.guard');

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1,
};

form.addEventListener('submit', onSubmit);

const observer = new IntersectionObserver(onLoad, options);
export let page = 1;

function onSubmit(evt) {
  evt.preventDefault();
  imagesContainer.innerHTML = '';
  page = 1;

  if (input.value === '') {
    return;
  }
  console.log(input.value);
  apiPixabay().then(data => {
    imagesContainer.insertAdjacentHTML('beforeend', createMarkupByPhotos(data));
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (data.hits.length !== 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      observer.observe(guard);
    }
    // observer.unobserve(guard);

    lightbox();
    return data;
  });
  // form.reset();
}

function onLoad(entries) {
  console.log(entries[0].isIntersecting);
  entries.forEach(entry => {
    // console.log(entry);
    if (entry.isIntersecting) {
      page += 1;
      apiPixabay(page).then(data => {
        imagesContainer.insertAdjacentHTML(
          'beforeend',
          createMarkupByPhotos(data)
        );
        lightbox.refresh();
        console.log(data.hits);
        if (data.hits.length === 0) {
          observer.unobserve(guard);
        }
      });
    }
  });
}

function lightbox() {
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    overlayOpacity: 0.7,
  });
}
function createMarkupByPhotos(arr) {
  return arr.hits
    .map(
      item =>
        `<div class="photo-card">
  <a class="photo-card" href="${item.largeImageURL}">
  <img  class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>
      <b><span class="info-item-span">${item.likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views:</b>
      <b><span class="info-item-span">${item.views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments:</b>
      <b><span class="info-item-span">${item.comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads:</b>
      <b><span class="info-item-span">${item.downloads}</span></b>
    </p>
  </div>
</div>`
    )
    .join('');
}
