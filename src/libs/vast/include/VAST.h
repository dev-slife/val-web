/**
 * Author: dev.slife
 * Date Created: 12/9/25
 * Date Updated: 2/15/26
 * Description:
 *      Declarations for the VAST (Base) object used by VAL's abstract syntax tree.
 */





#ifndef VAST_H
#define VAST_H


// ----------------------- LIBRARIES ----------------------- //

#include "VASTErrors.h"
#include <stdexcept>
#include <memory>
#include <map>
#include <vector>
#include <variant>
#include <type_traits>



// ----------------------- CONSTANT VARIABLES ----------------------- //

const char OPERATORS[8] = {'+', '-', '*', '/', '^', '=', '(', ')'};



// ----------------------- ENUMS ----------------------- //

enum Tag {
    VAST_NODE,
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
class VAST {
    public:
        virtual ~VAST() = default;
        
        virtual std::unique_ptr<VAST> clone() const = 0;
        virtual bool empty() const {return true;}
        virtual Tag getTag() const {return VAST_NODE;}
        virtual bool equals(const VAST& other) const = 0;
        virtual std::string getString() const {return "";}
        virtual std::string printNode() const { return "VAST()"; }
        virtual ReturnTypes getValue() const {return ReturnTypes{0.0};}
        
        Tag getBaseTag() {return VAST_NODE;}
        void setLeft(std::unique_ptr<VAST> child) {left = std::move(child);}
        void setRight(std::unique_ptr<VAST> child) {right = std::move(child);}

        VAST* getLeft() const {return left.get();}
        VAST* getRight() const {return right.get();}

        bool operator==(const VAST& other) const {return equals(other);}
        bool operator!=(const VAST& other) const {return !equals(other);}

    protected:
        std::unique_ptr<VAST> left;
        std::unique_ptr<VAST> right;
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


// template<typename... Ts>
// inline std::string getStringFromVariant(const std::variant<Ts...>& var) {
//     return std::visit([](const auto& obj) -> std::string {
//         if constexpr (std::is_base_of_v<VAST, std::decay_t<decltype(obj)>>) {
//             return obj.getString();
//         }
//         throw InvalidType("Expected VAST object, but got a different type.");
//     }, var);
// }

/**
 * @brief Check for strings and characters
 */
template <typename T>
struct is_string
    : std::disjunction<
          std::is_same<std::decay_t<T>, std::string>,
          std::is_same<std::decay_t<T>, const char*>,
          std::is_same<std::decay_t<T>, char*>,
          std::is_same<std::decay_t<T>, char>,
          std::is_same<std::decay_t<T>, signed char>,
          std::is_same<std::decay_t<T>, unsigned char>
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
        try {
            // convert character to string if needed
            std::string s;
            if constexpr (std::is_arithmetic_v<std::decay_t<decltype(item)>>) {
                s = std::string(1, static_cast<char>(item));
            } else {
                s = std::forward<decltype(item)>(item);
            }

            size_t idx = 0;
            double number = std::stod(s, &idx);
            return idx == s.size();
        } catch (const std::invalid_argument&) {
            return false;
        } catch (const std::out_of_range&) {
            return false;
        }
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

    if constexpr (is_string_v<T>) {
        return (!is_num(false, item) && !is_oper(item) && !is_decimal(item));
    }
    return false;
}

// @dontinclude Var check variadic recursion
template<typename T, typename... Args>
inline bool is_var(bool canBeNode, bool mustEq, const T& first, const Args&... items) {
    return ((!mustEq || (mustEq && ((first == items) && ...))) && is_var(canBeNode, first) && is_var(canBeNode, items...));
}

// @dontinclude Var check variadic wrapper
template<typename... Args>
inline bool is_var(const Args&... args) {
    return is_var(true, args...);
}



#endif