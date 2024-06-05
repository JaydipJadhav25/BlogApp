import { validatetoken } from "../services/token.services.js";



const verifyjwt =  (req, res, next) => {
    const usertoken = req.cookies.token;
    // console.log("usertoken : " , usertoken)

    if(!usertoken) return res.render("signin")

    //token ahe checking validate or not
    
    const exuser = validatetoken(usertoken);

    if(!exuser) return res.render("signin")

    //done user ahe so injected in req
    
    req.user = exuser;
    next()

}

export default verifyjwt