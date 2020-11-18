import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ACTIONS = ["View", "Reply"];

const formatAsCurrency = (int) => {
  const formattedResult = int.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formattedResult;
};

const Listing = (props) => {
  const { content } = props;
  const handleActionOnClick = (action, title) => {
    console.log(`${action}: ${title}`);
  };
  const listingPrice =
    typeof content.price === "number"
      ? formatAsCurrency(content.price)
      : content.price;
  return (
    <div className="listing">
      <h4 className="listing__title">{content.title}</h4>
      <div className="listing__price_loc_container">
        <p className="listing__price">{listingPrice}</p>
        <p className="listing__location">{content.location}</p>
      </div>
      {content.imgUrl && (
        <img
          className="listing__image"
          src={content.imgUrl}
          width="100%"
          height="200px"
          alt={`car-image-${content.title}`}
        />
      )}
      <p className="listing__desc">{content.description}</p>
      {ACTIONS.map((action, index) => (
        <button
          key={`${index}-${action}`}
          className="action"
          aria-label={`action-${action}`}
          onClick={() => handleActionOnClick(action, content.title)}
        >
          {action}
        </button>
      ))}
    </div>
  );
};

Listing.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    imgUrl: PropTypes.string,
  }),
};

const Listings = ({ keyword, location, dataEndpoint }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [listingsData, setListingsData] = useState([]);

  useEffect(() => {
    fetch(dataEndpoint)
      .then((response) => response.json())
      .then((data) => {
        setListingsData([...data]);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
    return () => {
      console.info("clean up Listings component");
    };
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Something went wrong. Please try again!</p>;
  }
  if (!listingsData || listingsData.length < 1) {
    return <p>No data available. Try again later!</p>;
  }
  return (
    <div className="listings">
      <div className="listings__header">
        <h3 className="listings__header_title">Search Results</h3>
        <p className="listings__header_subtitle">
          <span>{listingsData.length} results</span> for <span>{keyword}</span>
          &nbsp;in&nbsp;
          <span>{location}</span>
        </p>
      </div>
      <hr className="listings__horizontal_line" />
      <div className="listings__grid">
        {listingsData.map((listing, index) => (
          <Listing key={`${index}-${listing.title}`} content={listing} />
        ))}
      </div>
    </div>
  );
};

Listings.propTypes = {
  keyword: PropTypes.string.isRequired,
  location: PropTypes.string,
  dataEndpoint: PropTypes.string,
};

export default Listings;
