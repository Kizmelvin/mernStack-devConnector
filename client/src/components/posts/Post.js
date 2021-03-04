import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { getPosts } from "../../actions/post";
import Spinner from "../layouts/spinner";
import { connect } from "react-redux";
import PostItem from "./PostItem";
import PostForm from "./PostForm";

function Posts({ getPosts, post: { posts, loading } }) {
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <PostForm />
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </Fragment>
  );
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
