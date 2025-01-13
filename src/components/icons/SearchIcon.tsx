const SearchIcon = ({color='#000', boxSize=24}:{color?: string, boxSize?:number}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={boxSize}
      height={boxSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-search"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
};

export default SearchIcon
