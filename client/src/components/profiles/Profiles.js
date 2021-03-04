import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile";
import Spinner from "../layouts/spinner";
import ProfileItem from "./ProfileItem";

function Profiles({ getProfiles, profile: { profiles, loading } }) {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Browse and connect to
            Developers
          </p>
          {profiles.length > -1 ? (
            profiles.map((profile) => (
              <div className="profile">
                <ProfileItem key={profile._id} profile={profile} />
              </div>
            ))
          ) : (
            <h4> No Developer profile found </h4>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
