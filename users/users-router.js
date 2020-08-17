const router = require("express").Router()
const db = require("./users-model")

router.get("/", (req, res) => {
    db.findUsers()
    .then(users => {
        res.status(200).json(users)
    }).catch(err => {
        res.status(500).send(err)
    })
})

module.exports = router