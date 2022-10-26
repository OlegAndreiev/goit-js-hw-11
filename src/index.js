import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { apiPixabay, inputTrim } from './js/pixabay';
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
  if (observer) {
    observer.disconnect();
  }
  if (input.value === '') {
    Notiflix.Notify.failure(
      'Sorry, search field cannot be empty. Please try again.'
    );
    return;
  }
  apiPixabay().then(data => {
    if (data.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (data.data.hits.length !== 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${data.data.totalHits} images.`
      );
    }
    imagesContainer.insertAdjacentHTML('beforeend', createMarkupByPhotos(data));
    return data;
  });
}

function onLoad(entries) {
  lightbox();
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      apiPixabay(page).then(data => {
        imagesContainer.insertAdjacentHTML(
          'beforeend',
          createMarkupByPhotos(data)
        );
        if (data.data.hits.length === 0) {
          observer.unobserve(guard);
        }
      });
    }
  });
}

function createMarkupByPhotos(arr) {
  observer.observe(guard);
  return arr.data.hits
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

function lightbox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    overlayOpacity: 0.7,
  });
  lightbox.refresh();
}
