import { useSearchParams } from "react-router";
import { fakeDB } from "../../utils/fakeDb";

const Results = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const startTime = performance.now();
  const results = query
    ? fakeDB.filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase())
      )
    : [];
  const endTime = performance.now();

  return (
    <div className="search-results">
      <p>
        {results.length} results found in {(endTime - startTime).toFixed(2)} ms
      </p>
      <ul>
        {results.map((item) => (
          <li key={item.id}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
