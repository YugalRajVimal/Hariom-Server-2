import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  console.log(req.body);
  console.log(req.files);
  // Read the token from the Authorization header
  const token = req.headers["authorization"];

  // If no token is present, return an error
  if (!token) {
    return res.status(401).send("---Unauthorized");
  }

  // Verify if the token is valid
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!payload) {
      return res.status(401).send("Unauthorized Access");
    }
    const user = {
      id: payload.userId,
      role: payload.role,
    };
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If the token is not valid, return an error
    console.log(error);
    return res.status(401).send("Unauthorized Access");
  }
};

export default jwtAuth;
