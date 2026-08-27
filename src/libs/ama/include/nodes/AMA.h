/**
 * Author: dev.slife
 * Date Created: 12/9/25
 * Date Updated: 8/27/26
 * Description:
 *      Declarations for the AMA (Base) object used for the Abstract Math Assembler.
 */





#ifndef AMA_H
#define AMA_H


// ----------------------- LIBRARIES ----------------------- //

#include "ama_error.h"
#include <stdexcept>
#include <memory>
#include <map>
#include <vector>
#include <variant>
#include <algorithm>
#include <string_view>
#include <type_traits>



// ----------------------- CONSTANT VARIABLES ----------------------- //

const char OPERATORS[8] = {'+', '-', '*', '/', '^', '=', '(', ')'};



// ----------------------- ENUMS ----------------------- //

enum Tag {
    AMA_NODE,
    NUMBER,
    VARIABLE,
    ADDITION,
    SUBTRACTION,
    MULTIPLICATION,
    DIVISION,
    EXPONENT
};



// ----------------------- STRUCTURES ----------------------- //

struct ReturnTypes {
    double num;
    std::string var;
};



// ----------------------- BASE CLASS ----------------------- //

/**
 * @brief A structured object to represent a math equation.
 */
class AMA {
    protected:
        std::unique_ptr<AMA> left;
        std::unique_ptr<AMA> right;

    public:
        virtual ~AMA() = default;
        
        virtual std::unique_ptr<AMA> clone() const = 0;
        virtual std::unique_ptr<AMA> negate() const = 0;
        virtual bool empty() const {return true;}
        virtual Tag getTag() const {return AMA_NODE;}
        virtual bool equals(const AMA& other) const = 0;
        virtual bool equivalent(const AMA& other) const = 0;
        virtual std::string getString() const {return "";}
        virtual std::string printNode() const { return "AMA()"; }
        virtual ReturnTypes getValue() const {return ReturnTypes{0.0};}
        
        Tag getBaseTag() {return AMA_NODE;}
        void setLeft(std::unique_ptr<AMA> child) {this->left = std::move(child);}
        void setRight(std::unique_ptr<AMA> child) {this->right = std::move(child);}

        AMA* getLeft() const {return this->left.get();}
        AMA* getRight() const {return this->right.get();}

        bool operator==(const AMA& other) const {return equals(other);}
        bool operator!=(const AMA& other) const {return !equals(other);}
};



// ----------------------- HELPER FUNCTIONS ----------------------- //

/**
 * @brief Checks to see if a given character is an operator.
 * 
 * @param c The given character
 * 
 * @return `true` if the character is an operator or `false` otherwise
 */
inline bool is_oper(char c) {
    size_t length = sizeof(OPERATORS) / sizeof(OPERATORS[0]);
    for (size_t i = 0; i < length; i++) {
        if (c == OPERATORS[i]) {
            return true;
        }
    }
    return false;
}


/**
 * @brief Checks to see if a given string is an operator.
 * 
 * @param s The given string
 * 
 * @return `true` if the string is an operator or `false` otherwise
 */
inline bool is_oper(std::string s) {
    size_t length = sizeof(OPERATORS) / sizeof(OPERATORS[0]);
    for (size_t i = 0; i < length; i++) {
        if (s.length() == 1 && s[0] == OPERATORS[i]) {
            return true;
        }
    }
    return false;
}


/**
 * @brief Checks to see if a given character is a decimal.
 * 
 * @param c The given character
 * 
 * @return `true` if the character is a decimal or `false` otherwise
 */
inline bool is_decimal(char c) {
    return c == '.';
}


/**
 * @brief Checks to see if a given string is a decimal.
 * 
 * @param c The given string
 * 
 * @return `true` if the string is a decimal or `false` otherwise
 */
inline bool is_decimal(std::string s) {
    return (s.length() == 1 && s[0] == '.');
}


/**
 * @brief Check for character types
 */
template <typename T>
struct is_char
    : std::disjunction<
        std::is_same<std::decay_t<T>, char>,
        std::is_same<std::decay_t<T>, signed char>,
        std::is_same<std::decay_t<T>, unsigned char>
    > {};

template <typename T>
inline constexpr bool is_char_v = is_char<T>::value;


/**
 * @brief Check for strings and characters
 */
template <typename T>
struct is_string
    : std::disjunction<
        std::is_same<std::decay_t<T>, std::string>,
        std::is_same<std::decay_t<T>, const char*>,
        std::is_same<std::decay_t<T>, char*>
    > {};

template <typename T>
inline constexpr bool is_string_v = is_string<T>::value;


/**
 * @brief Checks to see if an object has the `getTag()` method
 */
template<typename T, typename = void>
struct has_getTag : std::false_type {};

template<typename T>
struct has_getTag<T, std::void_t<decltype(std::declval<const T&>().getTag())>> : std::true_type {};

template<typename T>
inline constexpr bool has_getTag_v = has_getTag<T>::value;


/**
 * @brief Checks to see if the given items are a number.
 * 
 * @param item The variable to check
 * @param canBeNode Whether `NumNodes` should be considered or not
 * 
 * @return A boolean value, `true` if the item(s) is/are a number and `false` otherwise.
 */
template<typename T>
inline bool is_num(bool canBeNode, const T& item) {
    if (canBeNode && std::is_class_v<T>) {
        if constexpr (has_getTag_v<T>) {
            if (item.getTag() == NUMBER) {
                return true;
            }
        }
    }

    if constexpr (is_string_v<T>) {
        std::string_view sv(item);
        size_t start = (sv[0] == '+' || sv[0] == '-') ? 1: 0;
        if (sv.empty() || start == sv.size()) {
            return false;
        } else {
            bool decimal = false;
            for (size_t i = start; i < sv.size(); i++) {
                if (sv[i] == '.') {
                    if (decimal) {
                        return false;
                    }
                    decimal = true;
                } else if ((!std::isdigit(static_cast<unsigned char>(sv[i])))) {
                    return false;
                }
            }
            return true;
        }
        // Don't know why this method doesn't work...
        // return ((!sv.empty()) && (!start == sv.size()) && (std::all_of(sv.begin() + start, sv.end(), [](unsigned char c) {
        //     return std::isdigit(c);
        // })));
    } else if constexpr (is_char_v<T>) {
        return std::isdigit(static_cast<unsigned char>(item));
    }

    return false;
}

// @dontinclude Float check variadic recursion
template<typename T, typename... Args>
inline bool is_num(bool canBeNode, const T& first, const Args&... items) {
    return is_num(canBeNode, first) && is_num(canBeNode, items...);
}

// @dontinclude Float check variadic wrapper
template<typename... Args>
inline bool is_num(const Args&... args) {
    return is_num(true, args...);
}


/**
 * @brief Checks to see if the given items are a variable.
 * 
 * @param item The variable to check
 * @param canBeNode Whether VarNodes should be considered or not
 * 
 * @return A boolean value, `true` if the number(s) is/are a variable and `false` otherwise.
 */
template<typename T>
inline bool is_var(bool canBeNode, const T& item) {
    if (canBeNode && std::is_class_v<T>) {
        if constexpr (has_getTag_v<T>) {
            if (item.getTag() == VARIABLE) {
                return true;
            }
        }
    }

    if constexpr (is_string_v<T> || is_char_v<T>) {
        return (!is_num(false, item) && !is_oper(item) && !is_decimal(item));
    }
    return false;
}

// @dontinclude Var check variadic recursion
template<typename T, typename... Args>
inline bool is_var(bool canBeNode, const T& first, const Args&... items) {
    return (is_var(canBeNode, first) && is_var(canBeNode, items...));
}

// @dontinclude Var check variadic wrapper
template<typename... Args>
inline bool is_var(const Args&... args) {
    return is_var(true, args...);
}



#endif