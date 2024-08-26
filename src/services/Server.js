/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require("dotenv");
const path = require("path");

const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// API call to fetch the the list of services based on user search
app.get("/api/external-data/get-services", (req, res) => {
  const { pathParams } = req.query;
  const apiURL = `http://api.rtt.io/api/v1/json/search/${pathParams}`;

  axios
    .get(apiURL, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
        ).toString("base64")}`,
      },
    })
    .then((response) => {
      const responseData = response.data;
      res.json(responseData);
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
      res.status(500).json({ error: "Error Fetching Data" });
    });
});

// API call to get more detailed information relating to a particular service
app.get("/api/external-data/get-details", (req, res) => {
  const { pathParams } = req.query;
  const apiURL = `http://api.rtt.io/api/v1/json/service/${pathParams}`;

  axios
    .get(apiURL, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
        ).toString("base64")}`,
      },
    })
    .then((response) => {
      const responseData = response.data;
      res.json(responseData);
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
      res.status(500).json({ error: "Error Fetching Data" });
    });
});

app.listen(3001, () => {
  console.log("Proxy server is running on port 3001");
});
