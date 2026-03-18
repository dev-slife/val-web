/**
 * Author: dev.slife
 * Date Created: 12/31/25
 * Date Updated: 2/15/26
 * Description:
 *      Declarations for a MulNode object used by VAL's abstract syntax tree.
 */





#ifndef MULNODE_H
#define MULNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "VAST.h"



// ----------------------- TREE NODES (LEAF BASED) ----------------------- //

/**
 * @brief An object for representing multiplication.
 */
class MulNode: public VAST {
    public:
        // ----------------------- INITIALIZATION ----------------------- //

        MulNode(std::unique_ptr<VAST> l, std::unique_ptr<VAST> r) {
            setLeft(std::move(l));
            setRight(std::move(r));
        }
    
        MulNode() = default;

        MulNode(const MulNode&) = delete;
        MulNode& operator=(const MulNode&) = delete;
        MulNode(MulNode&&) = default;
        MulNode& operator=(MulNode&&) = default;


        // ----------------------- OVERRIDE METHODS ----------------------- //

        std::unique_ptr<VAST> clone() const override {
            return std::make_unique<MulNode>(
                this->left ? this->left->clone(): nullptr,
                this->right ? this->right->clone(): nullptr
            );
        }
        bool equals(const VAST& other) const override {
            if (const MulNode* m1 = dynamic_cast<const MulNode*>(&other)) {
                return (this->getLeft() == m1->getLeft() && this->getRight() == m1->getRight());
            }
            return false;
        }
        bool empty() const override {return (!this->getLeft() || this->getLeft()->empty()) && (!this->getRight() || this->getRight()->empty());}
        Tag getTag() const override {return MULTIPLICATION;}
        std::string getString() const override {return this->getLeft()->getString() + " * " + this->getRight()->getString();}
        std::string printNode() const override {return "MulNode(" + this->getLeft()->printNode() + " * " + this->getRight()->printNode() + ")";}
};


#endif