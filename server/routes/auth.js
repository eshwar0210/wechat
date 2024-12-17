const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
} = require("../controllers/userController");

const router = require("express").Router();
const  verifyToken  = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/register", register);
router.get("/allusers",verifyToken,getAllUsers);
router.post("/setavatar",verifyToken, setAvatar);
router.get("/logout",verifyToken, logOut);

module.exports = router;
