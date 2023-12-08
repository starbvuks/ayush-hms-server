const isAdmin = (req, res, next) => {
  // check if req.user is defined
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // get the user's role from the request
  const userRole = req.user.role;

  // check if the user is an admin
  if (
    userRole === "zone_admin_1" ||
    userRole === "zone_admin_2" ||
    userRole === "super_admin"
  ) {
    next();
  } else {
    // if the user is not an admin, return a 403 status code
    res.status(403).json({ message: "Access denied" });
  }
};

module.exports = isAdmin;
