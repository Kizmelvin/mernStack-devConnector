import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

function ProfileEducation({
  education: {
    school,
    degree,
    location,
    fieldofstudy,
    current,
    from,
    to,
    description,
  },
}) {
  return (
    <div>
      <h3 class="text-dark">
        {school}, {location && <span>{location}</span>}
      </h3>
      <p>
        {" "}
        <Moment format="DD/MM/YY">{from}</Moment> -{" "}
        {!to && current ? "Now" : <Moment format="DD/MM/YY">{to}</Moment>}{" "}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field of study: </strong>
        {fieldofstudy}
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

ProfileEducation.propTypes = {
  education: PropTypes.array.isRequired,
};

export default ProfileEducation;
