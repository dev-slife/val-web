/**
 * Author: dev.slife
 * Date Created: 12/20/25
 * Date Updated: 8/20/26
 * Description:
 *      Declarations for a SubNode object used by AMA.
 */





#ifndef SUBNODE_H
#define SUBNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "nodes/AMA.h"



// ----------------------- TREE NODES (LEAF BASED) ----------------------- //

/**
 * @brief An object for representing subtraction.
 */
class SubNode: public AMA {
    public:
        // ----------------------- INITIALIZATION ----------------------- //

        SubNode(std::unique_ptr<AMA> l, std::unique_ptr<AMA> r) {
            setLeft(std::move(l));
            setRight(std::move(r));
        }
    
        SubNode() = default;

        SubNode(const SubNode&) = delete;
        SubNode& operator=(const SubNode&) = delete;
        SubNode(SubNode&&) = default;
        SubNode& operator=(SubNode&&) = default;


        // ----------------------- OVERRIDE METHODS ----------------------- //

        /**
         * @brief A cloned version of the SubNode.
         * 
         * @return A AMA object representing the SubNode's clone
         */
        std::unique_ptr<AMA> clone() const override;

        /**
         * @brief Performs negation on the SubNode.
         * 
         * @return A new AMA pointer representing the negated SubNode
         */
        std::unique_ptr<AMA> negate() const override;

        /**
         * @brief Checks if another node is equal (the exact same) as the SubNode object.
         * 
         * @param other the other AMA node
         * 
         * @return `true` if they are equal and `false` otherwise
         */
        bool equals(const AMA& other) const override;

        /**
         * @brief Checks if another node is equivalent to the SubNode object.
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
         * @brief Grabs the tag of the SubNode
         * 
         * @return The ENUM 'SUBTRACTION'
         */
        Tag getTag() const override;

        /**
         * @brief Gives the string representation of the SubNode.
         * 
         * @return A string representing the SubNode
         */
        std::string getString() const override;

        /**
         * @brief Gives the formal representation of the SubNode.
         * 
         * @return A string representing the SubNode
         */
        std::string printNode() const override;
};


#endif