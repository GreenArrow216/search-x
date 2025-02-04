import { useState, useEffect, useRef } from "react";
import { DataType } from "../../utils/fakeDb";

import "./SearchBar.scss";
import { useLocation, useNavigate } from "react-router";
import SearchIcon from "../icons/SearchIcon";
import TrashIcon from "../icons/TrashIcon";
import HistoryIcon from "../icons/HistoryIcon";
import { HISTORY_ITEMS, SitesAPI } from "../../utils/constants";
import useLazyFetch from "../../hooks/useLazyFetch";
import GlobeIcon from "../icons/GlobeIcon";

const SearchBar = ({
  defaultQuery = "",
  updateQuery,
  sites = [],
}: {
  defaultQuery?: string;
  updateQuery?: (arg: string) => void;
  sites?: DataType[];
}) => {
  const historyItems = JSON.parse(localStorage.getItem(HISTORY_ITEMS) ?? "[]");
  const searchBarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  //USESTATES
  const [query, setQuery] = useState<string>(defaultQuery); // update the input seach
  const [dbData, setDBData] = useState<DataType[]>(); // get the data from api
  const [suggestions, setSuggestions] = useState<DataType[]>([]); // update the suggestions as we type
  const [searchHistory, setSearchHistory] = useState<number[]>(historyItems); // update the search history once user enters or clicked
  const [activeIndex, setActiveIndex] = useState<number>(-1); // to navigate through the suggestions
  const [isFocused, setIsFocused] = useState<boolean>(false); // to manually handle the focus to show and hide autocomplete div

  const { data: dbDataFromAPI, trigger } = useLazyFetch(SitesAPI); // used lazy fetch to trigger conditionally

  // USEEFFECTS
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!location.pathname.includes("search")) {
      // only trigger and focus when in search page
      document.getElementById("searchInput")?.focus();
      trigger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // useEffect to manage the sites from parent component
    if (location.pathname.includes("search")) {
      setDBData(sites);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sites]);

  useEffect(() => {
    // useEffect to update dbData from api if it is triggered
    const fakeDb: DataType[] = dbDataFromAPI ?? [];
    setDBData(fakeDb);
  }, [dbDataFromAPI]);

  useEffect(() => {
    // useEffect to update the suggestions when query is changed
    filterQueriedFromDB({ value: query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    // useEffect to update the searchHistory when the item has been clicked
    localStorage.setItem(HISTORY_ITEMS, JSON.stringify(searchHistory));
  }, [searchHistory]);

  const clickedOnTypedQuery = () => {
    if (query.includes("http")) {
      window.location.href = query;
    } else {
      navigate(`/search?q=${query}`);
      if (updateQuery) {
        updateQuery(query);
      }
    }
    focusOutInput();
  };

  const clickedOnSuggestions = (index: number) => {
    const selectedSuggestion = suggestions[index - 1];
    console.log({ selectedSuggestion, index });
    if (selectedSuggestion) {
      if (!searchHistory.includes(selectedSuggestion.id)) {
        const newHistory = [...searchHistory, selectedSuggestion.id];
        setSearchHistory(newHistory);
      }
      if (updateQuery) {
        updateQuery(selectedSuggestion.title);
      }
      setQuery(selectedSuggestion.title);
      navigate(`/search?q=${selectedSuggestion.title}`);
    }
    focusOutInput();
  };

  const focusOutInput = () => {
    setIsFocused(false); // manually handling the focus and blur
    document.getElementById("searchInput")?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!suggestionsPresent && query.trim() === "") return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prevIndex) => (prevIndex + 1) % (suggestions.length + 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prevIndex) =>
        prevIndex === 0 ? suggestions.length : prevIndex - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex === 0) {
        // Enter pressed on the query itself
        clickedOnTypedQuery();
      } else if (activeIndex > 0) {
        // Enter pressed on a suggestion
        clickedOnSuggestions(activeIndex);
      }
    }
  };

  const filterQueriedFromDB = ({ value = query }: { value?: string }) => {
    const matches = dbData?.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matches?.slice(0, 10) ?? []);
  };

  const removeFromHistory = (id: number) => {
    const newHistory = searchHistory.filter((historyId) => historyId !== id);
    setSearchHistory(newHistory);
  };

  const onSuggestionClick = (index: number) => {
    if (index === 0) {
      clickedOnTypedQuery();
    } else {
      clickedOnSuggestions(index);
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

  const returnIcon = (item: DataType | { id: number; title: string; }) => {
    if (item.title.includes("http")) {
      return <GlobeIcon color={"#868686"} boxSize={20} />;
    } else if (isAlreadySearched(item.id)) {
      return <HistoryIcon color="#868686" boxSize={20} />;
    } else {
      return <SearchIcon color={"#868686"} boxSize={20} />;
    }
  };

  const suggestionsPresent = query.length > 0;
  const showSuggestions = isFocused && suggestionsPresent;

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
          onChange={(e) => {
            setActiveIndex(0);
            setQuery(e.target.value);
          }}
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
          {[{ id: -1, title: query }, ...suggestions].map((item, index) => (
            <div
              key={item.id}
              className={`autocomplete-item ${
                index === activeIndex ? "active" : ""
              } ${isAlreadySearched(item.id) ? "history" : ""}`}
            >
              <div>
                {returnIcon(item)}
                <p onMouseDown={() => onSuggestionClick(index)}>{item.title}</p>
              </div>
              {isAlreadySearched(item.id) && item.id !== -1 && (
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
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
