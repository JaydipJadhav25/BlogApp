import Jwt from "jsonwebtoken";
const secretkey = "$uperman009"

function settokenuser(user) {

    return  Jwt.sign({
        _id: user._id,
        fullname :user.fullname,
        email : user.email,
        avatar : user.avatar,
        role : user.role
    },
secretkey)

}


function validatetoken(token) {
    return Jwt.verify(token , secretkey)
}

export {
    settokenuser,
    validatetoken
}