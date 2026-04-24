/**
 * Author: dev.slife
 * Date Created: 4/18/26
 * Date Updated: 4/23/26
 * Description:
 *      Works with the VAST system (C++) & VAL's SLM to generate responses and walk students through math problems.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const express = require("express");
const router = express.Router();
const algebra = require("../vast/api/algebra.js");
const { SLM, analyzeMsg } = require("../app/slm.js");



// ---------------------------- ROUTING ---------------------------- //

router.get('/simplify', async(req, res) => {
    try {
        const { expression } = req.query;
        if (expression) {
            const result = await algebra.simplify(decodeURIComponent(expression));
            res.status(200).send(result);
        } else {
            res.status(400).send("No expression was given.")
        }
    } catch (err) {
        res.status(500).send("Could not simplify expression.");
    }
});


router.get('/solve', async(req, res) => {
    try {
        const { expression } = req.query;
        if (expression) {
            const result = await algebra.solve(decodeURIComponent(expression));
            res.status(200).send(result);
        } else {
            res.status(400).send("No expression was given.")
        }
    } catch (err) {
        res.status(500).send("Could not solve expression.");
    }
});


router.get('/ask', async(req, res) => {
    try {
        const { question } = req.query;
        const response = analyzeMsg(question);
        const expression = response["equation"];
        const result = await algebra.solve(decodeURIComponent(expression));
        const model = new SLM();
        const msgList = model.ask(decodeURIComponent(question), result["log"]);
        res.status(200).send({
            "answer": result["answer"],
            "log": result["log"],
            "slm": msgList
        })
    } catch (err) {
        res.status(500).send(`Could not solve expression: ${err}`);
    }
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;


// test query
// http://localhost:3000/api/vast/ask?question=Hey%20VAL%20could%20you%20help%20me%20solve%20this%20equation%3F%0A5x-3x%2B2