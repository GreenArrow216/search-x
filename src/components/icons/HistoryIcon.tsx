const HistoryIcon = ({ color = "#000", boxSize=24 }: { color?: string, boxSize?: number }) => {
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
      className="feather feather-clock"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
};

export default HistoryIcon;
