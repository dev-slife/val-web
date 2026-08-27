/**
 * Author: dev.slife
 * Date Created: 12/31/25
 * Date Updated: 8/20/26
 * Description:
 *      Declarations for a MulNode object used by AMA.
 */





#ifndef MULNODE_H
#define MULNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "nodes/AMA.h"



// ----------------------- TREE NODES (LEAF BASED) ----------------------- //

/**
 * @brief An object for representing multiplication.
 */
class MulNode: public AMA {
    public:
        // ----------------------- INITIALIZATION ----------------------- //

        MulNode(std::unique_ptr<AMA> l, std::unique_ptr<AMA> r) {
            setLeft(std::move(l));
            setRight(std::move(r));
        }
    
        MulNode() = default;

        MulNode(const MulNode&) = delete;
        MulNode& operator=(const MulNode&) = delete;
        MulNode(MulNode&&) = default;
        MulNode& operator=(MulNode&&) = default;


        // ----------------------- OVERRIDE METHODS ----------------------- //

        /**
         * @brief A cloned version of the MulNode.
         * 
         * @return A AMA object representing the MulNode's clone
         */
        std::unique_ptr<AMA> clone() const override;

        /**
         * @brief Performs negation on the MulNode.
         * 
         * @return A new AMA pointer representing the negated MulNode
         */
        std::unique_ptr<AMA> negate() const override;

        /**
         * @brief Checks if another node is equal (the exact same) as the MulNode object.
         * 
         * @param other the other AMA node
         * 
         * @return `true` if they are equal and `false` otherwise
         */
        bool equals(const AMA& other) const override;

        /**
         * @brief Checks if another node is equivalent to the MulNode object.
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
         * @brief Grabs the tag of the MulNode
         * 
         * @return The ENUM 'MULTIPLICATION'
         */
        Tag getTag() const override;

        /**
         * @brief Gives the string representation of the MulNode.
         * 
         * @return A string representing the MulNode
         */
        std::string getString() const override;

        /**
         * @brief Gives the formal representation of the MulNode.
         * 
         * @return A string representing the MulNode
         */
        std::string printNode() const override;
};


#endif