export const checkRole = (roles) => {
    return (req, res, next) => {
      const userRole = req.user.role; 
      if (roles.includes(userRole)) {
        next();
      } else {
        res.status(403).json({ message: "Forbidden: You don't have the required role" });
      }
    };
  };