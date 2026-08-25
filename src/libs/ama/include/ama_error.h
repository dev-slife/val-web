/**
 * Author: dev.slife
 * Date Created: 12/9/25
 * Date Updated: 8/20/26
 * Description:
 *      Provides special types of errors for AMA.
 */





#ifndef AMA_ERROR_H
#define AMA_ERROR_H


// ----------------------- LIBRARIES ----------------------- //

#include <exception>
#include <string>



// ----------------------- MAIN EXCEPTION ----------------------- //

/**
 * @brief The general exception for AMA errors.
 */
class ama_error: public std::exception {
    protected:
        std::string message;
        std::string errorName;
        std::string fullMessage;

    public:
        explicit ama_error(const std::string& msg="An unexpected error occurred when using AMA.",
                            const std::string& name = "ama_error")
                : message(msg), errorName(name) {
                    fullMessage = errorName + ": " + message;
                }

        const char* what() const noexcept override {
            return fullMessage.c_str();
        }
};


// ----------------------- CHILD EXCEPTIONS ----------------------- //

/**
 * @brief `ama_error` for arithmetic operations that have not been established yet.
 */
class not_established: public ama_error {
    private:
        std::string estType;

    public:
        explicit not_established(const std::string& msg="Arithmetic operation not established.",
                                    const std::string& estTypeVal="")
                    : ama_error(msg, "not_established"), estType(estTypeVal) {}

        const char* what() const noexcept override {
            return fullMessage.c_str();
        }

        std::string getEstType() const {
            return estType;
        }
};

/**
 * @brief `ama_error` for invalid equations that are given
 */
class invalid_equation: public ama_error {
    public:
        explicit invalid_equation(const std::string& msg="The given equation is not valid.")
            : ama_error(msg, "invalid_equation") {}

        const char* what() const noexcept override {
            return fullMessage.c_str();
        }
};

/**
 * @brief `ama_error` for undefined variables
 */
class undefined_variable: public ama_error {
    public:
        explicit undefined_variable(const std::string& msg="The given variable does not have an assigned value.")
            : ama_error(msg, "undefined_variable") {}

        const char* what() const noexcept override {
            return fullMessage.c_str();
        }
};

/**
 * @brief `ama_error` for invalid data types
 */
class invalid_type: public ama_error {
    public:
        explicit invalid_type(const std::string& msg="The given data type is invalid")
            : ama_error(msg, "invalid_type") {}

        const char* what() const noexcept override {
            return fullMessage.c_str();
        }
};



#endif