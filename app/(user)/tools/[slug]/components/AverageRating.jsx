import { generateFormData } from "@/lib/utils";
import Rating from "./Rating";
import { format } from "date-fns";

export default function AverageRating({ averageRating, ratings_distribution, rating_count }) {
  const ratings = Object.keys(ratings_distribution);
  return (
    <div className="flex flex-col gap-5 mt-5">
      <h3 className="font-bold text-xl">Reviews</h3>
      <div className="flex justify-start items-start">
        <Rating averageRating={averageRating} />
        <p className="font-bold">({averageRating || "0.00"})</p>
      </div>
      <div className="w-full">
        {ratings.map((rating) => (
          <div
            key={rating}
            className="flex justify-start gap-2 items-center w-full"
          >
            <p className="font-semibold">{rating}</p>
            <p className="star text-yellow-500 text-2xl">&#9733;</p>

            <div className="flex items-center w-3/4 bg-gray-300 h-2 rounded">
              <div
                className="h-full bg-odtheme rounded w-full"
                style={{ width: `${ratings_distribution[rating]}%` }}
              ></div>
            </div>
            <span className="ml-2 text-xs font-semibold">
              {`${ratings_distribution[rating]}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
