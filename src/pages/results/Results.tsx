import { useSearchParams } from "react-router";
import { DataType } from "../../utils/fakeDb";
import SearchBar from "../../components/searchBar/SearchBar";
import { useEffect, useState } from "react";
import "./Results.scss";
import useGetData from "../../hooks/useGetData";
import { SitesAPI } from "../../utils/constants";

const Results = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [searchBarQuery, setSearchBarQuery] = useState<string>(query);
  const [results, setResults] = useState<DataType[]>();
  const [loadingTime, setLoadingTime] = useState(0);

  const { data } = useGetData(SitesAPI);
  const fakeDB: DataType[] = data ?? [];

  useEffect(() => {
    const startTime = performance.now();
    const results = searchBarQuery
      ? fakeDB.filter((item) =>
          item.title.toLowerCase().startsWith(searchBarQuery.toLowerCase())
        )
      : [];
    setResults(results);
    const endTime = performance.now();
    setLoadingTime(endTime - startTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBarQuery, data]);

  const updateQuery = (query: string) => {
    setSearchBarQuery(query);
  };

  return (
    <div className="results-page">
      <div className="search-wrapper">
        <h2>Search X</h2>

        <SearchBar
          defaultQuery={searchBarQuery ?? ""}
          updateQuery={updateQuery}
        />
      </div>
      <div className="results-wrapper">
        <div className="search-results">
          <p className="metadata">
            {results?.length} results ({loadingTime.toFixed(2)} ms)
          </p>
          <div className="results">
            {results?.map((item) => (
              <div key={item.id} className="result-item">
                <div>
                  <div className="details">
                    <div className="logo">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div>
                      <p className="site">{item.site}</p>
                      <p className="url">{item.url}</p>
                    </div>
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                  <p className="desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
