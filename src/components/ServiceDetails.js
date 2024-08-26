/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ServiceDetails.css";

const ServiceDetails = ({ fields, service }) => {
  const [details, setDetails] = useState(null);
  const [averageDelay, setAverageDelay] = useState(null);

  // To format time values returned from the API
  const formatTime = (timeString) => {
    const hours = timeString.slice(0, 2);
    const minutes = timeString.slice(2);
    return `${hours}:${minutes}`;
  };

  const fetchAverageDelay = async () => {
    const currentDate = new Date();

    // Fetch delay for the previous 5 days
    const delayPromises = Array.from({ length: 5 }, (_, index) => {
      const date = new Date();
      date.setDate(currentDate.getDate() - index - 1); // Subtract index days
      const formattedDate = `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`;

      const id = service.serviceUid;
      const pathParams = `${id}/${formattedDate}`;

      console.log(`Sending request for average delay on ${formattedDate}`);

      return axios
        .get(
          `http://localhost:3001/api/external-data/get-details?pathParams=${pathParams}`,
        )
        .then((response) => {
          if (
            response.status === 404 ||
            response.data.error === "No schedule found"
          ) {
            console.log("Service didn't run on this day");
            return null;
          }
          return response;
        })
        .catch((error) => {
          console.error(`Error fetching data for ${formattedDate}:`, error);
          return null;
        });
    });

    try {
      const responses = await Promise.all(delayPromises);

      console.log("Received responses: ", responses);

      // Filter out responses where the service didn't run on a given day
      const validResponses = responses.filter((response) => {
        if (response === null) {
          console.log("Service didn't run on this day");
          return false;
        }
        return true;
      });

      const delays = validResponses.map((response) => {
        const destinationLocation = response.data.locations?.find(
          (location) => location.crs === fields.destination_station,
        );

        return destinationLocation?.realtimeGbttArrivalLateness || 0;
      });

      // Calculate average delay
      const avgDelay =
        delays.length > 0
          ? delays.reduce((sum, delay) => sum + delay, 0) / delays.length
          : 0;

      setAverageDelay(Math.round(avgDelay));
      console.log("Average Delay (Last 5 Days):", avgDelay);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchServiceDetails = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate().toString().padStart(2, "0");

      const date = `${year}/${month}/${day}`;
      const id = service.serviceUid;

      const pathParams = `${id}/${date}`;

      console.log("Sending request for service details");

      axios
        .get(
          `http://localhost:3001/api/external-data/get-details?pathParams=${pathParams}`,
        )
        .then((response) => {
          console.log("Received response for service details:", response.data);
          setDetails(response.data);
          fetchAverageDelay();
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchServiceDetails();
  }, [service]);

  if (!details) {
    return null;
  }

  const destinationDescription = fields.destination_station;
  const destinationLocation = details.locations.find(
    (location) => location.crs === destinationDescription,
  );

  const {
    realtimeArrival,
    realtimeGbttArrivalLateness,
    realtimeArrivalActual,
    gbttBookedArrival,
  } = destinationLocation;

  let status;

  if (realtimeArrivalActual === false) {
    status = `Has not arrived yet`;
  } else if (realtimeArrival) {
    if (realtimeGbttArrivalLateness !== undefined) {
      const lateness = realtimeGbttArrivalLateness;
      const arrivalTime = formatTime(realtimeArrival);

      if (lateness === 0) {
        status = "On Time";
      } else {
        const latenessText =
          Math.abs(lateness) === 1
            ? `${Math.abs(lateness)} minute`
            : `${Math.abs(lateness)} minutes`;

        if (lateness < 0) {
          status = `Actual Arrival: ${arrivalTime} (${latenessText} early)`;
        } else {
          status = `Actual Arrival: ${arrivalTime} (${latenessText} late)`;
        }
      }
    } else {
      status = "On Time";
    }
  } else {
    status = "I'm not quite sure what happened to this train!";
  }

  return (
    <div className="service-details-container">
      <ul className="service-details">
        <li>Service operated by {details.atocName}</li>
        <li>Timetabled Arrival: {formatTime(gbttBookedArrival)}</li>
        <li>{status}</li>
        {averageDelay !== null && (
          <li>Average Delay (Last 5 Days): {averageDelay} minutes</li>
        )}
      </ul>
    </div>
  );
};

export default ServiceDetails;
