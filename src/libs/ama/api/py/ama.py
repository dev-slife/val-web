"""
Author: dev.slife
Date Created: 2/15/26
Date Updated: 8/20/26
Description:
    Works with the AMA system (C++) to parse and solve math equations (Linux).
"""





#------------------------ IMPORT MODULES ------------------------#

import os
import sys
import json
import ctypes
from .errors import *



#------------------------ CONSTANT VARIABLES ------------------------#

FILE_DIR = os.path.dirname(os.path.abspath(__file__))
PACKAGE_DIR = os.path.dirname(os.path.dirname(FILE_DIR))
DLL_PATH = os.path.join(PACKAGE_DIR, "bin", "AMA.so")
AMA_LIB = ctypes.CDLL(DLL_PATH)



#------------------------ DEFINE CTYPES ------------------------#

AMA_LIB.AMA_simplify.argtypes = [ctypes.c_char_p]
AMA_LIB.AMA_simplify.restype = ctypes.c_char_p
AMA_LIB.AMA_solve_literal.argtypes = [ctypes.c_char_p]
AMA_LIB.AMA_solve_literal.restype = ctypes.c_char_p
AMA_LIB.AMA_equivalent.argtypes = [ctypes.c_char_p, ctypes.c_char_p]
AMA_LIB.AMA_equivalent.restype = ctypes.c_bool


#------------------------ "PRIVATE" FUNCTIONS ------------------------#

def __findAMAException(eType="AMAError", eMsg="An unexpected error occurred when using AMA."):
    return NotEstablishedYet(eMsg) \
        if (eType == "NotEstablishedYet") else \
    InvalidEquation(eMsg) \
        if (eType) == "InvalidEquation" else \
    UndefinedVariable(eMsg) \
        if (eType) == "UndefinedVariable" else \
    InvalidType(eMsg) \
        if (eType) == "InvalidType" else \
    AMAError(eMsg)
    

def __decodeAMA(msg: str) -> tuple:
    answer, log = msg.split(" | ")
    attr = ("ID", "result", "left", "oper", "right")
    entries = []
    i = 0
    while (log[i] != "}"):
        offset = 1
        logMap = {}
        if (log[i] == "["):
            parse = ""
            parseCount = 0
            while (log[i+offset] != "]"):
                if (log[i+offset] == ","):
                    logMap[attr[parseCount]] = parse
                    parse = ""
                    parseCount += 1
                else:
                    parse += log[i+offset]
                offset += 1
            if parse: logMap[attr[parseCount]] = parse
            entries.append(logMap)
        i += offset
    return answer[1:], entries
    


#------------------------ API FUNCTIONS ------------------------#

def equivalent(expression1: str, expression2: str) -> bool:
    result = AMA_LIB.AMA_equivalent(expression1.encode(), expression2.encode())
    return [result, None]


def simplify(expression: str) -> tuple:
    result_bytes = AMA_LIB.AMA_simplify(expression.encode())
    result: str = ctypes.string_at(result_bytes).decode()
    if ": " in result:
        eType = result.split(": ")[0]
        eMsg = result.split(": ")[-1]
        raise __findAMAException(eType, eMsg)
    return __decodeAMA(result)


def solve(expression: str) -> tuple:
    result_bytes = AMA_LIB.AMA_solve_literal(expression.encode())
    result: str = ctypes.string_at(result_bytes).decode()
    if ": " in result:
        eType = result.split(": ")[0]
        eMsg = result.split(": ")[-1]
        raise __findAMAException(eType, eMsg)
    return __decodeAMA(result)




if __name__ == "__main__":
    if (len(sys.argv) > 1):
        payload = sys.argv[1]
        data = json.loads(payload)
        
        output = "NaN"
        if (data["Eval"].lower() == "equivalent"):
            output = equivalent(data["Input"][0], data["Input"][1])
        elif (data["Eval"].lower() == "simplify"):
            output = simplify(data["Input"])
        elif (data["Eval"].lower() == "solve_literal"):
            output = solve(data["Input"])
        
        output = {
            "answer": output[0],
            "log": output[1]
        }
        print(json.dumps(output))
        sys.stdout.flush()
    else:
        print(DLL_PATH)
        print(f"Exists: {os.path.exists(DLL_PATH)}")
        print(f"Size: {os.path.getsize(DLL_PATH) if os.path.exists(DLL_PATH) else 'N/A'}")
        inp = input("Please enter a mathmetical expression: ")
        simple = simplify(inp)
        solved = solve(inp)
        print(simple)
        print(solved)
        inp2 = input("Enter a second input to compare with your first: ")
        similar = equivalent(inp, inp2)
        print(similar)