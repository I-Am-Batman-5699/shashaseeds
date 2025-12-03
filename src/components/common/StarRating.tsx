"use client";

const StarRating = ({ rating }: { rating: number }) => {
  const floorRating = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  const StarIcon = ({ filled, half }: { filled?: boolean, half?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" opacity={filled || half ? "1" : "0.3"}>
      <path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z" />
      {half && <path d="M11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792V14.6564Z" fill="white" />}
    </svg>
  );

  return (
    <div className="flex items-center text-yellow-500">
      {Array.from({ length: floorRating }).map((_, index) => <StarIcon key={`filled-${index}`} filled />)}
      {hasHalfStar && <StarIcon key="half" half />}
      {Array.from({ length: emptyStars }).map((_, index) => <StarIcon key={`empty-${index}`} />)}
    </div>
  );
};

export default StarRating;