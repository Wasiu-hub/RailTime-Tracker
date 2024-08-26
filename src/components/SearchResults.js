import React from "react";
import Service from "./Service";
import "../styles/SearchResults.css";

const SearchResults = ({ services, fields }) => {
  if (services.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div className="search-results-container">
      <h2>Good news! We found the following journeys for you...</h2>
      {services.map((service) => (
        <Service key={service.serviceUid} service={service} fields={fields} />
      ))}
    </div>
  );
};

export default SearchResults;
