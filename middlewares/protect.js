import { FAILURE, UNAUTHORIZED_USER } from '../utils/Constants.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import FailureResponse, {fixedresponse} from '../utils/FailureResponse.js';
config();

const protect = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(' ')[1];
      let user = jwt.verify(token, process.env.secret_key);
      req.userId = user.id;
    } else {
      const failureResponse = new FailureResponse(
        FAILURE,
        UNAUTHORIZED_USER,
        ''
      );
      const response = failureResponse.response();
      return res.status(404).json(response);
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(fixedresponse);
  }
};

export default protect;