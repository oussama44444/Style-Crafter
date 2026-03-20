import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    const { token } = req.headers;


    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }

   
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

   
    const isAuthorized = decodedToken === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
    if (!isAuthorized) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    
    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
