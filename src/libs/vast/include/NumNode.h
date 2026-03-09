/**
 * Author: dev.slife
 * Date Created: 12/9/25
 * Date Updated: 2/15/26
 * Description:
 *      Declarations for a NumNode object used by VAL's abstract syntax tree.
 */





#ifndef NUMNODE_H
#define NUMNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "VAST.h"



// ----------------------- NUMNODE CLASS ----------------------- //

/**
 * @brief An object for representing numbers.
 */
class NumNode: public VAST {
    protected:
        double value;

    public:
        // ----------------------- INITIALIZATION ----------------------- //

        NumNode(double v = 0): value(v) {}

        NumNode() = default;

        NumNode(const NumNode&) = delete;
        NumNode& operator=(const NumNode&) = delete;
        NumNode(NumNode&&) = default;
        NumNode& operator=(NumNode&&) = default;
        
        
        // ----------------------- OVERRIDE METHODS ----------------------- //
        
        std::unique_ptr<VAST> clone() const override {
            return std::make_unique<NumNode>(this->value);
        }
        bool equals(const VAST& other) const override {
            if (const NumNode* n1 = dynamic_cast<const NumNode*>(&other)) {
                return this->value == n1->getValue().num;
            }
            return false;
        };
        bool empty() const override {return false;}
        Tag getTag() const override {return NUMBER;}
        std::string getString() const override {return std::to_string(this->value);}
        std::string printNode() const override {return "NumNode(" + std::to_string(this->value) + ")";}
        ReturnTypes getValue() const override {return ReturnTypes{this->value};}


        // ----------------------- OTHER METHODS ----------------------- //

        int getIntValue() const;
};



#endif