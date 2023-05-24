import express from 'express';
import axios from 'axios';

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

const YELP_API_KEY = ''

app.get("/api", (req, res) => {
  if (YELP_API_KEY) {
    res.json({ message: `
    Ready to communicate
    1) Search Place in the input box
    2) select a place from the dropdown
    3) This will populate the details
    4) Press "Fetch Yelp Data From Backend" button
    5) The backend will use the data sent from the client to match a business in Yelp API
    6) If a business is found, then the backend will use the "id" of the business in the yelp response to make two other calls to fetch business details, images as well as the reviews of the business.
   `});
  } else {
    res.json({message: 'You need to add YELP_API_KEY in the backend for this to work'})
  }
});

app.post("/api/fetch-yelp", async (req, res) => {
  const { name, address, city, state, country } = req.body;

  const options = {
    method: 'GET',
    url: 'https://api.yelp.com/v3/businesses/matches',
    params: {
      name: name,
      address1: address,
      city: city,
      state: state,
      country: country,
      limit: '3',
      match_threshold: 'default'
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${YELP_API_KEY}`
    }
  };
  try {
    await axios
      .request(options)
      .then(async function (response) {
        console.log(response.data);
        const businessData = response?.data?.businesses[0]
        const businessId = businessData?.id

        const businessDetailsOptions = {
          method: 'GET',
          url: `https://api.yelp.com/v3/businesses/${businessId}`,
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${YELP_API_KEY}`
          }
        };

        const reviewOptions = {
          method: 'GET',
          url: `https://api.yelp.com/v3/businesses/${businessId}/reviews`,
          params: {limit: '5', sort_by: 'yelp_sort'},
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${YELP_API_KEY}`
          }
        };

        try {
          const [businessResponse, reviewsResponse] = await Promise.all([
            axios.request(businessDetailsOptions),
            axios.request(reviewOptions)
          ]);
      
          const businessData = businessResponse.data;
          const reviewsData = reviewsResponse.data;
      
          // Combine business details and reviews data
          const responseData = {
            businessData,
            reviewsData
          };
          res.json(responseData);
        } catch (error) {
          res.json(error);
        }
      })
      .catch(function (error) {
        res.json(error)
      });
  } catch (error) {
    res.json(error)
  }
  
  // res.json({ message: "Parameters received successfully", data :{name, address, city, state, country} })
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});