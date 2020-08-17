const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const db = require("../users/users-model");

router.post("/register", (req, res) => {
  let credentials = req.body;
  const rounds = 8;

  const hash = bcryptjs.hashSync(credentials.password, rounds);
  credentials.password = hash;

  db.addUsers(credentials)
    .then((saved) => {
      res.status(201).json({ data: saved });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.findUserBy({ username })
    .then((users) => {
      const user = users[0];
      if (user && bcryptjs.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        req.session.username = user.username;
        res.status(200).json({ message: "welcome", session: req.session });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "error logging out" });
      } else {
        res.status(204).end();
      }
    });
  } else {
    res.status(204).end();
  }
});

module.exports = router;
