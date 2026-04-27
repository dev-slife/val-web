/**
 * Author: dev.slife
 * Date Created: 12/9/25
 * Date Updated: 4/2/26
 * Description:
 *      Declarations for a NumNode object used by VAL's abstract syntax tree.
 */





#ifndef NUMNODE_H
#define NUMNODE_H


// ----------------------- LIBRARIES ----------------------- //

#include "nodes/VAST.h"



// ----------------------- HELPER FUNCTIONS ----------------------- //

/**
 * @brief Truncates a given number
 * 
 * @param num The given number
 * 
 * @return A string representing the truncated number
 */
inline std::string trunc_node(double num) {
    std::string str_num = std::to_string(num);
    size_t truncIndex = str_num.size();
    for (size_t i = str_num.size() - 1; i >= 0; i--) {
        if (str_num[i] != '0' && str_num[i] != '.') {break;}
        truncIndex--;
        if (str_num[i] == '.') {break;}
    }
    return str_num.substr(0, truncIndex);
}


// ----------------------- NUMNODE CLASS ----------------------- //

/**
 * @brief An object for representing numbers.
 */
class NumNode: public VAST {
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
        
        std::unique_ptr<VAST> clone() const override {
            return std::make_unique<NumNode>(this->value);
        }
        bool equals(const VAST& other) const override {
            if (const NumNode* n1 = dynamic_cast<const NumNode*>(&other)) {
                return this->value == n1->getValue().num;
            }
            return false;
        };
        bool empty() const override {return false;}
        Tag getTag() const override {return NUMBER;}
        std::string getString() const override {return trunc_node(this->value);}
        std::string printNode() const override {return "NumNode(" + std::to_string(this->value) + ")";}
        ReturnTypes getValue() const override {return ReturnTypes{this->value};}


        // ----------------------- OTHER METHODS ----------------------- //

        int getIntValue() const;
};



#endif