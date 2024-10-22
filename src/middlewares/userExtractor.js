import jwt from "jsonwebtoken"

export default function userExtractor(req, res, next) {
    const authorization = req.get("Authorization");
    let token = ''

    if(authorization && authorization.toLowerCase().startsWith('bearer')){
        token = authorization.split(7)
    }


    const decodedToken = jwt.verify(token, SECRET_JWT);
    console.log(decodedToken);
    
    //const {id:user_id} = decodedToken;

    if (!token || !decodedToken.id) {
        return res.status(401).json({
            message: "No autorizado",
        });
    }
    const {id:user_id} = decodedToken;
    req.user_id = user_id;



    next();
}