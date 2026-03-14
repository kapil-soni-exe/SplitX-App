const jwt = require("jsonwebtoken")
const cookie = require("cookie")

function socketAuth(socket, next){
  const cookieHeader = socket.handshake.headers.cookie

  if(!cookieHeader){
    return next(new Error("Authentication error"));
  }

  const cookies = cookie.parse(cookieHeader);
  const token = cookies.jwt_token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    if(err.name === "TokenExpiredError"){
      // Send a named error so the client can refresh and reconnect
      const expiredErr = new Error("TOKEN_EXPIRED");
      expiredErr.data = { type: "TOKEN_EXPIRED" };
      return next(expiredErr);
    }
    return next(new Error("Invalid token"));
  }
}

module.exports = socketAuth;