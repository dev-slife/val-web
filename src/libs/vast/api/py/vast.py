"""
Author: dev.slife
Date Created: 2/15/26
Date Updated: 4/22/26
Description:
    Works with the VAST system (C++) to parse and solve math equations.
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
DLL_PATH = os.path.join(PACKAGE_DIR, "bin", "VAST.dll")
VAST_LIB = ctypes.CDLL(DLL_PATH)



#------------------------ DEFINE CTYPES ------------------------#

VAST_LIB.VAST_simplify.argtypes = [ctypes.c_char_p]
VAST_LIB.VAST_simplify.restype = ctypes.c_char_p
VAST_LIB.VAST_solve_literal.argtypes = [ctypes.c_char_p]
VAST_LIB.VAST_solve_literal.restype = ctypes.c_char_p



#------------------------ "PRIVATE" FUNCTIONS ------------------------#

def __findVASTException(eType="VASTError", eMsg="An unexpected error occurred when using VAST."):
    return NotEstablishedYet(eMsg) \
        if (eType == "NotEstablishedYet") else \
    InvalidEquation(eMsg) \
        if (eType) == "InvalidEquation" else \
    UndefinedVariable(eMsg) \
        if (eType) == "UndefinedVariable" else \
    InvalidType(eMsg) \
        if (eType) == "InvalidType" else \
    VASTError(eMsg)
    

def __decodeVAST(msg: str) -> tuple:
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

def simplify(expression: str) -> tuple:
    result_bytes = VAST_LIB.VAST_simplify(expression.encode())
    result: str = ctypes.string_at(result_bytes).decode()
    if ": " in result:
        eType = result.split(": ")[0]
        eMsg = result.split(": ")[-1]
        raise __findVASTException(eType, eMsg)
    return __decodeVAST(result)


def solve(expression: str) -> tuple:
    result_bytes = VAST_LIB.VAST_solve_literal(expression.encode())
    result: str = ctypes.string_at(result_bytes).decode()
    if ": " in result:
        eType = result.split(": ")[0]
        eMsg = result.split(": ")[-1]
        raise __findVASTException(eType, eMsg)
    return __decodeVAST(result)




if __name__ == "__main__":
    if (len(sys.argv) > 1):
        payload = sys.argv[1]
        data = json.loads(payload)
        
        output = "NaN"
        if (data["Eval"].lower() == "simplify"):
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