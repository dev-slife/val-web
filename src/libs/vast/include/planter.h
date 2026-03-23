/**
 * Author: dev.slife
 * Date Created: 2/14/26
 * Date Updated: 2/15/26
 * Description:
 *      A class that defines how a VAST tree is built and deconstructed.
 */





#ifndef PLANTER_H
#define PLANTER_H


// ----------------------- LIBRARIES ----------------------- //

#include "VASTOperators.h"



// ----------------------- CONSTANT VARIABLES ----------------------- //

extern std::vector<char> SIGNS;



// ----------------------- HELPER FUNCTIONS ----------------------- //

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

        // @dontinclude Lexing
        void sow();

        // @dontinclude Parsing
        std::string next();
        std::string deadhead();

        std::unique_ptr<VAST> grow_factor();
        std::unique_ptr<VAST> grow_pow();
        std::unique_ptr<VAST> grow_term();
        std::unique_ptr<VAST> grow();

        // @dontinclude Compiling
        std::unique_ptr<VAST> plant();
        std::vector<std::string> decompose(const VAST* tree);

        // @dontinclude Get
        std::string getExpression();
        std::vector<std::string> getSeeds();
        std::string showSeeds();
};



#endif