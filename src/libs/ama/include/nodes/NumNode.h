/**
 * Author: dev.slife
 * Date Created: 12/9/25
 * Date Updated: 8/20/26
 * Description:
 *      Declarations for a NumNode object used by AMA.
 */





#ifndef NUMNODE_H
#define NUMNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "nodes/AMA.h"



// ----------------------- HELPER FUNCTIONS ----------------------- //

/**
 * @brief Truncates a given number
 * 
 * @param num The given number
 * 
 * @return A string representing the truncated number
 */
std::string trunc_node(double num);


// ----------------------- NUMNODE CLASS ----------------------- //

/**
 * @brief An object for representing numbers.
 */
class NumNode: public AMA {
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
        
        /**
         * @brief A cloned version of the NumNode.
         * 
         * @return A AMA object representing the NumNode's clone
         */
        std::unique_ptr<AMA> clone() const override;
        
        /**
         * @brief Grabs the NumNodes value
         * 
         * @return A ReturnType object containing the value
         */
        ReturnTypes getValue() const override;

        /**
         * @brief Performs negation on the NumNode.
         * 
         * @return A new AMA pointer representing the negated NumNode
         */
        std::unique_ptr<AMA> negate() const override;

        /**
         * @brief Checks if another node is equal (the exact same) as the NumNode object.
         * 
         * @param other the other AMA node
         * 
         * @return `true` if they are equal and `false` otherwise
         */
        bool equals(const AMA& other) const override;

        /**
         * @brief Checks if another node is equivalent to the NumNode object.
         * 
         * @param other the other AMA node
         * 
         * @return `true` if they are equivalent and `false` otherwise
         */
        bool equivalent(const AMA& other) const override;

        // NumNodes always contain a value, therefore this returns false.
        bool empty() const override;
        
        /**
         * @brief Grabs the tag of the NumNode
         * 
         * @return The ENUM 'NUMBER'
         */
        Tag getTag() const override;

        /**
         * @brief Gives the string representation of the NumNode.
         * 
         * @return A string representing the NumNode
         */
        std::string getString() const override;

        /**
         * @brief Gives the formal representation of the NumNode.
         * 
         * @return A string representing the NumNode
         */
        std::string printNode() const override;


        // ----------------------- OTHER METHODS ----------------------- //

        /**
         * @brief Gives an integer version of the NumNode's value.
         * 
         * @return An integer representing the NumNode's value
         */
        int getIntValue() const;
};



#endif