const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

router.post("/register", (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.send(user).status(201);
    })
    .catch((err) => console.log(err));
});

//login
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).send({ message: "Invalid credentials" });
      } else {
        if (user.password === req.body.password) {
          const token = jwt.sign({ user }, "secretKey");
          res.status(200).send({ token });
        } else {
          res.status(401).send({ message: "Invalid credentials" });
        }
      }
    })
    .catch((err) => console.log(err));
});

router.post("/me", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.send({
        message: "Usuario autenticado",
        authData,
      });
    }
    console.log(authData, "soy authData");
  });
});

//Authorization: Bearer <token>
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log(req, "soy req");
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    console.log(req.token, "soy token");
    next();
  } else {
    res.sendStatus(403);
  }
}

router.get("/", (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users).status(200);
    })
    .catch((err) => console.log(err));
});

router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.send(user).status(200);
    })
    .catch((err) => console.log(err));
});

router.put("/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then((user) => {
      res.send(user).status(200);
    })
    .catch((err) => console.log(err));
});

router.post("/logout", function (req, res, next) {
  res.send("Logout");
});

module.exports = router;
