import { useNavigate, useSearchParams } from "react-router";
import { DataType } from "../../utils/fakeDb";
import SearchBar from "../../components/searchBar/SearchBar";
import { useEffect, useState } from "react";
import "./Results.scss";
import useGetData from "../../hooks/useGetData";
import { SitesAPI } from "../../utils/constants";
import ChevronLeft from "../../components/icons/ChevronLeft";
import ChevronRight from "../../components/icons/ChevronRight";
import SearchXLogo from "../../components/searchXLogo/SearchXLogo";

const Results = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [searchBarQuery, setSearchBarQuery] = useState<string>(query);
  const [results, setResults] = useState<DataType[]>();
  const [loadingTime, setLoadingTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate()

  const totalPages = Math.ceil((results?.length ?? 0) / itemsPerPage);

  const { data } = useGetData(SitesAPI);
  const fakeDB: DataType[] = data ?? [];
  
  useEffect(() => {
    const startTime = performance.now();
    const processData = async () => {
      const results = searchBarQuery
        ? fakeDB.filter((item) =>
            item.title.toLowerCase().startsWith(searchBarQuery.toLowerCase())
          )
        : [];
  
      const endTime = performance.now();
      setResults(results);
      setLoadingTime(endTime - startTime);  
    };
  
    processData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBarQuery, data]);

  const updateQuery = (query: string) => {
    setSearchBarQuery(query);
  };

  // Slice results for the current page
  const paginatedResults = results?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Navigate to the next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Navigate to the previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="results-page">
      <div className="search-wrapper">
        <h2 onClick={() => navigate('/')}>Search X</h2>
        <SearchBar
          defaultQuery={searchBarQuery ?? ""}
          updateQuery={updateQuery}
          sites={fakeDB}
        />
      </div>
      <div className="results-wrapper">
        <div className="search-results">
          <p className="metadata">
            {results?.length} results ({loadingTime.toFixed(2)} ms)
          </p>
          <div className="results">
            {paginatedResults?.map((item) => (
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
      <div className="pagination">
        <div
          className={`previous ${currentPage === 1 ? "hide" : "show"}`}
          onClick={goToPreviousPage}
        >
          <ChevronLeft color={"#4285f4"} boxSize={20} />
          <p>Previous</p>
        </div>
        <div className="logo-text">
          <SearchXLogo />
          <div>
            {Array.from({ length: totalPages }, (_, index) => (
              <span
                key={index + 1}
                className={`page-number ${
                  index + 1 === currentPage ? "active" : ""
                }`}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </div>
        <div
          className={`next ${currentPage === totalPages ? "hide" : "show"}`}
          onClick={goToNextPage}
        >
          <ChevronRight color={"#4285f4"} boxSize={20} />
          <p>Next</p>
        </div>
      </div>
    </div>
  );
};

export default Results;
