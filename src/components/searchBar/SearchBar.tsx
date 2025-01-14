import { useState, useEffect, useRef } from "react";
import { DataType, fakeDB } from "../../utils/fakeDb";

import "./SearchBar.scss";
import { useLocation, useNavigate } from "react-router";
import SearchIcon from "../icons/SearchIcon";
import TrashIcon from "../icons/TrashIcon";
import HistoryIcon from "../icons/HistoryIcon";
import { HISTORY_ITEMS } from "../../utils/constants";

const SearchBar = ({
  defaultQuery = "",
  updateQuery,
}: {
  defaultQuery?: string;
  updateQuery?: (arg: string) => void;
}) => {
  const historyItems = JSON.parse(localStorage.getItem(HISTORY_ITEMS) ?? "[]");
  const searchBarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState<string>(defaultQuery);
  const [suggestions, setSuggestions] = useState<DataType[]>([]);
  const [searchHistory, setSearchHistory] = useState<number[]>(historyItems);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!location.pathname.includes("search")) {
      document.getElementById("searchInput")?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterQueriedFromDB({ value: query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    localStorage.setItem(HISTORY_ITEMS, JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      setIsFocused(false);
      document.getElementById("searchInput")?.blur();
      if (activeIndex === -1) {
        navigate(`/search?q=${query}`);
        if (updateQuery) {
          updateQuery(query);
        }
      } else if (activeIndex > -1) {
        if (!searchHistory.includes(suggestions[activeIndex].id)) {
          const newHistory = [...searchHistory, suggestions[activeIndex]?.id];
          setSearchHistory(newHistory);
        }
        if (updateQuery) {
          updateQuery(suggestions[activeIndex].title);
        }
        setQuery(suggestions[activeIndex].title);
        navigate(`/search?q=${suggestions[activeIndex].title}`);
      }
    }
  };

  const filterQueriedFromDB = ({ value = query }: { value?: string }) => {
    const matches = fakeDB.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matches.slice(0, 10));
  };

  const removeFromHistory = (id: number) => {
    const newHistory = searchHistory.filter((historyId) => historyId !== id);
    setSearchHistory(newHistory);
  };

  const onSuggestionClick = (id: number) => {
    const item = fakeDB.find((db) => db.id === id);
    if (item?.id && !searchHistory.includes(item.id)) {
      const newHistory = [...searchHistory, item?.id];
      setSearchHistory(newHistory);
    }
    if (item) {
      navigate(`/search?q=${item.title}`);
      document.getElementById("searchInput")?.blur();
      if (updateQuery) {
        updateQuery(item.title);
      }
    } else {
      console.log("url not found in the db");
    }
  };

  const isAlreadySearched = (id: number) => {
    return searchHistory.includes(id);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(e.target as Node)
    ) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const suggestionsPresent = suggestions.length > 0 && query.length > 0;
  const showSuggestions = isFocused && suggestionsPresent;

  console.log({
    showSuggestions,
    isFocused,
    suggestionsPresent,
    suggestions,
    query,
  });

  return (
    <div className="search-bar" ref={searchBarRef}>
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
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          onFocus={() => {
            setIsFocused(true);
            if (query) {
              filterQueriedFromDB({ value: query });
            }
          }}
        />
      </div>
      <div className={`autocomplete ${showSuggestions ? "show" : "hide"}`}>
        <div>
          {suggestions.map((item, index) => (
            <div
              key={item.id}
              className={`autocomplete-item ${
                index === activeIndex ? "active" : ""
              } ${isAlreadySearched(item.id) ? "history" : ""}`}
            >
              <div>
                {isAlreadySearched(item.id) ? (
                  <HistoryIcon color="#868686" boxSize={20} />
                ) : (
                  <SearchIcon color={"#868686"} boxSize={20} />
                )}
                <p onMouseDown={() => onSuggestionClick(item.id)}>
                  {item.title}
                </p>
              </div>
              {isAlreadySearched(item.id) && (
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsFocused(true);
                    removeFromHistory(item.id);
                  }}
                  className={"delete-btn"}
                >
                  <TrashIcon color="red" boxSize={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
