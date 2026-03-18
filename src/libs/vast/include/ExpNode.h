/**
 * Author: dev.slife
 * Date Created: 2/11/26
 * Date Updated: 2/15/26
 * Description:
 *      Declarations for an ExpNode object used by VAL's abstract syntax tree.
 */





#ifndef EXPNODE_H
#define EXPNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "VAST.h"



// ----------------------- TREE NODES (LEAF BASED) ----------------------- //

/**
 * @brief An object for representing exponents.
 */
class ExpNode: public VAST {
    public:
        // ----------------------- INITIALIZATION ----------------------- //

        ExpNode(std::unique_ptr<VAST> l, std::unique_ptr<VAST> r) {
            setLeft(std::move(l));
            setRight(std::move(r));
        }
    
        ExpNode() = default;

        ExpNode(const ExpNode&) = delete;
        ExpNode& operator=(const ExpNode&) = delete;
        ExpNode(ExpNode&&) = default;
        ExpNode& operator=(ExpNode&&) = default;


        // ----------------------- OVERRIDE METHODS ----------------------- //

        std::unique_ptr<VAST> clone() const override {
            return std::make_unique<ExpNode>(
                this->left ? this->left->clone(): nullptr,
                this->right ? this->right->clone(): nullptr
            );
        }
        bool equals(const VAST& other) const override {
            if (const ExpNode* e1 = dynamic_cast<const ExpNode*>(&other)) {
                return (this->getLeft() == e1->getLeft() && this->getRight() == e1->getRight());
            }
            return false;
        }
        bool empty() const override {return (!this->getLeft() || this->getLeft()->empty()) && (!this->getRight() || this->getRight()->empty());}
        Tag getTag() const override {return EXPONENT;}
        std::string getString() const override {return this->getLeft()->getString() + " ^ " + this->getRight()->getString();}
        std::string printNode() const override {return "ExpNode(" + this->getLeft()->printNode() + " ^ " + this->getRight()->printNode() + ")";}
};


#endif