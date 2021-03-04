const express = require("express");
const User = require("../../models/User");
const request = require("request");
const config = require("config");
const Profile = require("../../models/Profile");
const auth = require("../../middleware/auth");
const { check, validationResult, body } = require("express-validator");
const { response } = require("express");
const Post = require("../../models/Post");

const router = express.Router();

// @ route Get api/profile/me
// @ desc
// @access private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "No profile found for this user" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
// @ route POST api/profile
// @ desc   Create or update user profile
// @access private

router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").notEmpty(),
      check("skills", "skills is required").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      skills,
      location,
      bio,
      status,
      githubusername,
      twitter,
      youtube,
      facebook,
      instagram,
      linkedin,
    } = req.body;
    // Build profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills.split(",").map((skill) => skill.trim());

    profileFields.social = {};
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (youtube) profileFields.social.youtube = youtube;
    if (linkedin) profileFields.social.linkedin = youtube;
    if (facebook) profileFields.social.facebook = facebook;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //   update
        profile = await Profile.findOneAndUpdate(
          {
            user: req.user.id,
          },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //   create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);
// @ route GET api/profile
// @ desc   Get all user profiles
// @access public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @ route GET api/profile/user/:user_id
// @ desc   Get user profile by user_id
// @access public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @ route Delete api/profile
// @ desc   Delete user
// @access public

router.delete("/", auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    // Delete Profile
    await Profile.findOneAndDelete({ user: req.user.id });
    // Delete User
    await User.findOneAndDelete({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// @ route PUT api/profile/experience
// @ desc   Add user profile experience
// @access private

router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required").notEmpty(),
    check("location", "Location is required").notEmpty(),
    check("company", "Company is required").notEmpty(),
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
      const {
        title,
        company,
        location,
        from,
        to,
        description,
        current,
      } = req.body;
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        description,
        current,
      };
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(400).send("Server Error");
    }
  }
);

// @ route DELETE api/profile/experience/:exp_id
// @ desc   Delete a user experience
// @access private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

// @ route PUT api/profile/education
// @ desc   Add user profile education
// @access private

router.put(
  "/education",
  [
    auth,
    check("school", "School is required").notEmpty(),
    check("degree", "Degree is required").notEmpty(),
    check("from", "From is required").notEmpty(),
    check("fieldofstudy", "Field of study is required").notEmpty(),
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        description,
        current,
      } = req.body;
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        description,
        current,
      };
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(400).send("Server Error");
    }
  }
);

// @ route DELETE api/profile/education/:edu_id
// @ desc   Delete a user education
// @access private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});
// @ route GET api/profile/github/github-username
// @ desc   Get user github repos
// @access public

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) console.error(error.message);
      if (response.statusCode !== 200) {
        return res.status(400).json({ msg: "No github profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send("Server Error");
  }
});

module.exports = router;
