/**
 * Author: dev.slife
 * Date Created: 12/9/25
 * Date Updated: 8/20/26
 * Description:
 *      Declarations for an AddNode object used by AMA.
 */





#ifndef ADDNODE_H
#define ADDNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "nodes/AMA.h"



// ----------------------- TREE NODES (LEAF BASED) ----------------------- //

/**
 * @brief An object for representing addition.
 */
class AddNode: public AMA {
    public:
        // ----------------------- INITIALIZATION ----------------------- //

        AddNode(std::unique_ptr<AMA> l, std::unique_ptr<AMA> r) {
            setLeft(std::move(l));
            setRight(std::move(r));
        }
    
        AddNode() = default;

        AddNode(const AddNode&) = delete;
        AddNode& operator=(const AddNode&) = delete;
        AddNode(AddNode&&) = default;
        AddNode& operator=(AddNode&&) = default;


        // ----------------------- OVERRIDE METHODS ----------------------- //

        /**
         * @brief A cloned version of the AddNode.
         * 
         * @return A AMA object representing the AddNode's clone
         */
        std::unique_ptr<AMA> clone() const override;

        /**
         * @brief Performs negation on the AddNode.
         * 
         * @return A new AMA pointer representing the negated AddNode
         */
        std::unique_ptr<AMA> negate() const override;

        /**
         * @brief Checks if another node is equal (the exact same) as the AddNode object.
         * 
         * @param other the other AMA node
         * 
         * @return `true` if they are equal and `false` otherwise
         */
        bool equals(const AMA& other) const override;

        /**
         * @brief Checks if another node is equivalent to the AddNode object.
         * 
         * @param other the other AMA node
         * 
         * @return `true` if they are equivalent and `false` otherwise
         */
        bool equivalent(const AMA& other) const override;

        /**
         * @brief Checks to see if there are no left and right leaves.
         * 
         * @return `true` if no leaves are present and `false` otherwise
         */
        bool empty() const override;

        /**
         * @brief Grabs the tag of the AddNode
         * 
         * @return The ENUM 'ADDITION'
         */
        Tag getTag() const override;

        /**
         * @brief Gives the string representation of the AddNode.
         * 
         * @return A string representing the AddNode
         */
        std::string getString() const override;

        /**
         * @brief Gives the formal representation of the AddNode.
         * 
         * @return A string representing the AddNode
         */
        std::string printNode() const override;
};


#endif