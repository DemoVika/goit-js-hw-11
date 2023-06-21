import { myRequest, searchFormEl } from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const buttonEl = document.querySelector('.button');
const galleryEl = document.querySelector('.gallery');
const infoEl = document.querySelector('.info');
const buttonLoadMore = document.querySelector('.load-more');
const PER_PAGE = 40;
let pageCounter = 1;

Notify.init({
  width: '520px',
  position: 'center-top',
  clickToClose: true,
  fontSize: '18px',
});

const lightbox = new SimpleLightbox('.gallery a');

hideLoadMore();

searchFormEl.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  galleryEl.innerHTML = '';
  pageCounter = 1;
  myRequest(pageCounter, PER_PAGE)
    .then(function (response) {
      const arrayOfObjects = response.data.hits; //массив объектов
      Notify.info(`Hooray! We found ${response.data.totalHits} images.n`);
      drawCards(arrayOfObjects);
      lightbox.refresh();
      checkTotalHits(response.data.totalHits);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function drawCards(arrayOfObjects) {
  const markupImg = arrayOfObjects
    .map(item => {
      const {
        webformatURL, //ссылка на маленькое изображение
        largeImageURL, //ссылка на большое изображение
        tags, //описанием изображения alt
        likes, //количество лайков
        views, //количество просмотров
        comments, //количество комментариев
        downloads, //количество загрузок
      } = item;

      return `<a href='${largeImageURL}'><div class="photo-card">
            <img class="img-card" src='${webformatURL}' alt='${tags}' loading="lazy"/>
            <div class="info">
            <p class="info-item"><br><b>likes:</b><br> ${likes}</p>
            <p class="info-item"><br><b>views:</b><br> ${views}</p>
            <p class="info-item"><br><b>comments:</b><br> ${comments}</p>
            <p class="info-item"><br><b>downloads:</b><br> ${downloads}</p>
            </div>
            </div></a>
            `;
    })
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markupImg);

  showLoadMore();
}

buttonLoadMore.addEventListener('click', () => {
  pageCounter += 1;
  if (pageCounter > 1) {
    myRequest(pageCounter, PER_PAGE)
      .then(function (response) {
        const arrayOfObjects = response.data.hits; //массив объектов

        drawCards(arrayOfObjects);

        softScroll();

        lightbox.refresh();
        checkTotalHits(response.data.totalHits);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});
function showLoadMore() {
  buttonLoadMore.classList.remove('hidden');
}

function hideLoadMore() {
  buttonLoadMore.classList.add('hidden');
}

function checkTotalHits(totalHits) {
  if (PER_PAGE * pageCounter > totalHits) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    hideLoadMore();
  }
}

function softScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
