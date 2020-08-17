const db = require("../database/connection")

module.exports = {
    addUsers,
    findUsers,
    findUserBy,
    findUserById,
}

function findUsers() {
    return db("users").select("id", "username").orderBy("id")
}

function findUserBy(variable) {
    return db("users").where(variable).orderBy("id")
}

async function addUsers(user) {
    try {
        const [id] = await db("users").insert(user, "id")
        return findUserById(id)
    } catch (err) {
        throw err
    }
}

function findUserById(id) {
    return db("users").where({id}).first()
}