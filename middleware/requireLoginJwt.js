const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "you must be logged in" })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in" })
        }

        const { _id } = payload
        User.findById(_id).then(userdata => {
            if(userdata.status === "Pending"){
                return res.status(401).json({ error: "You account is registered but not Verified" })
            }
            req.user = userdata
            next()
        })
    })
}