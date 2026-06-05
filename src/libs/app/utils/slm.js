/**
 * Author: dev.slife
 * Date Created: 4/18/26
 * Date Updated: 6/5/26
 * Description:
 *      Handles all message generation for VAL.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const path = require("path");
const {readFile} = require("fs/promises");
const algebra = require("../../vast/api/algebra.js");

const VAL_JSON = path.join(__dirname, "..", "..", "..", "json");
const VAL_prompts = require(path.join(VAL_JSON, "prompts.json"));
const VAL_dictionary = require(path.join(VAL_JSON, "dictionary.json"));
const PUNCTUATION = ['.', ',', '?', ':', ';'];
const SLM_MODEL = "MQnA";
const MAX_ATTEMPTS = 3;



// --------------------------- HELPER FUNCTIONS --------------------------- //

function genSeed(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function analyzeMsg(text) {
    const pattern = /(?:\d\w+|[\-\+\*\/\^\(\)]\s*\w+|\d+|\s*[\-\+\*\/\(\)]\s*)/gm;
    const mathMatch = text.match(pattern);

    if (mathMatch) {
        const expression = mathMatch.join('');
        if (expression.length != 0) {
            return expression;
        }
    }
}


async function preloadMsgs(msgType, cat=null) {
    const messages = VAL_prompts["messages"];
    const filteredMsgs = [];

    for (const msg of messages) {
        if (msg["step_type"] == msgType && (!cat || msg["category"] == cat)) {
            filteredMsgs.push(msg);
        }
    }

    return filteredMsgs;
}



// --------------------------- CLASSES --------------------------- //

class ModelManager {
    constructor() {
        this.models = {};
        this.anonymous = 1;
    }

    create(key=null, title="", context=null) {
        const model = new SLM(title, context);
        const id = this.anonymous;
        if (key) {
            this.models[key] = model;
        } else {
            this.models[id] = model;
            this.anonymous++;
        }
        return { model, id };
    }
    
    find(model_id) {
        return this.models[model_id];
    }
}


class SLM {
    constructor(t="", c=null) {
        this.input = null;
        this.title = t;
        this.phase = null;
        this.asking = false;
        this.attempts = 0;
        this.step = 0;
        this.hist = [];
        this.convo_id = null;
        this.context = (c && c.constructor == Object) ? c: {
            "EQUATION": "",
            "ANSWER": "",
            "STEPS": [],
            "NOUNS": [],
            "VERBS": []
        }
    }

    preprocess(question) {
        return question.toLowerCase().trimEnd();
    }

    async update_context(value, contextType, overwrite=false) {
        if (typeof(value) == "string") {
            this.context[contextType] = value;
        } else if (Array.isArray(value)) {
            if (overwrite) {
                this.context[contextType] = [];
            }
            for (const v of value) {
                if (!this.context[contextType].includes(v)) {
                    this.context[contextType].push(v);
                }
            }
        }
    }

    async get_known(known_types) {
        const messages = VAL_prompts;
        const SLM_dict = VAL_dictionary[SLM_MODEL]
        if (known_types.length > 1) {
            let known_map = {}
            for (const known_type of known_types) {
                known_map[known_type] = SLM_dict[known_type];
            }
            return known_map;
        } else {
            return SLM_dict[known_types[0]];
        }
    }

    async normalize_known_noun(word) {
        const known_nouns = await this.get_known(["NOUNS"]);
        if (known_nouns.includes(word)) {
            return word;
        } else if (PUNCTUATION.includes(word.charAt(word.length - 1)) && known_nouns.includes(word.substring(0, word.length - 1))) {
            return word.substring(0, word.length - 1);
        }
    }

    async extract_nouns() {
        const words = this.input.split(" ");
        let nouns = [];
        for (const word of words) {
            let norm_noun = await this.normalize_known_noun(word);
            if (norm_noun) {
                nouns.push(norm_noun);
            }
        }
        return nouns;
    }

    async extract_verbs() {
        const words = this.input.split(" ");
        const known_verbs = await this.get_known(["VERBS"])
        let verbs = [];
        for (const word of words) {
            if (known_verbs.includes(word)) {
                verbs.push(word);
            }
        }
        return verbs;
    }

    async resolve_pronouns() {
        const known_pronouns = await this.get_known(["PRONOUNS"]);
        for (const [pronoun, nouns] of Object.entries(known_pronouns)) {
            for (const noun of nouns) {
                if (this.input.includes(pronoun) && this.context["NOUNS"].includes(noun) && !this.input.includes(noun)) {
                    this.input = this.input.replaceAll(pronoun, noun);
                }
            }
        }
        return this.input;
    }

    async resolve_references() {
        const known_references = await this.get_known(["REFERENCES"]);
        for (const [reference, verbs] of Object.entries(known_references)) {
            for (const verb of verbs) {
                if (this.input.includes(reference) && this.context["VERBS"].includes(verb) && !this.input.includes(verb)) {
                    this.input = this.input.replaceAll(reference, verb);
                }
            }
        }
        return this.input;
    }

    async choose_response(state, cat=null) {
        const messages = await preloadMsgs(state, cat);
        const index = (genSeed(1, messages.length)) - 1;
        return messages[index].text;
    }

    async polish_response(chosenMsg, log=null) {
        let responses = [];
        if (chosenMsg.includes('?')) {
            this.asking = true;
            responses.push(chosenMsg);
        } else {
            if (log) {
                responses.push(
                    chosenMsg + "\n" + 
                    log["left"] + " " + log["oper"] + " " +
                    log["right"] + " = " + log["result"]
                );
            } else {
                responses.push(chosenMsg);
            }
            responses = responses.concat(await this.next_response());
        }
        return responses;
    }

    async next_response() {
        let responses = [];
        const tutorLog = this.context["STEPS"];
        
        if (tutorLog) {
            const log = tutorLog[this.step];
            
            if (this.asking) {
                const isCorrect = (this.input == log["result"]);
                if (isCorrect || this.attempts >= MAX_ATTEMPTS - 1) {
                    this.asking = false;
                    this.attempts = 0;
                    if (isCorrect) {
                        responses.push(await this.choose_response("any", "good_job"));
                    }
                    responses = responses.concat(await this.next_response());
                } else {
                    this.attempts++;
                    responses.push(await this.choose_response("check_work", "guidance"));
                }
            } else if (!this.phase) {
                this.phase = "simplify";
                const chosenMsg = await this.choose_response("start") + "\n" + this.context["EQUATION"];
                responses = responses.concat(await this.polish_response(chosenMsg));
            } else if (this.step >= tutorLog.length - 1) {
                this.phase = "solved";
                this.step = 0;
                const chosenMsg = await this.choose_response("finish");
                responses = responses.concat(await this.polish_response(chosenMsg, log));
            } else if (this.phase == "solved") {
                this.phase = null;
                const chosenMsg = "The answer we reached was: " + "\n" + this.context.ANSWER;
                responses.push(chosenMsg);
            } else if (this.phase == "solving") {
                this.step++;
                const chosenMsg = await this.choose_response("isolate_variable");
                responses = responses.concat(await this.polish_response(chosenMsg, log));
            } else if (this.phase == "simplify") {
                this.step++;
                if (log["oper"] == "V" && log["left"] == "S" && log["right"] == "L") {
                    this.phase = "solving";
                    responses = responses.concat(await this.next_response(responses));
                } else {
                    const chosenMsg = await this.choose_response("simplify");
                    responses = responses.concat(await this.polish_response(chosenMsg, log));
                }
            } else {
                responses.push(await this.choose_response("error", "server_error"));
            }
            
            return responses;
        } else {
            throw new Error("There are no math steps to walk through.");
        }
    }

    async generate(text) {
        this.input = this.preprocess(text);
        this.input = await this.resolve_pronouns();
        this.input = await this.resolve_references();
        
        if (this.phase) {
            return await this.next_response();
        } else {
            const nouns = await this.extract_nouns();
            const verbs = await this.extract_verbs();
            const expression = analyzeMsg(this.input);
            
            if (nouns.length > 0 || expression) {
                await this.update_context(nouns, "NOUNS");
                
                if (verbs.length > 0) {
                    await this.update_context(verbs, "VERBS");
                    this.title = verbs[0] + ": " + expression;
                    
                    if (verbs.includes("solve")) {
                        try {
                            const solution = await algebra.solve(expression);
                            await this.update_context(expression, "EQUATION");
                            await this.update_context(solution.answer, "ANSWER");
                            await this.update_context(solution.log, "STEPS", true);
                            const responses = await this.next_response();
                            this.convo_id = null; // change to be whenever a new convo is made by user
                            return responses;
                        } catch (err) {
                            if (err instanceof algebra.InvalidType) {
                                return [await this.choose_response("error", "server_error")];
                            } else if (err instanceof algebra.UndefinedVariable) {
                                return [await this.choose_response("error", "server_error")];
                            } else if (err instanceof algebra.InvalidEquation) {
                                return [await this.choose_response("error", "server_error")];
                            } else if (err instanceof algebra.NotEstablishedYet) {
                                return [await this.choose_response("error", "server_error")];
                            } else if (err instanceof algebra.VASTError) {
                                return [await this.choose_response("error", "server_error")];
                            } else {
                                return [await this.choose_response("error", "server_error")];
                            }
                        }
                    } else {
                        return [await this.choose_response("error", "confused")];
                    }
                } else {
                    return [await this.choose_response("error", "confused")];
                }
            } else {
                return [await this.choose_response("error", "no_equation")];
            }
        }
    }
}



// --------------------------- EXPORTS --------------------------- //

module.exports = {
    analyzeMsg: analyzeMsg,
    ModelManager: ModelManager,
    SLM: SLM
};