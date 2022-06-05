import Notiflix from 'notiflix';
import cardTemplates from "./templates/card.hbs";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import NewsApiService from './js/api';
import './css/styles.css';
// const axios = require('axios');

 let lightbox = new SimpleLightbox('.gallery a');
const newsApiService = new NewsApiService();

const refs = {
  form: document.querySelector(".search-form"),
  loadMoreBtn: document.querySelector(".load-more"),
  galleryContainer: document.querySelector(".gallery"),
 }

refs.form.addEventListener("submit", onSearch);
refs.loadMoreBtn.addEventListener("click", onLoadMore);
refs.galleryContainer.addEventListener("click", onImageBoxClick);


hideButton();

function onSearch(evn) {
  evn.preventDefault();
  clearCardContainer();
  newsApiService.nameVal = evn.currentTarget.elements.searchQuery.value; 
    if (newsApiService.nameVal.trim() === "") {
      hideButton();
    return  Notiflix.Notify.failure('Please entrer search query');
  }
  
  newsApiService.resetPage();
  
  newsApiService.searchRequest().then(data => {
    // console.log(data);
    if (data.hits.length === 0) {
      hideButton();
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    appendCardMarkup(data.hits);
    showButton();
    lightbox.refresh(); 
  });
}


function onLoadMore() {

  newsApiService.searchRequest().then(data => {

    try {
     Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      appendCardMarkup(data.hits);
      lightbox.refresh();
     console.log("data: ",data);
      } catch (error) {
       console.log("error: ", error)
      hideButton();
             
   }
 

  });

}


function appendCardMarkup(elem) {
refs.galleryContainer.insertAdjacentHTML("beforeend", cardTemplates(elem))
}

function clearCardContainer() {
 refs.galleryContainer.innerHTML = "" 
}

function hideButton() {
  refs.loadMoreBtn.classList.add("is-hidden")
}

function showButton() {
  refs.loadMoreBtn.classList.remove("is-hidden")
}


function onImageBoxClick(event) {
  event.preventDefault();

};









