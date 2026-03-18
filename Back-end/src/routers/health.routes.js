const router = require("express").Router();

router.get("/", (req, res) => {
    res.json({ status: "OK", service: "erp_oso" });
});

module.exports = router;