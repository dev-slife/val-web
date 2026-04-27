/**
 * Author: dev.slife
 * Date Created: 1/4/26
 * Date Updated: 3/23/26
 * Description:
 *      Algebra declarations used by VAL's abstract syntax tree.
 */





#ifndef ALGEBRA_H
#define ALGEBRA_H


// ----------------------- LIBRARIES ----------------------- //

#include "VASTOperators.h"



// ----------------------- STRUCTURES ----------------------- //

struct FlatTerm {
    std::string variable;
    double number;
    Tag type;
    bool isFlipped;
    size_t complexIndex = -1;

    FlatTerm& operator+=(const FlatTerm& other) {
        this->number += other.number;
        this->variable = other.variable;
        this->type = other.type;
        this->isFlipped = other.isFlipped;
        this->complexIndex = other.complexIndex;
        return *this;
    }

    FlatTerm operator+(const FlatTerm& other) const {
        return {
            this->variable,
            this->number + other.number,
            this->type,
            this->isFlipped,
            this->complexIndex
        };
    }

    std::string display() {
        return (this->isFlipped) ? 
            this->variable + std::to_string(this->number):
            std::to_string(this->number) + this->variable;
    }
};



// ----------------------- FUNCTIONS ----------------------- //

/**
 * @brief Evaluates a given expression.
 * 
 * @param node the expression to evaluate
 * @param context a context map for assigning values to variables
 * 
 * @return A unique VAST pointer of the evauluated expression
 * 
 * @throw `UndefinedVariable` - a variable is present and no context is given
 * (Use `simplify()` if you want to shorten an expression)
 */
std::unique_ptr<VAST> evaluate(const VAST* node, std::map<std::string, double> context={});


/**
 * @brief Simplifies a given expression.
 * 
 * @param node the expression to evaluate
 * @param context a context map for assigning values to variables
 * 
 * @return A unique VAST pointer of the simplified expression
 */
std::unique_ptr<VAST> simplify(const VAST* node, std::map<std::string, double> context={});


/**
 * @brief Solves a given expression if it is a literal formula (only one variable and no exponents).
 * 
 * @param node the expression to solve
 * @param context a context map for assigning values to variables
 * 
 * @throw an InvalidEquation exception if the given equation is not a literal formula
 * 
 * @return A string representing the answer
 */
std::string solve_literal(const VAST* node, std::map<std::string, double> context={});



#endif