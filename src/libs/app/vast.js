/**
 * Author: dev.slife
 * Date Created: 4/18/26
 * Date Updated: 5/29/26
 * Description:
 *      Works with the VAST system (C++) & VAL's SLM to generate responses and walk students through math problems.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const express = require("express");
const router = express.Router();
const algebra = require("../vast/api/algebra.js");
const { saveChat, pullChat } = require("../app/db.js");
const { ModelManager, SLM } = require("../app/slm.js");
const MODELS = new ModelManager();



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


router.post('/ask', async(req, res) => {
    try {
        const { user, guest_id, question } = req.body;
        if (user) {
            const model = MODELS.find(user) ?? MODELS.create(user).model;
            const reply = await model.generate(decodeURIComponent(question));
            const msgPayload = [["user", decodeURIComponent(question)]];
            for (const msg of reply) {
                msgPayload.push(["val", msg]);
            }

            // await saveChat(user, model.title, msgPayload, model.context.NOUNS, model.context.VERBS);
            res.status(200).send({
                "reply": reply,
                "chat_title": model.title,
                "msg": "Successfully responded to message."
            });
        } else {
            let id;
            let model = MODELS.find(guest_id);
            if (!model) {
                ({model, id} = MODELS.create());
            }
            console.log(model, id);
            const reply = await model.generate(decodeURIComponent(question));

            res.status(200).send({
                "reply": reply,
                "chat_title": model.title,
                "model_id": id,
                "msg": "Successfully responded to message."
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(`Could not solve expression: ${err}`);
    }
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;