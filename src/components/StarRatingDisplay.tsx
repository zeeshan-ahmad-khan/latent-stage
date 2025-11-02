import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarRatingDisplayProps {
  rating: number;
  size?: number;
  color?: string;
  emptyColor?: string;
}

const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({
  rating = 0,
  size = 20,
  color = "#f59e0b", // Yellow color
  emptyColor = "#DEE2E6",
}) => {
  const stars = [];

  // ✅ NEW LOGIC: Always round up to the nearest 0.5
  // 4.1 becomes 4.5, 4.6 becomes 5.0
  const displayRating = Math.ceil(rating * 2) / 2;

  const fullStars = Math.floor(displayRating);
  const hasHalfStar = displayRating % 1 !== 0;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} size={size} color={color} />);
  }

  // Add half star (if applicable)
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" size={size} color={color} />);
  }

  // Add empty stars
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} size={size} color={emptyColor} />);
  }

  return <div style={{ display: "flex" }}>{stars}</div>;
};

export default StarRatingDisplay;
