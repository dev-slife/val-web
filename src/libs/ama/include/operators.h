/**
 * Author: dev.slife
 * Date Created: 12/11/25
 * Date Updated: 8/20/26
 * Description:
 *      Manages operators used by AMA.
 */





#ifndef OPERATORS_H
#define OPERATORS_H


// ----------------------- LIBRARIES ----------------------- //

#include "nodes/AMA.h"
#include "nodes/NumNode.h"
#include "nodes/VarNode.h"
#include "nodes/AddNode.h"
#include "nodes/SubNode.h"
#include "nodes/MulNode.h"
#include "nodes/ExpNode.h"



// ----------------------- COMPARE METHOD ----------------------- //

bool compareNodes(std::vector<AMA*> nodes);


// ----------------------- ADDITION METHODS ----------------------- //

// @dontinclude NumNode
std::unique_ptr<AMA> operator+(const NumNode& left, const NumNode& right);
std::unique_ptr<AMA> operator+(const NumNode& left, const VarNode& right);
std::unique_ptr<AMA> operator+(const NumNode& left, const AddNode& right);
std::unique_ptr<AMA> operator+(const NumNode& left, const SubNode& right);
std::unique_ptr<AMA> operator+(const NumNode& left, const MulNode& right);
std::unique_ptr<AMA> operator+(const NumNode& left, const ExpNode& right);

// @dontinclude VarNode
std::unique_ptr<AMA> operator+(const VarNode& left, const NumNode& right);
std::unique_ptr<AMA> operator+(const VarNode& left, const VarNode& right);
std::unique_ptr<AMA> operator+(const VarNode& left, const AddNode& right);
std::unique_ptr<AMA> operator+(const VarNode& left, const SubNode& right);
std::unique_ptr<AMA> operator+(const VarNode& left, const MulNode& right);
std::unique_ptr<AMA> operator+(const VarNode& left, const ExpNode& right);

// @dontinclude AddNode
std::unique_ptr<AMA> operator+(const AddNode& left, const NumNode& right);
std::unique_ptr<AMA> operator+(const AddNode& left, const VarNode& right);
std::unique_ptr<AMA> operator+(const AddNode& left, const AddNode& right);
std::unique_ptr<AMA> operator+(const AddNode& left, const SubNode& right);
std::unique_ptr<AMA> operator+(const AddNode& left, const MulNode& right);
std::unique_ptr<AMA> operator+(const AddNode& left, const ExpNode& right);

// @dontinclude SubNode
std::unique_ptr<AMA> operator+(const SubNode& left, const NumNode& right);
std::unique_ptr<AMA> operator+(const SubNode& left, const VarNode& right);
std::unique_ptr<AMA> operator+(const SubNode& left, const AddNode& right);
std::unique_ptr<AMA> operator+(const SubNode& left, const SubNode& right);
std::unique_ptr<AMA> operator+(const SubNode& left, const MulNode& right);
std::unique_ptr<AMA> operator+(const SubNode& left, const ExpNode& right);

// @dontinclude MulNode
std::unique_ptr<AMA> operator+(const MulNode& left, const NumNode& right);
std::unique_ptr<AMA> operator+(const MulNode& left, const VarNode& right);
std::unique_ptr<AMA> operator+(const MulNode& left, const AddNode& right);
std::unique_ptr<AMA> operator+(const MulNode& left, const SubNode& right);
std::unique_ptr<AMA> operator+(const MulNode& left, const MulNode& right);
std::unique_ptr<AMA> operator+(const MulNode& left, const ExpNode& right);

// @dontinclude Dynamic AMA Catch
std::unique_ptr<AMA> operator+(const AMA& lhs, const AMA& rhs);


// ----------------------- SUBTRACTION METHODS ----------------------- //

// @dontinclude NumNode
std::unique_ptr<AMA> operator-(const NumNode& left, const NumNode& right);
std::unique_ptr<AMA> operator-(const NumNode& left, const VarNode& right);
std::unique_ptr<AMA> operator-(const NumNode& left, const AddNode& right);
std::unique_ptr<AMA> operator-(const NumNode& left, const SubNode& right);
std::unique_ptr<AMA> operator-(const NumNode& left, const MulNode& right);
std::unique_ptr<AMA> operator-(const NumNode& left, const ExpNode& right);

// @dontinclude VarNode
std::unique_ptr<AMA> operator-(const VarNode& left, const NumNode& right);
std::unique_ptr<AMA> operator-(const VarNode& left, const VarNode& right);
std::unique_ptr<AMA> operator-(const VarNode& left, const AddNode& right);
std::unique_ptr<AMA> operator-(const VarNode& left, const SubNode& right);
std::unique_ptr<AMA> operator-(const VarNode& left, const MulNode& right);
std::unique_ptr<AMA> operator-(const VarNode& left, const ExpNode& right);

// @dontinclude AddNode
std::unique_ptr<AMA> operator-(const AddNode& left, const NumNode& right);
std::unique_ptr<AMA> operator-(const AddNode& left, const VarNode& right);
std::unique_ptr<AMA> operator-(const AddNode& left, const AddNode& right);
std::unique_ptr<AMA> operator-(const AddNode& left, const SubNode& right);
std::unique_ptr<AMA> operator-(const AddNode& left, const MulNode& right);
std::unique_ptr<AMA> operator-(const AddNode& left, const ExpNode& right);

// @dontinclude SubNode
std::unique_ptr<AMA> operator-(const SubNode& left, const NumNode& right);
std::unique_ptr<AMA> operator-(const SubNode& left, const VarNode& right);
std::unique_ptr<AMA> operator-(const SubNode& left, const AddNode& right);
std::unique_ptr<AMA> operator-(const SubNode& left, const SubNode& right);
std::unique_ptr<AMA> operator-(const SubNode& left, const MulNode& right);
std::unique_ptr<AMA> operator-(const SubNode& left, const ExpNode& right);

// @dontinclude MulNode
std::unique_ptr<AMA> operator-(const MulNode& left, const NumNode& right);
std::unique_ptr<AMA> operator-(const MulNode& left, const VarNode& right);
std::unique_ptr<AMA> operator-(const MulNode& left, const AddNode& right);
std::unique_ptr<AMA> operator-(const MulNode& left, const SubNode& right);
std::unique_ptr<AMA> operator-(const MulNode& left, const MulNode& right);
std::unique_ptr<AMA> operator-(const MulNode& left, const ExpNode& right);

// @dontinclude Dynamic AMA Catch
std::unique_ptr<AMA> operator-(const AMA& lhs, const AMA& rhs);


// ----------------------- MULTIPLICATION METHODS ----------------------- //

// @dontinclude NumNode
std::unique_ptr<AMA> operator*(const NumNode& left, const NumNode& right);
std::unique_ptr<AMA> operator*(const NumNode& left, const VarNode& right);
std::unique_ptr<AMA> operator*(const NumNode& left, const AddNode& right);
std::unique_ptr<AMA> operator*(const NumNode& left, const SubNode& right);
std::unique_ptr<AMA> operator*(const NumNode& left, const MulNode& right);
std::unique_ptr<AMA> operator*(const NumNode& left, const ExpNode& right);

// @dontinclude VarNode
std::unique_ptr<AMA> operator*(const VarNode& left, const NumNode& right);
std::unique_ptr<AMA> operator*(const VarNode& left, const VarNode& right);
std::unique_ptr<AMA> operator*(const VarNode& left, const AddNode& right);
std::unique_ptr<AMA> operator*(const VarNode& left, const SubNode& right);
std::unique_ptr<AMA> operator*(const VarNode& left, const MulNode& right);
std::unique_ptr<AMA> operator*(const VarNode& left, const ExpNode& right);

// @dontinclude AddNode
std::unique_ptr<AMA> operator*(const AddNode& left, const NumNode& right);
std::unique_ptr<AMA> operator*(const AddNode& left, const VarNode& right);
std::unique_ptr<AMA> operator*(const AddNode& left, const AddNode& right);
std::unique_ptr<AMA> operator*(const AddNode& left, const SubNode& right);
std::unique_ptr<AMA> operator*(const AddNode& left, const MulNode& right);
std::unique_ptr<AMA> operator*(const AddNode& left, const ExpNode& right);

// @dontinclude SubNode
std::unique_ptr<AMA> operator*(const SubNode& left, const NumNode& right);
std::unique_ptr<AMA> operator*(const SubNode& left, const VarNode& right);
std::unique_ptr<AMA> operator*(const SubNode& left, const AddNode& right);
std::unique_ptr<AMA> operator*(const SubNode& left, const SubNode& right);
std::unique_ptr<AMA> operator*(const SubNode& left, const MulNode& right);
std::unique_ptr<AMA> operator*(const SubNode& left, const ExpNode& right);

// @dontinclude MulNode
std::unique_ptr<AMA> operator*(const MulNode& left, const NumNode& right);
std::unique_ptr<AMA> operator*(const MulNode& left, const VarNode& right);
std::unique_ptr<AMA> operator*(const MulNode& left, const AddNode& right);
std::unique_ptr<AMA> operator*(const MulNode& left, const SubNode& right);
std::unique_ptr<AMA> operator*(const MulNode& left, const MulNode& right);
std::unique_ptr<AMA> operator*(const MulNode& left, const ExpNode& right);

// @dontinclude Dynamic AMA Catch
std::unique_ptr<AMA> operator*(const AMA& lhs, const AMA& rhs);


// ----------------------- UNARY METHODS ----------------------- //

std::unique_ptr<AMA> operator-(const NumNode& obj);
std::unique_ptr<AMA> operator-(const VarNode& obj);
std::unique_ptr<AMA> operator-(const AddNode& obj);
std::unique_ptr<AMA> operator-(const SubNode& obj);
std::unique_ptr<AMA> operator-(const MulNode& obj);

// @dontinclude Dynamic AMA Catch
std::unique_ptr<AMA> operator-(const AMA& obj);



#endif