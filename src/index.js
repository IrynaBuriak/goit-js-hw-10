import './css/styles.css';
import Notiflix from 'notiflix';
import { debounce } from 'lodash';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

function createCountryCard({ name, capital, population, flags, languages }) {
  return `    
    <img src="${flags.svg}" alt="${name.official}" width="200"/>
    <h2 class="country-title" >${name.official}</h2> 
    <p class="country-text">Capital: ${capital}</p>
    <p class="country-text">Population: ${population}</p>
    <p class="country-text">Languages: ${Object.values(languages)}</p>
    
  `;
}

function createCountryList({ name, flags }) {
  return `
    <li class="country-item">
    <img src="${flags.svg}" alt="${name.official}" width="100"/>
    <h2 class="country-title" >${name.official}</h2> 
    </li>
    `;
}

refs.input.addEventListener('input', debounce(onInputData, DEBOUNCE_DELAY));

function onInputData() {
  const countryName = refs.input.value.trim();

  if (countryName === '') {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
    return;
  }

  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        refs.list.innerHTML = '';
        refs.info.innerHTML = '';
        return;
      } else if (countries.length > 1 && countries.length <= 10) {
        const countryList = countries.map(country =>
          createCountryList(country)
        );
        refs.list.innerHTML = countryList.join('');
        refs.info.innerHTML = '';
      } else if (countries.length === 1) {
        const countryItem = countries.map(country =>
          createCountryCard(country)
        );
        refs.list.innerHTML = '';
        refs.info.innerHTML = countryItem.join('');
      } else if (countries.length === 0) {
        refs.list.innerHTML = '';
        refs.info.innerHTML = '';
      } else {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        refs.list.innerHTML = '';
        refs.info.innerHTML = '';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(error);
      refs.list.innerHTML = '';
      refs.info.innerHTML = '';
      return;
    });
}
