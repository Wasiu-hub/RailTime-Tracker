/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { React, useState } from "react";
import "../styles/App.css";
import JourneySearchForm from "./JourneySearchForm";
import SearchResults from "./SearchResults";
import Landing from "./Landing";
import Error from "./Error";

const App = () => {
  const [fields, setFields] = useState({
    origin_station: "MAN",
    destination_station: "LIV",
    time: "13:00",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const handleSearchResults = (results) => {
    setSearchResults(results || []);
    setInitialLoad(false);
  };

  const handleHeaderClick = () => {
    setInitialLoad(true);
  };

  let contentComponent;

  if (initialLoad) {
    contentComponent = <Landing />;
  } else if (searchResults.length === 0) {
    contentComponent = <Error />;
  } else {
    contentComponent = (
      <SearchResults services={searchResults} fields={fields} />
    );
  }

  return (
    <div className="App">
      <div className="header">
        <h1 onClick={handleHeaderClick} style={{ cursor: "pointer" }}>
          RailTime Tracker
        </h1>
        <JourneySearchForm
          fields={fields}
          setFields={setFields}
          setSearchResults={handleSearchResults}
        />
      </div>
      {contentComponent}
    </div>
  );
};

export default App;
