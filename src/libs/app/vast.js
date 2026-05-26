/**
 * Author: dev.slife
 * Date Created: 4/18/26
 * Date Updated: 5/26/26
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
            res.status(400).send("Hi, I'm unable to help you without an equation to look at.");
        }
    } catch (err) {
        console.log(err);
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
            res.status(400).send("Hi, I'm unable to help you without an equation to look at.");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Could not solve expression.");
    }
});


router.get('/ask', async(req, res) => {
    try {
        const { question } = req.query;
        const response = analyzeMsg(question);
        const expression = response["equation"];
        if (expression) {
            const result = await algebra.solve(decodeURIComponent(expression));
            const model = new SLM();
            const msgList = model.ask(decodeURIComponent(question), result["log"]);
            res.status(200).send({
                "answer": result["answer"],
                "log": result["log"],
                "slm": msgList
            });
        } else {
            res.status(400).send({
                "answer": "Hi, I'm unable to help you without an equation to look at.",
                "log": [],
                "slm": []
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(`Could not solve expression: ${err}`);
    }
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;