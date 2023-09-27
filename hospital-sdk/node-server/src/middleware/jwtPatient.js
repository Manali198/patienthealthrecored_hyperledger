import jwt from "jsonwebtoken";
import { HTTPResponse, StatusCodes } from "../utils/HTTPResponse.js";

const AuthCheckPatient = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.includes("Bearer")) {
    return HTTPResponse.BAD_REQUEST(res, {
      status: StatusCodes.BAD_REQUEST,
      message: "No Token Found",
    });
  }
  let AToken = token.split("Bearer ")[1];
  jwt.verify(AToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded.data || decoded.data.type !== "Patient") {
      return HTTPResponse.BAD_REQUEST(res, {
        status: StatusCodes.BAD_REQUEST,
        message: "Invalid Token",
      });
    }
    req.decodedId = decoded.data.id;
    next();
  });
};

export default AuthCheckPatient;
