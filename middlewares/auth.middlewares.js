import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "Token is required" });
  }
  const tokenWithoutBearer = token.split(" ")[1];

  try {
    const decodedToken = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = { ...decodedToken };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: error });
    next(error);
  }
};
export default auth;
