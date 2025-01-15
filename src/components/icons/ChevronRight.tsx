const ChevronRight = ({
  color = "#000",
  boxSize = 24,
}: {
  color?: string;
  boxSize?: number;
}) => {
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
      className="feather feather-chevron-right"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
};

export default ChevronRight;
