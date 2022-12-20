import jwtDecode from 'jwt-decode';
import { localGet, localRemove } from './localStorage';

function remainTime(currentTime, decodedTime) {
  return Math.ceil((decodedTime * 1000 - currentTime) / 1000);
}

function authenticate() {
  const token = localGet('token');
  if (token == null) {
    return false;
  }
  const decoded = jwtDecode(token);
  const currentTime = Date.now();
  const remain = remainTime(currentTime, decoded.exp);
  // jwt token expires in 5 minutes, which is 300 seconds
  if (remain > 0) {
    return true;
  }
  // invalidate token same as delete token
  localRemove('token');
  return false;
}

export { authenticate, remainTime };
