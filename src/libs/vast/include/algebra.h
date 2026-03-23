/**
 * Author: dev.slife
 * Date Created: 1/4/26
 * Date Updated: 3/18/26
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

std::unique_ptr<VAST> arrange(const VAST* node);
std::unique_ptr<VAST> evaluate(const VAST* node, std::map<std::string, double> context={});
std::unique_ptr<VAST> simplify(const VAST* node, std::map<std::string, double> context={});



#endif