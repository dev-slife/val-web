"""
Author: dev.slife
Date Created: 2/15/26
Date Updated: 8/27/26
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

# Files
FILE_DIR = os.path.dirname(os.path.abspath(__file__))
PACKAGE_DIR = os.path.dirname(os.path.dirname(FILE_DIR))
DLL_PATH = os.path.join(PACKAGE_DIR, "bin", "AMA.so")
AMA_LIB = ctypes.CDLL(DLL_PATH)

# ENUMS
CMD_OPTS = [
    "q",         # 0
    "simp",      # 1
    "sol",       # 2
    "equiv",     # 3
    "approx",    # 4
]



#------------------------ DEFINE CTYPES ------------------------#

AMA_LIB.AMA_simplify.argtypes = [ctypes.c_char_p]
AMA_LIB.AMA_simplify.restype = ctypes.c_char_p
AMA_LIB.AMA_solve_literal.argtypes = [ctypes.c_char_p]
AMA_LIB.AMA_solve_literal.restype = ctypes.c_char_p
AMA_LIB.AMA_equivalent.argtypes = [ctypes.c_char_p, ctypes.c_char_p]
AMA_LIB.AMA_equivalent.restype = ctypes.c_int
AMA_LIB.AMA_approximate.argtypes = [ctypes.c_char_p, ctypes.c_char_p]
AMA_LIB.AMA_approximate.restype = ctypes.c_int



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

def approximate(expression1: str, expression2: str) -> bool:
    status = AMA_LIB.AMA_approximate(expression1.encode(), expression2.encode())
    if (status == -1):
        raise AMAError(f"An unexpected error occurred when attempting to approximate {expression1}, and {expression2}.")
    return [True if (status == 1) else False, None]


def equivalent(expression1: str, expression2: str) -> bool:
    status = AMA_LIB.AMA_equivalent(expression1.encode(), expression2.encode())
    if (status == -1):
        raise AMAError(f"An unexpected error occurred when attempting to measure equivalence between {expression1}, and {expression2}.")
    return [True if (status == 1) else False, None]


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



#------------------------ MAIN ------------------------#

def linkAPI():
    payload = sys.argv[1]
    data = json.loads(payload)
    
    output = "NaN"
    if (data["Eval"].lower() == "approximate"):
        output = approximate(data["Input"][0], data["Input"][1])
    elif (data["Eval"].lower() == "equivalent"):
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


def selectMode() -> tuple:
    inp = input("""
        Please select your mode:
        | q         ->  quit out of the application
        | simp      ->  to simplify an equation
        | sol       ->  to solve an equation
        | equiv     ->  to measure equivalence between 2 equations
        | approx    ->  to approximate 2 expressions
    """)
    
    if (inp == CMD_OPTS[0]):
        return inp, None, None
    elif (inp in CMD_OPTS[1:3]):
        return inp, input("Please enter a mathematical expression: "), None
    elif (inp in CMD_OPTS[3:]):
        exp1 = input("Please enter an expression: ")
        exp2 = input("Now enter a second expression: ")
        return inp, exp1, exp2
    else:
        return None, None, None


def execMode():
    mode, inp1, inp2 = selectMode()
    if (mode == CMD_OPTS[0]):
        return None
    elif (mode == CMD_OPTS[1]):
        return simplify(inp1)
    elif (mode == CMD_OPTS[2]):
        return simplify(inp1)
    elif (mode == CMD_OPTS[3]):
        return equivalent(inp1, inp2)
    elif (mode == CMD_OPTS[4]):
        return approximate(inp1, inp2)
    else:
        return "Please enter a valid command option."


def main():
    if (len(sys.argv) > 1):
        linkAPI()
    else:
        print(DLL_PATH)
        print(f"Exists: {os.path.exists(DLL_PATH)}")
        print(f"Size: {os.path.getsize(DLL_PATH) if os.path.exists(DLL_PATH) else 'N/A'}")
        result = execMode()
        while (result):
            print(result)
            result = execMode()
    

if __name__ == "__main__":
    main()