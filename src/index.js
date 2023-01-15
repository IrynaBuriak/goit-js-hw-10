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
    <h2>${name.official}</h2>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages)}</p>
  `;
}

function createCountryList({ name, flags }) {
  return `
    <li>
    <img src="${flags.svg}" alt="${name.official}" width="50"/>
    <h2>${name.official}</h2> 
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
      }

      if (countries.length > 1 && countries.length <= 10) {
        const countryList = countries.map(country =>
          createCountryList(country)
        );
        refs.list.innerHTML = countryList.join('');
        refs.info.innerHTML = '';
      }

      if (countries.length === 1) {
        const countryItem = countries.map(country =>
          createCountryCard(country)
        );
        refs.list.innerHTML = '';
        refs.info.innerHTML = countryItem.join('');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(error);
      refs.list.innerHTML = '';
      refs.info.innerHTML = '';
      return;
    });
}
