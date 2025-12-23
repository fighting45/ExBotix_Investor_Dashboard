const router = require("express").Router();

router.use(require("../controllers/auth/index.js"));
router.use(require("../controllers/priceService/index.js"));
router.use("/users", require("../controllers/user/index.js"));
module.exports = router;
