"""
Author: dev.slife
Date Created: 2/15/26
Date Updated: 2/23/26
Description:
    Works with the VAST system (C++) to parse and solve math equations.
"""





#------------------------ IMPORT MODULES ------------------------#

import ctypes
import os
from .errors import *



#------------------------ CONSTANT VARIABLES ------------------------#

FILE_DIR = os.path.dirname(os.path.abspath(__file__))
DLL_PATH = os.path.join(FILE_DIR, "bin", "VAST.dll")
VAST_LIB = ctypes.CDLL(DLL_PATH)


#------------------------ DEFINE CTYPES ------------------------#

VAST_LIB.VAST_simplify.argtypes = [ctypes.c_char_p]
VAST_LIB.VAST_simplify.restype = ctypes.c_char_p



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




if __name__ == "__main__":
    print(DLL_PATH)
    print(f"Exists: {os.path.exists(DLL_PATH)}")
    print(f"Size: {os.path.getsize(DLL_PATH) if os.path.exists(DLL_PATH) else 'N/A'}")
    inp = input("Plese enter a mathmetical expression: ")
    result = simplify(inp)
    print(result)