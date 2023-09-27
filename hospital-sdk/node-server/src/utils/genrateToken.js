import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config();


const GenrateToken = async (data) => {
  return jwt.sign({data}, process.env.JWT_SECRET || 'JWT_SECRET');
};



export default GenrateToken;