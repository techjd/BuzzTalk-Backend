import { FAILURE, SERVER_SIDE_ERROR } from './Constants.js';

class FailureResponse {
  constructor(status, message, data) {
    (this.status = status), (this.message = message), (this.data = data);
  }

  response() {
    let response = new FailureResponse(this.status, this.message, this.data);
    return response;
  }
}

const failureResponse = new FailureResponse(FAILURE, SERVER_SIDE_ERROR, '');
const fixedresponse = failureResponse.response();

export default FailureResponse;
export { fixedresponse };