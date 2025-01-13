import { useState, useEffect } from "react";
import { DataType, fakeDB } from "../../utils/fakeDb";

import "./SearchBar.scss";
import { useNavigate } from "react-router";
import SearchIcon from "../icons/SearchIcon";
import TrashIcon from "../icons/TrashIcon";
import HistoryIcon from "../icons/HistoryIcon";
import { HISTORY_ITEMS } from "../../utils/constants";

const SearchBar = () => {

  const historyItems = JSON.parse(localStorage.getItem(HISTORY_ITEMS) ?? '[]')

  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<DataType[]>([]);
  const [searchHistory, setSearchHistory] = useState<number[]>(historyItems);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("searchInput")?.focus();
  }, []);

  useEffect(() => {
    filterQueriedFromDB({ value: query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    localStorage.setItem(HISTORY_ITEMS, JSON.stringify(searchHistory))
  }, [searchHistory])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
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

  const filterQueriedFromDB = ({ value = query }: { value?: string }) => {
    const matches = fakeDB.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matches.slice(0, 10));
  };

  const removeFromHistory = (id: number) => {
    const newHistory = searchHistory.filter((h) => h !== id)
    setSearchHistory(newHistory);
  };

  const onSuggestionClick = (id: number) => {
    const item = fakeDB.find((db) => db.id === id);
    if (item?.id && !searchHistory.includes(item.id)) {
      const newHistory = [...searchHistory, item?.id];
      setSearchHistory(newHistory);
    }
    if (item) {
      console.log('navigate')
      navigate(item.id);
    } else {
      console.log("url not found in the db");
    }
  };

  const isAlreadySearched = (id: number) => {
    return searchHistory.includes(id);
  };

  console.log({ searchHistory });

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
              filterQueriedFromDB({ value: query });
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
                } ${isAlreadySearched(item.id) ? "history" : ""}`}
                onClick={() => onSuggestionClick(item.id)}
              >
                <div>
                  {isAlreadySearched(item.id) ? (
                    <HistoryIcon color="#868686" boxSize={20} />
                  ) : (
                    <SearchIcon color={"#868686"} boxSize={20} />
                  )}
                  <p>{item.title}</p>
                </div>
                {isAlreadySearched(item.id) && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item.id);
                    }}
                  >
                    <TrashIcon color="red" boxSize={20} />
                  </div>
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
