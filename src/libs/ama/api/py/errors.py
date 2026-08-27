"""
Author: dev.slife
Date Created: 10/30/25
Date Updated: 8/20/26
Description:
    Provides special types of errors for AMA.
"""





#------------------------ CUSTOM EXCEPTIONS ------------------------#

class AMAError(Exception):
    """Custom Exception for AMA errors."""
    def __init__(self, msg="An unexpected error occurred when using AMA."):
        self.message = msg
        self.name = "AMAError"
        super().__init__(self.message)
        
    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()
        
class NotEstablishedYet(AMAError):
    """AMAError for functions or objects that haven't been established yet."""
    def __init__(self, msg="Arithmetic operation not established.", estType=None):
        super().__init__(msg)
        if estType: self.estType = estType
        self.name = "NotEstablishedYet"
        
    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()
    
class InvalidEquation(AMAError):
    """AMAError for invalid equations that are given."""
    def __init__(self, msg="The given equation is not valid."):
        super().__init__(msg)
        self.name = "InvalidEquation"
        
    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()
    
class UndefinedVariable(AMAError):
    """AMAError for undefined variables."""
    def __init__(self, msg="The given variable does not have an assigned value."):
        super().__init__(msg)
        self.name = "UndefinedVariable"
        
    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()
    
class InvalidType(AMAError):
    """AMAError for invalid data types that are given."""
    def __init__(self, msg="The given data type is invalid."):
        super().__init__(msg)
        self.name = "InvalidType"
        
    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()