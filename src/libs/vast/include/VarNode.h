/**
 * Author: dev.slife
 * Date Created: 12/9/25
 * Date Updated: 2/15/26
 * Description:
 *      Declarations for a VarNode object used by VAL's abstract syntax tree.
 */





#ifndef VARNODE_H
#define VARNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "VAST.h"



// ----------------------- VARNODE CLASS ----------------------- //

/**
 * @brief An object for representing variables.
 */
class VarNode: public VAST {
    protected:
        std::string value;

    public:
        // ----------------------- INITIALIZATION ----------------------- //

        VarNode(std::string variable, std::string link_variable="")
            : value((link_variable.empty()) ? variable: variable + link_variable) {}

        VarNode() = default;

        VarNode(const VarNode&) = delete;
        VarNode& operator=(const VarNode&) = delete;
        VarNode(VarNode&&) = default;
        VarNode& operator=(VarNode&&) = default;
        

        // ----------------------- SPECIAL OPERATOR "==" METHODS ----------------------- //

        bool operator==(const char c) const {
            return this->value.size() == 1 && this->value[0] == c;
        }

        
        // ----------------------- OVERRIDE METHODS ----------------------- //
        
        std::unique_ptr<VAST> clone() const override {
            return std::make_unique<VarNode>(this->value);
        }
        bool equals(const VAST& other) const override {
            if (const VarNode* v1 = dynamic_cast<const VarNode*>(&other)) {
                if (v1->getValue().var.size() == this->value.size()) {
                    for (char &c: v1->getValue().var) {
                        if (this->value.find(c) == std::string::npos) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        bool empty() const override {return this->value.empty();}
        Tag getTag() const override {return VARIABLE;}
        std::string getString() const override {return this->value;}
        std::string printNode() const override {return "VarNode(" + this->value + ")";}
        ReturnTypes getValue() const override {return ReturnTypes{NULL, this->value};}

};


#endif