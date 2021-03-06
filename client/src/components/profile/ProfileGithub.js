import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getGitHubRepos } from "../../actions/profile";
import Spinner from "../layouts/spinner";

function ProfileGithub({ username, getGitHubRepos, repos }) {
  useEffect(() => {
    getGitHubRepos(username);
  }, [getGitHubRepos]);
  return (
    <div class="profile-github">
      <h2 class="text-primary my-1">
        <i class="fab fa-github"></i> Github Repos
      </h2>

      {repos === null ? (
        <Spinner />
      ) : (
        repos.map((repo) => (
          <div class="repo bg-white p-1 my-1">
            <div key={repo.id}>
              <h4>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
              </h4>
              {repo.description && <p>{repo.description}</p>}
            </div>
            <div>
              <ul>
                <li class="badge badge-primary">
                  Stars: {repo.stargazers_count}
                </li>
                <li class="badge badge-dark">
                  Watchers: {repo.watchers_count}
                </li>
                <li class="badge badge-light">Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

ProfileGithub.propTypes = {
  get: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  repos: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});
export default connect(mapStateToProps, { getGitHubRepos })(ProfileGithub);
