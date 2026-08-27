/**
 * Author: dev.slife
 * Date Created: 12/9/25
 * Date Updated: 8/20/26
 * Description:
 *      Declarations for a VarNode object used by AMA.
 */





#ifndef VARNODE_H
#define VARNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "nodes/AMA.h"



// ----------------------- VARNODE CLASS ----------------------- //

/**
 * @brief An object for representing variables.
 */
class VarNode: public AMA {
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
        
        /**
         * @brief A cloned version of the VarNode.
         * 
         * @return A AMA object representing the VarNode's clone
         */
        std::unique_ptr<AMA> clone() const override;

        /**
         * @brief Grabs the VarNodes value
         * 
         * @return A ReturnType object containing the value
         */
        ReturnTypes getValue() const override;
        
        /**
         * @brief Performs negation on the VarNode.
         * 
         * @return A new AMA pointer representing the negated VarNode
         */
        std::unique_ptr<AMA> negate() const override;

        /**
         * @brief Checks if another node is equal (the exact same) as the VarNode object.
         * 
         * @param other the other AMA node
         * 
         * @return `true` if they are equal and `false` otherwise
         */
        bool equals(const AMA& other) const override;

        /**
         * @brief Checks if another node is equivalent to the VarNode object.
         * 
         * @param other the other AMA node
         * 
         * @return `true` if they are equivalent and `false` otherwise
         */
        bool equivalent(const AMA& other) const override;

        // VarNodes always contain a value, therefore this returns false.
        bool empty() const override;

        /**
         * @brief Grabs the tag of the VarNode
         * 
         * @return The ENUM 'VARIABLE'
         */
        Tag getTag() const override;

        /**
         * @brief Gives the string representation of the VarNode.
         * 
         * @return A string representing the VarNode
         */
        std::string getString() const override;

        /**
         * @brief Gives the formal representation of the VarNode.
         * 
         * @return A string representing the VarNode
         */
        std::string printNode() const override;

};


#endif