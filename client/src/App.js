import React, { useEffect, useState } from "react";
import axios from "axios";
import Autocomplete from "react-google-autocomplete";
import "./App.css";

const MAP_API_KEY = '';

function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function App() {
  const [data, setData] = useState(null);
  const [gMapData, setGMapData] = useState()
  const [bgColor, setBgColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#FFA500');


  const getAddresses = () => {
    let addressObj = {}
    gMapData?.address_components?.forEach((item) => {
      if (item?.types?.includes('sublocality')) {
        addressObj.city = item.short_name
      }
      if (item?.types?.includes('administrative_area_level_1')) {
        addressObj.state = item.short_name
      }
      if (item?.types?.includes('country')) {
        addressObj.country = item.short_name
      }
    })
    return addressObj
  }

  const name = 'gMapData.'
  const address = gMapData?.formatted_address
  const addressTypes = getAddresses();
  const fullData = {
    name,
    address,
    ...addressTypes
  }

  const styles = {
    titleStyle: { fontSize: 16, padding: 10 },
    textStyle: { fontSize: 15, padding: 10 },
    inputBox: { padding: 5, borderRadius: 100, width: '50%', marginTop: 10, backgroundColor: '#DFDFDF' },
    fullWidth: { width: '100%' },
  }

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => setData(err));
  }, []);

  useEffect(() => {
    if (!MAP_API_KEY) alert('Enter your MAP_API_KEY to proceed')
  }, [])
  


  const locationHandle = async (place_id) => {
    // const place_id = 'ChIJa2YT-ahZwokR-FABvLXcKi0'
    if (place_id) {
      try {
        await axios
          .get(
            "https://maps.googleapis.com/maps/api/geocode/json?place_id=" +
            place_id +
            `&key=${MAP_API_KEY}`
          )
          .then((response) => {
            setGMapData(response?.data?.results[0])
          });
      }
      catch (err) {
        console.log("error-->", err);
      }
    } else {
      setGMapData(null)
    }
  };

  const processChange = debounce((e) => {
    locationHandle(e)});
  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`The details are: ${JSON.stringify(fullData)}`)
  }
  return (
    <div className="App">
      <div className="App-left">
        <div style={{ flex: 4, display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
          <div style={{ width: '100%', flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 15 }}>Search Place</span>
            <Autocomplete
              apiKey={MAP_API_KEY}
              options={{
                types: ["establishment"],
              }}
              style={{ borderRadius: 20, marginTop: 10, width: '50%', height: 30, paddingLeft: 10 }}
              onPlaceSelected={(place) => {
                processChange(place.place_id);
              }}
            />
            {/* <input onKeyUp={processChange} style={{ borderRadius: 20, marginTop: 10, width: '50%', height: 30, paddingLeft: 10 }} /> */}
          </div>
          {gMapData ? (
            <>
              <table style={{ marginTop: 20, marginBottom: 10 }} border={'2px solid white'}>
                <tr>
                  <th style={styles.titleStyle}>Name</th>
                  <th style={styles.titleStyle}>Address</th>
                  <th style={styles.titleStyle}>City</th>
                  <th style={styles.titleStyle}>State</th>
                  <th style={styles.titleStyle}>Country</th>
                </tr>
                <tr>
                  <td style={styles.textStyle}>{name}</td>
                  <td style={styles.textStyle}>{address}</td>
                  <td style={styles.textStyle}>{addressTypes.city}</td>
                  <td style={styles.textStyle}>{addressTypes.state}</td>
                  <td style={styles.textStyle}>{addressTypes.country}</td>
                </tr>
              </table>
              <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                <input type="text" placeholder="Name"
                  value={name} style={styles.inputBox} />
                <input type="text" placeholder="Address"
                  value={address} style={styles.inputBox} />
                <input type="text" placeholder="City"
                  value={addressTypes.city} style={styles.inputBox} />
                <input type="text" placeholder="State"
                  value={addressTypes.state} style={styles.inputBox} />
                <input type="text" placeholder="Country"
                  value={addressTypes.country} style={{ ...styles.inputBox, ...styles.fullWidth }} />
                <input type="submit"
                  value={'Fetch Yelp Data From Backend'}
                  style={{ ...styles.inputBox, ...styles.fullWidth, backgroundColor: 'transparent', borderWidth: 1, borderColor: 'white', color: 'white' }} />
              </form>
            </>
          ) : null}
        </div>
        <p style={{ fontSize: 15, alignSelf: 'flex-start', padding: 10 }}>Server Console</p>
        <div style={{ width: '100%', height: '100%', flex: 3, display: 'flex', paddingLeft: 10, paddingRight: 10 }}>
          <p style={{
            fontSize: 15,
            border: '1px solid grey',
            minHeight: '100%',
            padding: 20, color: 'grey', borderRadius: 10, width: '100%'
          }}>{!data ? "Loading..." : data}</p>
        </div>
      </div>

      <div className="App-right" style={{ backgroundColor: bgColor, position: 'relative' }}>
        <div style={{ width: '100%', flex: 1, padding: 20, }}>
          <div style={{ display: 'flex', paddingTop: 10, paddingBottom: 10, justifyContent: 'space-between' }}>
            <p style={{ fontSize: 20, }}>Console Results</p>
            <div>
              <input
                type="color"
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                style={{ width: 30, height: 30, borderRadius: 20, marginRight: 10 }} />
              <input
                type="color"
                value={textColor}
                onChange={e => setTextColor(e.target.value)}
                style={{ width: 30, height: 30, borderRadius: 20 }} />
            </div>
          </div>
          <p style={{
            fontSize: 15,
            border: '1px solid white',
            height: '100%',
            padding: 20, color: textColor, borderRadius: 10, width: '100%',
          }}>
            {JSON.stringify(gMapData)}
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;