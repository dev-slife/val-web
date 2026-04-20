/**
 * Author: dev.slife
 * Date Created: 4/18/26
 * Date Updated: 4/19/26
 * Description:
 *      Works with the VAST system (C++) & VAL's SLM to generate responses and walk students through math problems.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const express = require("express");
const router = express.Router();
const algebra = require("../vast/api/algebra.js");



// ---------------------------- ROUTING ---------------------------- //

router.get('/simplify', async(req, res) => {
    const { expression } = req.query;
    const result = await algebra.simplify(decodeURIComponent(expression));
});


router.get('/solve', async(req, res) => {
    const { expression } = req.query;
    const result = await algebra.solve(decodeURIComponent(expression));
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;