/**
 * Author: dev.slife
 * Date Created: 12/9/25
 * Date Updated: 1/1/26
 * Description:
 *      Provides special types of errors for the VAST system.
 */





#ifndef VASTERRORS_H
#define VASTERRORS_H


// ----------------------- LIBRARIES ----------------------- //

#include <exception>
#include <string>



// ----------------------- MAIN EXCEPTION ----------------------- //

/**
 * @brief The general exception for VASTErrors.
 */
class VASTError: public std::exception {
    protected:
        std::string message;
        std::string errorName;
        std::string fullMessage;

    public:
        explicit VASTError(const std::string& msg="An unexpected error occurred when using VAST.",
                            const std::string& name = "VASTError")
                : message(msg), errorName(name) {
                    fullMessage = errorName + ": " + message;
                }

        const char* what() const noexcept override {
            return fullMessage.c_str();
        }
};


// ----------------------- CHILD EXCEPTIONS ----------------------- //

/**
 * @brief `VASTError` for arithmetic operations that have not been established yet.
 */
class NotEstablishedYet: public VASTError {
    private:
        std::string estType;

    public:
        explicit NotEstablishedYet(const std::string& msg="Arithmetic operation not established.",
                                    const std::string& estTypeVal="")
                    : VASTError(msg, "NotEstablishedYet"), estType(estTypeVal) {}

        const char* what() const noexcept override {
            return fullMessage.c_str();
        }

        std::string getEstType() const {
            return estType;
        }
};

/**
 * @brief `VASTError` for invalid equations that are given
 */
class InvalidEquation: public VASTError {
    public:
        explicit InvalidEquation(const std::string& msg="The given equation is not valid.")
            : VASTError(msg, "InvalidEquation") {}

        const char* what() const noexcept override {
            return fullMessage.c_str();
        }
};

/**
 * @brief `VASTError` for undefined variables
 */
class UndefinedVariable: public VASTError {
    public:
        explicit UndefinedVariable(const std::string& msg="The given variable does not have an assigned value.")
            : VASTError(msg, "UndefinedVariable") {}

        const char* what() const noexcept override {
            return fullMessage.c_str();
        }
};

/**
 * @brief `VASTError` for invalid data types
 */
class InvalidType: public VASTError {
    public:
        explicit InvalidType(const std::string& msg="The given data type is invalid")
            : VASTError(msg, "InvalidType") {}

        const char* what() const noexcept override {
            return fullMessage.c_str();
        }
};



#endif