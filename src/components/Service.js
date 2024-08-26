import React, { useState } from "react";
import "../styles/Service.css";
import ServiceDetails from "./ServiceDetails";

const Service = ({ service, fields }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const handleToggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  function formatTime(timeString) {
    const hours = timeString.slice(0, 2);
    const minutes = timeString.slice(2);
    return `${hours}:${minutes}`;
  }

  return (
    <div className="service-container">
      <ul className="service-information">
        <li>
          Departs {service.locationDetail.description}:{" "}
          {formatTime(service.locationDetail.gbttBookedDeparture)} (Platform{" "}
          {service.locationDetail.platform})
        </li>
        <li>
          <button type="button" onClick={handleToggleDetails}>
            {detailsVisible ? "Hide Details" : "View Details"}
          </button>
        </li>
      </ul>
      {detailsVisible && <ServiceDetails service={service} fields={fields} />}
    </div>
  );
};

export default Service;
