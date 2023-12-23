import React, { useState, useEffect } from "react";
import styles from "./Select.module.css";

const Select = () => {
  const [data, setData] = useState({
    countries: [],
    states: [],
    cities: [],
  });
  const [selected, setSelected] = useState({
    country: null,
    state: null,
    city: null,
  });

  console.log(selected);
  const handleChange = (e) => {
    setSelected((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        "https://crio-location-selector.onrender.com/countries"
      );
      const data = await response.json();
      setData((prev) => ({ ...prev, countries: data }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStates = async (country) => {
    try {
      const response = await fetch(
        `https://crio-location-selector.onrender.com/country=${country}/states`
      );
      const data = await response.json();
      setData((prev) => ({ ...prev, states: data }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCities = async (country, state) => {
    try {
      const response = await fetch(
        `https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`
      );
      const data = await response.json();
      setData((prev) => ({ ...prev, cities: data }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selected.country) {
      fetchStates(selected.country);
      setData((prev) => ({ ...prev, cities: [] }));
      setSelected((prev) => ({ ...prev, state: null, city: null }));
    }
  }, [selected.country]);

  useEffect(() => {
    if (selected.country && selected.state) {
      fetchCities(selected.country, selected.state);
      setSelected((prev) => ({ ...prev, city: null }));
    }
  }, [selected.state]);

  return (
    <>
      <h1>Select Location</h1>
      <div className={styles.wrapper}>
        <select
          className={styles.dropdowns}
          value={selected.country}
          id="country"
          onChange={handleChange}
        >
          <option value="">Select Country</option>
          {data.countries.map((item) => {
            return (
              <option value={item} key={item}>
                {item}
              </option>
            );
          })}
        </select>

        <select
          className={styles.dropdowns}
          value={selected.state}
          id="state"
          onChange={handleChange}
          disabled={selected.country ? false : true}
        >
          <option value="">Select State</option>
          {data.states.map((item) => {
            return (
              <option value={item} key={item}>
                {item}
              </option>
            );
          })}
        </select>

        <select
          className={styles.dropdowns}
          value={selected.city}
          id="city"
          onChange={handleChange}
          disabled={selected.state ? false : true}
        >
          <option value="">Select City</option>
          {data.cities.map((item) => {
            return (
              <option value={item} key={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      {selected.country && selected.state && selected.city && (
        <h4>
          You selected <span style={{ fontSize: 24 }}>{selected.city}</span>,
          <span style={{ color: "#888" }}>
            {" "}
            {selected.state}, {selected.country}
          </span>
        </h4>
      )}
    </>
  );
};

export default Select;
