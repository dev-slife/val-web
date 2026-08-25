/**
 * Author: dev.slife
 * Date Created: 2/11/26
 * Date Updated: 8/20/26
 * Description:
 *      Declarations for an ExpNode object used by AMA.
 */





#ifndef EXPNODE_H
#define EXPNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "nodes/AMA.h"



// ----------------------- TREE NODES (LEAF BASED) ----------------------- //

/**
 * @brief An object for representing exponents.
 */
class ExpNode: public AMA {
    public:
        // ----------------------- INITIALIZATION ----------------------- //

        ExpNode(std::unique_ptr<AMA> l, std::unique_ptr<AMA> r) {
            setLeft(std::move(l));
            setRight(std::move(r));
        }
    
        ExpNode() = default;

        ExpNode(const ExpNode&) = delete;
        ExpNode& operator=(const ExpNode&) = delete;
        ExpNode(ExpNode&&) = default;
        ExpNode& operator=(ExpNode&&) = default;


        // ----------------------- OVERRIDE METHODS ----------------------- //

        /**
         * @brief A cloned version of the ExpNode.
         * 
         * @return A AMA object representing the ExpNode's clone
         */
        std::unique_ptr<AMA> clone() const override;

        /**
         * @brief Performs negation on the ExpNode.
         * 
         * @return A new AMA pointer representing the negated ExpNode
         */
        std::unique_ptr<AMA> negate() const override;

        /**
         * @brief Checks if another node is equal (the exact same) as the ExpNode object.
         * 
         * @param other the other AMA node
         * 
         * @return `true` if they are equal and `false` otherwise
         */
        bool equals(const AMA& other) const override;

        /**
         * @brief Checks if another node is equivalent to the ExpNode object.
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
         * @brief Grabs the tag of the ExpNode
         * 
         * @return The ENUM 'EXPONENT'
         */
        Tag getTag() const override;

        /**
         * @brief Gives the string representation of the ExpNode.
         * 
         * @return A string representing the ExpNode
         */
        std::string getString() const override;

        /**
         * @brief Gives the formal representation of the ExpNode.
         * 
         * @return A string representing the ExpNode
         */
        std::string printNode() const override;
};


#endif