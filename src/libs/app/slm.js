/**
 * Author: dev.slife
 * Date Created: 4/18/26
 * Date Updated: 4/22/26
 * Description:
 *      Handles all message generation for VAL.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const path = require("path");


const VAL_JSON = path.join(__dirname, '..', '..', 'json');
const VAL_prompts = require(path.join(VAL_JSON, 'prompts.json'));
const VAL_schema = require(path.join(VAL_JSON, 'schema.json'));
const VAL_dictionary = require(path.join(VAL_JSON, 'dictionary.json'));
const PUNCTUATION = ['.', ',', '?', ':', ';'];
const SLM_MODEL = "MQnA";



// --------------------------- HELPER FUNCTIONS --------------------------- //

function genSeed(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



// --------------------------- DATA VALIDATION --------------------------- //

function validatePrompts() {
    const msgSchema = VAL_schema["$defs"]["message"];

    let requiredMet = 0;
    let requiredNeeded = VAL_schema["required"].length + 
        (msgSchema["required"].length * VAL_prompts["messages"].length);

    for (const [header, data] of Object.entries(VAL_prompts)) {
        if (VAL_schema["required"].includes(header)) {
            requiredMet++;
        }
        if (!VAL_schema["properties"].hasOwnProperty(header)) {
            return {
                "success": false,
                "msg": `Unknown header property: ${header}`
            };
        } else if (header == "messages") {
            for (const msg of data) {
                for (const [attr, msgValue] of Object.entries(msg)) {
                    if (msgSchema["required"].includes(attr)) {
                        requiredMet++;
                    }
                    if (!msgSchema["properties"].hasOwnProperty(attr)) {
                        return {
                            "success": false,
                            "msg": `Unknown message property: ${attr}`
                        };
                    } else {
                        for (const [prop, propData] of Object.entries(msgSchema["properties"][attr])) {
                            if (prop == "type" && typeof(msgValue) != propData) {
                                return {
                                    "success": false,
                                    "msg": `Invalid message ${attr} type: ${typeof(msgValue)}`
                                };
                            } else if (prop == "minLength" && msgValue.length < propData) {
                                return {
                                    "success": false,
                                    "msg": `Invalid message ${attr} length: ${msgValue.length}`
                                };
                            } else if (prop == "enum" && (!propData.includes(msgValue))) {
                                return {
                                    "success": false,
                                    "msg": `Invalid message ${attr} enum: ${msgValue}`
                                };
                            } else if (prop == "items") {
                                for (const item in msgValue) {
                                    if (propData.hasOwnProperty("type") && typeof(item) != propData["type"]) {
                                        return {
                                            "success": false,
                                            "msg": `Invalid message ${attr} ${prop} type: ${typeof(item)}`
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            for (const [req, value] of Object.entries(VAL_schema["properties"][header])) {
                if (req == "type" && typeof(data) != value) {
                    return {
                        "success": false,
                        "msg": `Invalid header type: ${typeof(data)}`
                    };
                } else if ((req == "minLength" || req == "minItems") && data.length < value) {
                    return {
                        "success": false,
                        "msg": `Invalid header length: ${data.length}`
                    };
                }
            }
        }
    }

    if (requiredMet == requiredNeeded) {
        return {
            "success": true,
            "msg": "Data matches schema."
        }
    }
    return {
        "success": false,
        "msg": "Not all required properties have been met."
    };
}



// --------------------------- PRELOADING MESSAGES --------------------------- //

function preloadMsgs(msgType) {
    const messages = VAL_prompts["messages"];
    const filteredMsgs = [];

    for (const msg of messages) {
        if (msg["step_type"] == msgType) {
            filteredMsgs.push(msg);
        }
    }

    return filteredMsgs;
}



// --------------------------- MESSAGE GENERATION --------------------------- //

function analyzeMsg(text) {
    const pattern = /(?:\d\w+|[\-\+\*\/\^\(\)]\s*\w+|\d+|\s*[\-\+\*\/\(\)]\s*)/gm;
    const mathMatch = text.match(pattern);

    if (mathMatch) {
        const expression = mathMatch.join('');
        if (expression.length != 0) {
            return {
                "success": true,
                "msg": expression,
                "equation": expression
            };
        }
    }

    return {
        "success": false,
        "msg": "No equation was given.",
        "equation": null
    }
}


class SLM {
    constructor(question=null) {
        this.context = {
            "MATH_STEPS": [],
            "NOUNS": [],
            "VERBS": []
        }
        this.Q = (question) ? this.preprocess(question): null;
    }

    preprocess(question) {
        return question.toLowerCase().trimEnd();
    }

    update_context(items, contextType) {
        for (const item of items) {
            this.context[contextType].push(item);
        }
    }

    get_known(known_types) {
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

    normalize_known_noun(word) {
        const known_nouns = this.get_known(["NOUNS"]);
        if (known_nouns.includes(word)) {
            return word;
        } else if (PUNCTUATION.includes(word.charAt(word.length - 1)) && known_nouns.includes(word.substring(0, word.length - 1))) {
            return word.substring(0, word.length - 1);
        }
    }

    extract_nouns() {
        const words = this.Q.split(" ");
        let nouns = [];
        for (const word of words) {
            let norm_noun = this.normalize_known_noun(word);
            if (norm_noun) {
                nouns.push(norm_noun);
            }
        }
        return nouns;
    }

    extract_verbs() {
        const words = this.Q.split(" ");
        const known_verbs = this.get_known(["VERBS"])
        let verbs = [];
        for (const word of words) {
            if (known_verbs.includes(word)) {
                verbs.push(word);
            }
        }
        return verbs;
    }

    resolve_pronouns() {
        const known_pronouns = this.get_known(["PRONOUNS"]);
        for (const [pronoun, nouns] of Object.entries(known_pronouns)) {
            for (const noun of nouns) {
                if (this.Q.includes(pronoun) && this.context["NOUNS"].includes(noun) && !this.Q.includes(noun)) {
                    this.Q = this.Q[this.Q.indexOf(pronoun)] = noun;
                }
            }
        }
        return this.Q;
    }

    resolve_references() {
        const known_references = this.get_known(["REFERENCES"]);
        for (const [reference, verbs] of Object.entries(known_references)) {
            for (const verb of verbs) {
                if (this.Q.includes(reference) && this.context["VERBS"].includes(verb) && !this.Q.includes(verb)) {
                    this.Q = this.Q[this.Q.indexOf(reference)] = verb;
                }
            }
        }
        return this.Q;
    }

    choose_response(state) {
        const messages = preloadMsgs(state);
        const index = (genSeed(1, messages.length)) - 1;
        return messages[index].text;
    }

    next_response(tutorLog, index, solving, responses) {
        let log = tutorLog[index];
        if (!responses) {
            responses = [];
        }

        if (log["result"]) {
            this.update_context([log["result"]], "MATH_STEPS");
        }

        if (index == tutorLog.length - 1) {
            responses.push(this.choose_response("finish"));
            return responses;
        } else if (solving) {
            responses.push(this.choose_response("isolate_variable"));
            return this.next_response(tutorLog, index + 1, solving, responses);
        } else {
            if (log["oper"] == "V" && log["left"] == "S" && log["right"] == "L") {
                return this.next_response(tutorLog, index + 1, true, responses);
            } else {
                responses.push(this.choose_response("simplify"));
                return this.next_response(tutorLog, index + 1, solving, responses);
            }
        }
    }

    generate(tutorLog) {
        let responses = [];
        const states = VAL_dictionary[SLM_MODEL];

        this.Q = this.resolve_pronouns();
        this.Q = this.resolve_references();
        const nouns = this.extract_nouns();
        const verbs = this.extract_verbs();
        const known_nouns = this.get_known(["NOUNS"]);
        const known_verbs = this.get_known(["VERBS"])
        const expression = analyzeMsg(this.Q);

        if (known_nouns.some(known_noun => nouns.includes(known_noun)) || expression["success"]) {
            this.update_context(nouns, "NOUNS");
            this.update_context(verbs, "VERBS");
            if (known_verbs.some(known_verb => verbs.includes(known_verb))) {
                responses.push(this.choose_response("start"));
            }
            if (expression["success"]) {
                this.update_context([expression["equation"]], "MATH_STEPS");
            }
            if (tutorLog) {
                responses = this.next_response(tutorLog, 0, false, responses);
            }
        }

        return responses;
    }

    ask(question, tutorLog) {
        this.Q = this.preprocess(question);
        return this.generate(tutorLog);
    }
}



// --------------------------- EXPORTS --------------------------- //

module.exports = {
    validatePrompts: validatePrompts,
    analyzeMsg: analyzeMsg,
    SLM: SLM
};