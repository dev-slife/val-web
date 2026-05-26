/**
 * Author: dev.slife
 * Date Created: 2/14/26
 * Date Updated: 4/2/26
 * Description:
 *      A class that defines how a VAST tree is built and deconstructed.
 */





#ifndef PLANTER_H
#define PLANTER_H


// ----------------------- LIBRARIES ----------------------- //

#include "VASTOperators.h"



// ----------------------- HELPER FUNCTIONS ----------------------- //

/**
 * @brief Formats a given vector as a string.
 * 
 * @param v A vector of strings
 * 
 * @return A string
 */
std::string vectorToString(std::vector<std::string> v);



// ----------------------- CLASS ----------------------- //

/**
 * @brief An object used for parsing math expressions into the `VAST` system.
 * 
 * @note Figured I would use actual planting terms for certain functions.
 */
class Planter {
    private:
        int pos;
        std::string expression;
        std::vector<std::string> seeds;

    public:
        Planter(std::string e) {
            expression = e;
            pos = 0;
        }


        // ----------------------- LEXING ----------------------- //

        /**
         * @brief Splits a string representing a mathematical expression into tokens through a process called lexxing.
         * 
         * @throw `InvalidEquation` - the given string is not a proper math equation
         */
        void sow();


        // ----------------------- PARSING ----------------------- //

        /**
         * @brief Grabs the next token.
         * 
         * @return The next token or an empty string
         */
        std::string next();

        /**
         * @brief Moves up a position and grabs the next token.
         * 
         * @return The next token
         */
        std::string deadhead();

        /**
         * @brief Parses a factor (numbers, variables, unary).
         * 
         * @return A unique VAST pointer representing the given factor
         * 
         * @throw `InvalidEquation` - missing parenthesis
         * @throw `VASTError` - an unexpected token was given or input ended improperly
         */
        std::unique_ptr<VAST> grow_factor();

        /**
         * @brief Parses an exponent -> `Planter::grow_factor()`.
         * 
         * @return A unique VAST pointer representing the given exponent
         * 
         * @note `ExpNodes` have not been coded yet, so this will throw a `NotEstablishedYet` exception if the `^` symbol is found
         */
        std::unique_ptr<VAST> grow_pow();

        /**
         * @brief Parses a given term (multiplication or division) -> `Planter::grow_pow()`.
         * 
         * @return A unique VAST pointer representing the given term
         * 
         * @note `DivNodes` have not been coded yet, so this will throw a `NotEstablishedYet` expression if the `/` symbol is found
         */
        std::unique_ptr<VAST> grow_term();

        /**
         * @brief Parses a mathematical expression (addition, subtraction) -> `Planter::grow_term()`.
         * 
         * @return A unique VAST pointer representing the given expression
         */
        std::unique_ptr<VAST> grow();


        // ----------------------- COMPILING ----------------------- //

        /**
         * @brief Compiles a given expression into the `VAST` system.
         * 
         * @return A unique VAST pointer representing the given expression
         */
        std::unique_ptr<VAST> plant();

        /**
         * @brief Decompiles a given `VAST` tree.
         * 
         * @param tree The given `VAST` tree
         * 
         * @return A vector of strings representing the given `VAST` tree
         */
        std::vector<std::string> decompose(const VAST* tree);


        // ----------------------- GET METHODS ----------------------- //

        /**
         * @brief Grabs the expression.
         * 
         * @return A string
         */
        std::string getExpression();

        /**
         * @brief Grabs the tokenized expression.
         * 
         * @return A vector of strings
         */
        std::vector<std::string> getSeeds();

        /**
         * @brief Grabs the tokenized expression as a string.
         * 
         * @return A string
         */
        std::string showSeeds();
};



#endif