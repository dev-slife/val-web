/**
 * Author: dev.slife
 * Date Created: 12/20/25
 * Date Updated: 2/15/26
 * Description:
 *      Declarations for a SubNode object used by VAL's abstract syntax tree.
 */





#ifndef SUBNODE_H
#define SUBNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "VAST.h"



// ----------------------- TREE NODES (LEAF BASED) ----------------------- //

/**
 * @brief An object for representing subtraction.
 */
class SubNode: public VAST {
    public:
        // ----------------------- INITIALIZATION ----------------------- //

        SubNode(std::unique_ptr<VAST> l, std::unique_ptr<VAST> r) {
            setLeft(std::move(l));
            setRight(std::move(r));
        }
    
        SubNode() = default;

        SubNode(const SubNode&) = delete;
        SubNode& operator=(const SubNode&) = delete;
        SubNode(SubNode&&) = default;
        SubNode& operator=(SubNode&&) = default;


        // ----------------------- OVERRIDE METHODS ----------------------- //

        std::unique_ptr<VAST> clone() const override {
            return std::make_unique<SubNode>(
                this->left ? this->left->clone(): nullptr,
                this->right ? this->right->clone(): nullptr
            );
        }
        bool equals(const VAST& other) const override {
            if (const SubNode* s1 = dynamic_cast<const SubNode*>(&other)) {
                return (this->getLeft() == s1->getLeft() && this->getRight() == s1->getRight());
            }
            return false;
        }
        bool empty() const override {return (!this->getLeft() || this->getLeft()->empty()) && (!this->getRight() || this->getRight()->empty());}
        Tag getTag() const override {return SUBTRACTION;}
        std::string getString() const override {return this->getLeft()->getString() + " - " + this->getRight()->getString();}
        std::string printNode() const override {return "SubNode(" + this->getLeft()->printNode() + " - " + this->getRight()->printNode() + ")";}
};


#endif