const express = require("express");
const router = express.Router();

const Competitions = require("../model/competitionSchema");
const Leaderboard = require("../model/leaderboardSchema");
const Team = require("../model/teamSchema");
const CompeteUser = require("../model/competeTeamSchema");
const authenticate = require("../middleware/authenticate");

router.route("/getCompete/:url").get(async (req, res) => {
  const { url } = req.params;
  const data = await Competitions.findOne({ url: url });
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(400).json();
  }
});

router.route("/isCompUrlExist/:url").get(async (req, res) => {
  const { url } = req.params;
  Competitions.findOne({ url: url }).then((data) => {
    return data
      ? res.status(404).send({ error: "Url Already Exist!" })
      : res.status(200).json();
  });
});

router.route("/addcompetitions").post(authenticate, async (req, res) => {
  const compete = new Competitions(req.body);
  compete
    .save()
    .then(async (competition) => {
      await Promise.all(
        competition.access.map(async (author) => {
          const team = await Team.findById(author);
          if (team) {
            team.competitionsAccess.push(compete._id);
            await team.save();
          }
        })
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  res.status(201).json({ message: "Competition Created Successfully" });
});

router.route('/updateCompetetion/:id').put(authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    console.log("serverSide Id",id, req.body);
    const updateddata = await Competitions.findByIdAndUpdate(id, req.body, {
      new: true
    });

    console.log('Competition Updated!');
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Somthing went wrong!" });
  }
})

router.route("/getCompeteNames").get(async (req, res) => {
  const data = await Competitions.find({ public: true });
  res.status(201).json(data);
});

router.route("/getDraftCompeteNames/:id").get(async (req, res) => {
  const { id } = req.params;
  const team = await Team.findById(id);
  let competitions = [];
  console.log(team.competitionsAccess);
  if (team) {
    await Promise.all(
      team.competitionsAccess.map(async (competition_id) => {
        const c = await Competitions.findOne({
          _id: competition_id,
          public: false,
        });
        console.log(c);
        if (c) {
          competitions.push(c);
        }
      })
    );
    res.status(201).json(competitions);
  }
});


// router.route("/isJoined/:url/:username").get(async (req, res) => {
//   const { url, username } = req.params;
//   let joined = false;
//   try {
//     const team = await Team.findOne({ username: username });
//     if (team) {
//       if (team.competitions.indexOf(url) > -1) {
//         joined = true;
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   return res.status(200).json(joined);
// });

// Join Competition

router.route("/joinCompete").post(async (req, res) => {
  try {
    if (req.body.password != req.body.cpassword) {
      return res.status(401).json({ error: "Passwords not matched!" });
    }
    const competeuser = new CompeteUser(req.body);
    await competeuser.save();
    const competition = await Competitions.findById(req.body.competition);
    competition.participantCount = competition.participantCount + 1;
    await competition.save()
    res.status(200).json({ message: "user registered Successfully" });
  } catch (err) {
    res.status(400).json({ error: "Internal server error" });
  }
});


router.route("/editOverview/:id").put(authenticate, async (req, res) => {
  const { id } = req.params;
  const { overview } = req.body;
  let compete = await Competitions.findById(id);
  compete.overview = overview;
  await compete.save();
  console.log(compete);
  res.status(200).json();
});

router.route("/deleteCompete/:id").post(async (req, res) => {
  const { id } = req.params;
  const compete = await Competitions.findById(id);
  if (compete) {
    const competeid = compete._id;
    await Competitions.findByIdAndDelete(id);
    await Leaderboard.findOneAndDelete({ compete: competeid });
    return res
      .status(200)
      .json({ message: "Competition Deleted Successfully!" });
  } else {
    return res.status(201).json({ message: "Competition Cannot be Deleted!" });
  }
});

module.exports = router;
