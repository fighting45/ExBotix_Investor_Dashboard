const router = require("express").Router();
const userService = require("../../services/user");
const roleMiddleware = require("../../middlewares/role");
const ROLES = require("../../constants/roles");

// All routes require ADMIN role
router.post("/", roleMiddleware(ROLES.ADMIN), userService.createUser);
router.get("/", roleMiddleware(ROLES.ADMIN), userService.getAllUsers);
router.get("/:id", roleMiddleware(ROLES.ADMIN), userService.getUserById);
router.put("/:id", roleMiddleware(ROLES.ADMIN), userService.updateUser);
router.delete("/:id", roleMiddleware(ROLES.ADMIN), userService.deleteUser);

module.exports = router;

