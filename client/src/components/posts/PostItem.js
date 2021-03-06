import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  showAction,
  post: { _id, name, avatar, text, likes, user, comments, date },
}) => {
  return (
    <div class="posts">
      <div class="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
            <img class="round-img" src={avatar} alt="" />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p class="my-1">{text}</p>
          <p class="post-date">
            Posted on <Moment format="DD/MM/YYYY">{date}</Moment>{" "}
          </p>
          {showAction && (
            <Fragment>
              <button
                type="button"
                class="btn btn-light"
                onClick={(e) => addLike(_id)}
              >
                <i class="fas fa-thumbs-up"></i>

                {likes.length > 0 && (
                  <span>
                    {""} {likes.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                class="btn btn-light"
                onClick={(e) => removeLike(_id)}
              >
                <i class="fas fa-thumbs-down"></i>
              </button>
              <Link to={`/${_id}`} class="btn btn-primary">
                Discussion{" "}
                {comments.length > 0 && (
                  <span class="comment-count">{comments.length}</span>
                )}
              </Link>
              {auth.isAuthenticated && auth.user._id === user && (
                <button
                  onClick={(e) => deletePost(_id)}
                  type="button"
                  class="btn btn-danger"
                >
                  <i class="fas fa-times"></i>
                </button>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};
PostItem.defaultProps = {
  showAction: true,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
