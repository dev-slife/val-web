"""
Author: dev.slife
Date Created: 10/30/25
Date Updated: 2/23/26
Description:
    Provides special types of errors for the VAST system.
"""





#------------------------ CUSTOM EXCEPTIONS ------------------------#

class VASTError(Exception):
    """Custom Exception for VAST errors."""
    def __init__(self, msg="An unexpected error occurred when using VAST."):
        self.message = msg
        self.name = "VASTError"
        super().__init__(self.message)
        
    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()
        
class NotEstablishedYet(VASTError):
    """VASTError for functions or objects that haven't been established yet."""
    def __init__(self, msg="Arithmetic operation not established.", estType=None):
        super().__init__(msg)
        if estType: self.estType = estType
        self.name = "NotEstablishedYet"
        
    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()
    
class InvalidEquation(VASTError):
    """VASTError for invalid equations that are given."""
    def __init__(self, msg="The given equation is not valid."):
        super().__init__(msg)
        self.name = "InvalidEquation"
        
    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()
    
class UndefinedVariable(VASTError):
    """VASTError for undefined variables."""
    def __init__(self, msg="The given variable does not have an assigned value."):
        super().__init__(msg)
        self.name = "UndefinedVariable"
        
    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()
    
class InvalidType(VASTError):
    """VASTError for invalid data types that are given."""
    def __init__(self, msg="The given data type is invalid."):
        super().__init__(msg)
        self.name = "InvalidType"
        
    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()