import { useState, useEffect } from "react";
import { DataType, fakeDB } from "../../utils/fakeDb";

import "./SearchBar.scss";
import { useNavigate } from "react-router";
import SearchIcon from "../icons/SearchIcon";

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<DataType[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("searchInput")?.focus();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const matches = fakeDB.filter((item) =>
      item.title.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(matches.slice(0, 10));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      console.log("enter pressed");
    }
  };

  const filterQueriedFromDB = () => {
    const matches = fakeDB.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(matches.slice(0, 10));
  };

  const removeFromHistory = (item: string) => {
    setSearchHistory(searchHistory.filter((h) => h !== item));
  };

  const onSuggestionClick = (id: number) => {
    const item = fakeDB.find((db) => db.id === id);
    if (item) {
      navigate(item.title);
    } else {
      console.log("url not found in the db");
    }
  };

  const showSuggestions = suggestions.length > 0 && query.length > 0;

  return (
    <div className="search-bar">
      <div className={`search-container ${showSuggestions ? "focused" : ""}`}>
        <button className="search-button">
          <SearchIcon color={"#868686"} />
        </button>
        <input
          type="text"
          className="search-input"
          placeholder="Search Google or type a URL"
          id="searchInput"
          value={query}
          onChange={handleInput}
          onKeyDown={(e) => handleKeyDown(e)}
          // onBlur={() => setSuggestions([])}
          onFocus={() => {
            if (query) {
              filterQueriedFromDB();
            }
          }}
        />
      </div>
      {showSuggestions && (
        <div className="autocomplete">
          <div>
            {suggestions.map((item, index) => (
              <div
                key={item.id}
                className={`autocomplete-item ${
                  index === activeIndex ? "active" : ""
                } ${searchHistory.includes(item.title) ? "history" : ""}`}
                onClick={() => onSuggestionClick(item.id)}
              >
                <SearchIcon color={"#868686"} boxSize={20} />
                <p>{item.title}</p>
                {searchHistory.includes(item.title) && (
                  <button onClick={() => removeFromHistory(item.title)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
