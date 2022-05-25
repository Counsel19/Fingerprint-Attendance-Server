const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {

  const authHeader = req.cookies.jwt;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      
      next();
    });
  } else {
    return res.status(401).json("Not Authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {

    console.log(req.user)

    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Not Authorized!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
     
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Not Authorized");
    }
  });
};



module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};


