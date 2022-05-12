const jwt = require("jsonwebtoken")


const authentication = function (req, res, next) {
    let token = req.headers["x-api-key"]
    if (token) {
        const validToken = jwt.verify(token, "kishan")
        if (validToken) {
            req.validToken=validToken
            next();
        }else {
            res.send({ msg: "invalid Token" })
        }
    } else {
        res.send({ msg: "mandatory header is not present" })
    }
}



module.exports.authentication = authentication