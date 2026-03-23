"""
Author: dev.slife
Date Created: 2/15/26
Date Updated: 3/23/26
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
    


#------------------------ API FUNCTIONS ------------------------#

def simplify(expression: str) -> str:
    result_bytes = VAST_LIB.VAST_simplify(expression.encode())
    result: str = result_bytes.decode()
    if ": " in result:
        eType = result.split(": ")[0]
        eMsg = result.split(": ")[-1]
        raise __findVASTException(eType, eMsg)
    return result_bytes.decode()

def solve(expression: str) -> str:
    result_bytes = VAST_LIB.VAST_solve_literal(expression.encode())
    result: str = result_bytes.decode()
    if ": " in result:
        eType = result.split(": ")[0]
        eMsg = result.split(": ")[-1]
        raise __findVASTException(eType, eMsg)
    return result_bytes.decode() 




if __name__ == "__main__":
    if (len(sys.argv) > 1):
        payload = sys.argv[1]
        data = json.loads(payload)
        
        output = "NaN"
        if (data["Eval"].lower() == "simplify"):
            output = simplify(data["Input"])
        elif (data["Eval"].lower() == "solve_literal"):
            output = solve(data["Input"])   
        
        output = {"answer": output}
        print(json.dumps(output))
        sys.stdout.flush()
    else:
        print(DLL_PATH)
        print(f"Exists: {os.path.exists(DLL_PATH)}")
        print(f"Size: {os.path.getsize(DLL_PATH) if os.path.exists(DLL_PATH) else 'N/A'}")
        inp = input("Please enter a mathmetical expression: ")
        result = solve(inp)
        print(result)