const jwt = require("jsonwebtoken");

module.exports.generateToken = (userData) => {
  const payLoad = {...userData}
  return jwt.sign(payLoad, process.env.JWT_SECRETE_KEY, { expiresIn: "10h" });
};

module.exports.verifyJWTToken = async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
      return { err: null, decoded: decoded };
    } catch (err) {
      return { err: err, decoded: null };
    }
  };