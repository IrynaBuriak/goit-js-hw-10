export function createCountryCard({
  name,
  capital,
  population,
  flags,
  languages,
}) {
  return `
    <img src="${flags.svg}" alt="${name.official}" width="100"/>
    <h2>${name.official}</h2>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages)}</p>
  `;
}

export function createCountryList({ name, flags }) {
  return `
    <li>
    <img src="${flags.svg}" alt="${name.official}" width="100"/>
    <h2>${name.official}</h2> 
    </li>
    `;
}
