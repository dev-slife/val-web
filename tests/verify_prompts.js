/**
 * Author: dev.slife
 * Date Created: 5/26/26
 * Date Updated: 5/26/26
 * Description:
 *      Verifies the JSON data and makes sure it matches the schema.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const path = require("path");

const VAL_JSON = path.join(__dirname, '..', 'src', 'json');
const VAL_prompts = require(path.join(VAL_JSON, 'prompts.json'));
const VAL_schema = require(path.join(VAL_JSON, 'schema.json'));



// --------------------------- HELPER FUNCTIONS --------------------------- //

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



// --------------------------- TEST FUNCTIONS --------------------------- //

async function verifySchema() {
    const response = validatePrompts();
    console.log(response["msg"]);
    console.assert(response["success"] == true);
}



// --------------------------- MAIN --------------------------- //

(async () => {
    await Promise.allSettled([
        verifySchema()
    ]);
    process.exit(0);
})();