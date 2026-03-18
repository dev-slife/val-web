/**
 * Author: dev.slife
 * Date Created: 12/9/25
 * Date Updated: 1/3/26
 * Description:
 *      Declarations for an AddNode object used by VAL's abstract syntax tree.
 */





#ifndef ADDNODE_H
#define ADDNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "VAST.h"



// ----------------------- TREE NODES (LEAF BASED) ----------------------- //

/**
 * @brief An object for representing addition.
 */
class AddNode: public VAST {
    public:
        // ----------------------- INITIALIZATION ----------------------- //

        AddNode(std::unique_ptr<VAST> l, std::unique_ptr<VAST> r) {
            setLeft(std::move(l));
            setRight(std::move(r));
        }
    
        AddNode() = default;

        AddNode(const AddNode&) = delete;
        AddNode& operator=(const AddNode&) = delete;
        AddNode(AddNode&&) = default;
        AddNode& operator=(AddNode&&) = default;


        // ----------------------- OVERRIDE METHODS ----------------------- //

        std::unique_ptr<VAST> clone() const override {
            return std::make_unique<AddNode>(
                this->left ? this->left->clone(): nullptr,
                this->right ? this->right->clone(): nullptr
            );
        }
        bool equals(const VAST& other) const override {
            if (const AddNode* a1 = dynamic_cast<const AddNode*>(&other)) {
                return (this->getLeft() == a1->getLeft() && this->getRight() == a1->getRight());
            }
            return false;
        }
        bool empty() const override {return (!this->getLeft() || this->getLeft()->empty()) && (!this->getRight() || this->getRight()->empty());}
        Tag getTag() const override {return ADDITION;}
        std::string getString() const override {return this->getLeft()->getString() + " + " + this->getRight()->getString();}
        std::string printNode() const override {return "AddNode(" + this->getLeft()->printNode() + " + " + this->getRight()->printNode() + ")";}
};


#endif