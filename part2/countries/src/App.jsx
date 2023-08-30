import { useEffect, useState } from "react";
import "./App.css";
import { getAll as getCountries } from "./service/countries";

const Countries = ({ countries, isShowed, handleClick }) => {

  if (countries.length > 10) {
    return <p>To many countries to Show</p>;
  }

  if (countries.length <= 10 && countries.length !== 1) {
    return (
      <>
        {countries.map((c, i) => {
          if (isShowed[i]) {
            return <CountryInfo country={c} />;
          }
          return (
            <>
              <li style={{
                listStyle: 'none',
                marginTop: '10px',
              }}>{c.name.common}</li>
              <button onClick={handleClick(i)}>Show</button>
            </>
          );
        })}
      </>
    );
  }

  return <CountryInfo country={countries[0]} />;
};

const CountryInfo = ({ country }) => {
  return (
    <div style={
      {
      margin: '50px',
      listStyle: 'none',
    }}>
      <h2>{country.name.common}</h2>
      <img src={country.flags.png} alt={country.flags.alt} />
      <li>Official Name: {country.name.official}</li>
      <li>Capiital : {country.capital}</li>
      <li>Population: {country.population}</li>
    
    </div>
  );
};

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [isShowed, setIsShowed] = useState(Array(10).fill(0));

  const getAllCountries = () => {
    getCountries().then((allCountries) => {
      setCountries(allCountries);
    });
  };

  useEffect(getAllCountries, []);

  const filteredCountries = countries.filter((c) => {
    return c.name.common.toLowerCase().includes(search.toLowerCase());
  });

  const handleChange = (e) => {
    setSearch(e.target.value);
    setIsShowed(Array(10).fill(0));
  };

  const handleClick = (i) => () => {
    const newShowed = isShowed.map((v, k) => (k == i ? 1 : v));
    setIsShowed(newShowed);
  };

  return (
    <div>
      <b>Search Country</b>
      <input type="text" value={search} onChange={handleChange} style={{
        width: '100%',
        height: '25px',
        marginBottom: '20px',
        border: '4px solid',
        borderColor: '#7AA2F7',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      }} />
      <Countries
        countries={filteredCountries}
        isShowed={isShowed}
        handleClick={handleClick}
      />
    </div>
  );
};

export default App;
