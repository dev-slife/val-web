/**
 * Author: dev.slife
 * Date Created: 4/18/26
 * Date Updated: 6/1/26
 * Description:
 *      Works with the VAST system (C++) & VAL's SLM to generate responses and walk students through math problems.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const express = require("express");
const router = express.Router();
const algebra = require("../../vast/api/algebra.js");
const {saveChat, histEnabled} = require("../utils/data_utils.js");
const {ModelManager, SLM} = require("../utils/slm.js");
const MODELS = new ModelManager();



// ---------------------------- HELPER FUNCTIONS ---------------------------- //

function findModel(user, guest_id) {
    let model, id;

    if (user) {
        model = MODELS.find(user) ?? MODELS.create(user).model;
    } else {
        model = MODELS.find(guest_id);
        if (!model) {
            ({model, id} = MODELS.create());
        }
    }

    return {model, id};
}



// ---------------------------- ROUTING FUNCTIONS ---------------------------- //

router.get('/simplify', async(req, res) => {
    const {expression} = req.query;
    
    try {
        if (expression) {
            const result = await algebra.simplify(decodeURIComponent(expression));
            if (result) {
                res.status(200).send({
                    success: true,
                    message: "Successfully simplified the given equation.",
                    solution: result
                });
            } else {
                res.status.send(500).send({
                    success: false,
                    message: "VAL ran into an unexpected error when attempting to simplify the given equation."
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Incomplete query, missing '?expression='."
            });
        }
    } catch (err) {
        console.log(`Could not simplify the given expression: ${expression}`, {
            name: err.name,
            message: err.message
        });

        res.status(500).send({
            success: false,
            message: `VAL ran into an unexpected error when attempting to simplify the given equation, caught ${err.name}`
        });
    }
});


router.get('/solve', async(req, res) => {
    const {expression} = req.query;

    try {
        if (expression) {
            const result = await algebra.solve(decodeURIComponent(expression));
            if (result) {
                res.status(200).send({
                    success: true,
                    message: "Successfully solved the given equation.",
                    solution: result
                });
            } else {
                res.status.send(500).send({
                    success: false,
                    message: "VAL ran into an unexpected error when attempting to solve the given equation."
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Incomplete query, missing '?expression='."
            });
        }
    } catch (err) {
        console.log(`Could not solve the given expression: ${expression}`, {
            name: err.name,
            message: err.message
        });

        res.status(500).send({
            success: false,
            message: `VAL ran into an unexpected error when attempting to solve the given equation, caught ${err.name}`
        });
    }
});


router.post('/ask', async(req, res) => {
    const {user, model_id, question} = req.body;
    const {model, id} = findModel(user, model_id);

    try {
        const reply = await model.generate(decodeURIComponent(question));
        const msgPayload = [["user", decodeURIComponent(question)]];
        for (const msg of reply) {
            msgPayload.push(["val", msg]);
        }

        if (await histEnabled(user)) {
            const convoID = await saveChat(user, model.title, msgPayload, model.context.NOUNS, model.context.VERBS, model.convo_id);
            if (convoID) {
                model.convo_id = convoID;
            }
        }

        res.status(200).send({
            success: true,
            reply: reply,
            chat_title: model.title,
            model_id: id,
            msg: "Successfully responded to message."
        });
    } catch (err) {
        console.log(`VAL was unable to answer the given question: ${question}`, {
            name: err.name,
            message: err.message
        });

        res.status(500).send({
            success: false,
            message: `VAL ran into an unexpected error when attempting to answer your question, caught ${err.name}`
        });
    }
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;