import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

function ProfileExperience({
  experience: { location, company, current, from, to, title, description },
}) {
  return (
    <div>
      <h3 class="text-dark">
        {company}, {location && <span>{location}</span>}
      </h3>
      <p>
        {" "}
        <Moment format="DD/MM/YY">{from}</Moment> -{" "}
        {!to && current ? "Now" : <Moment format="DD/MM/YY">{to}</Moment>}{" "}
      </p>
      <p>
        <strong>Position: </strong>
        {title}
      </p>
      {description && (
        <p>
          {" "}
          <strong>Description: </strong> {description}
        </p>
      )}
    </div>
  );
}

ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired,
};

export default ProfileExperience;
