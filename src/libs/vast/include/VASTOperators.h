/**
 * Author: dev.slife
 * Date Created: 12/11/25
 * Date Updated: 2/15/26
 * Description:
 *      Manages operators used by VAL's abstract syntax tree.
 */





#ifndef VASTOPERATORS_H
#define VASTOPERATORS_H


// ----------------------- LIBRARIES ----------------------- //

#include "VAST.h"
#include "NumNode.h"
#include "VarNode.h"
#include "AddNode.h"
#include "SubNode.h"
#include "MulNode.h"
#include "ExpNode.h"



// ----------------------- COMPARE METHOD ----------------------- //

bool compareNodes(std::vector<VAST*> nodes);


// ----------------------- ADDITION METHODS ----------------------- //

// @dontinclude NumNode
std::unique_ptr<VAST> operator+(const NumNode& left, const NumNode& right);
std::unique_ptr<VAST> operator+(const NumNode& left, const VarNode& right);
std::unique_ptr<VAST> operator+(const NumNode& left, const AddNode& right);
std::unique_ptr<VAST> operator+(const NumNode& left, const SubNode& right);
std::unique_ptr<VAST> operator+(const NumNode& left, const MulNode& right);
std::unique_ptr<VAST> operator+(const NumNode& left, const ExpNode& right);

// @dontinclude VarNode
std::unique_ptr<VAST> operator+(const VarNode& left, const NumNode& right);
std::unique_ptr<VAST> operator+(const VarNode& left, const VarNode& right);
std::unique_ptr<VAST> operator+(const VarNode& left, const AddNode& right);
std::unique_ptr<VAST> operator+(const VarNode& left, const SubNode& right);
std::unique_ptr<VAST> operator+(const VarNode& left, const MulNode& right);
std::unique_ptr<VAST> operator+(const VarNode& left, const ExpNode& right);

// @dontinclude AddNode
std::unique_ptr<VAST> operator+(const AddNode& left, const NumNode& right);
std::unique_ptr<VAST> operator+(const AddNode& left, const VarNode& right);
std::unique_ptr<VAST> operator+(const AddNode& left, const AddNode& right);
std::unique_ptr<VAST> operator+(const AddNode& left, const SubNode& right);
std::unique_ptr<VAST> operator+(const AddNode& left, const MulNode& right);
std::unique_ptr<VAST> operator+(const AddNode& left, const ExpNode& right);

// @dontinclude SubNode
std::unique_ptr<VAST> operator+(const SubNode& left, const NumNode& right);
std::unique_ptr<VAST> operator+(const SubNode& left, const VarNode& right);
std::unique_ptr<VAST> operator+(const SubNode& left, const AddNode& right);
std::unique_ptr<VAST> operator+(const SubNode& left, const SubNode& right);
std::unique_ptr<VAST> operator+(const SubNode& left, const MulNode& right);
std::unique_ptr<VAST> operator+(const SubNode& left, const ExpNode& right);

// @dontinclude MulNode
std::unique_ptr<VAST> operator+(const MulNode& left, const NumNode& right);
std::unique_ptr<VAST> operator+(const MulNode& left, const VarNode& right);
std::unique_ptr<VAST> operator+(const MulNode& left, const AddNode& right);
std::unique_ptr<VAST> operator+(const MulNode& left, const SubNode& right);
std::unique_ptr<VAST> operator+(const MulNode& left, const MulNode& right);
std::unique_ptr<VAST> operator+(const MulNode& left, const ExpNode& right);

// @dontinclude Dynamic VAST Catch
std::unique_ptr<VAST> operator+(const VAST& lhs, const VAST& rhs);


// ----------------------- SUBTRACTION METHODS ----------------------- //

// @dontinclude NumNode
std::unique_ptr<VAST> operator-(const NumNode& left, const NumNode& right);
std::unique_ptr<VAST> operator-(const NumNode& left, const VarNode& right);
std::unique_ptr<VAST> operator-(const NumNode& left, const AddNode& right);
std::unique_ptr<VAST> operator-(const NumNode& left, const SubNode& right);
std::unique_ptr<VAST> operator-(const NumNode& left, const MulNode& right);
std::unique_ptr<VAST> operator-(const NumNode& left, const ExpNode& right);

// @dontinclude VarNode
std::unique_ptr<VAST> operator-(const VarNode& left, const NumNode& right);
std::unique_ptr<VAST> operator-(const VarNode& left, const VarNode& right);
std::unique_ptr<VAST> operator-(const VarNode& left, const AddNode& right);
std::unique_ptr<VAST> operator-(const VarNode& left, const SubNode& right);
std::unique_ptr<VAST> operator-(const VarNode& left, const MulNode& right);
std::unique_ptr<VAST> operator-(const VarNode& left, const ExpNode& right);

// @dontinclude AddNode
std::unique_ptr<VAST> operator-(const AddNode& left, const NumNode& right);
std::unique_ptr<VAST> operator-(const AddNode& left, const VarNode& right);
std::unique_ptr<VAST> operator-(const AddNode& left, const AddNode& right);
std::unique_ptr<VAST> operator-(const AddNode& left, const SubNode& right);
std::unique_ptr<VAST> operator-(const AddNode& left, const MulNode& right);
std::unique_ptr<VAST> operator-(const AddNode& left, const ExpNode& right);

// @dontinclude SubNode
std::unique_ptr<VAST> operator-(const SubNode& left, const NumNode& right);
std::unique_ptr<VAST> operator-(const SubNode& left, const VarNode& right);
std::unique_ptr<VAST> operator-(const SubNode& left, const AddNode& right);
std::unique_ptr<VAST> operator-(const SubNode& left, const SubNode& right);
std::unique_ptr<VAST> operator-(const SubNode& left, const MulNode& right);
std::unique_ptr<VAST> operator-(const SubNode& left, const ExpNode& right);

// @dontinclude MulNode
std::unique_ptr<VAST> operator-(const MulNode& left, const NumNode& right);
std::unique_ptr<VAST> operator-(const MulNode& left, const VarNode& right);
std::unique_ptr<VAST> operator-(const MulNode& left, const AddNode& right);
std::unique_ptr<VAST> operator-(const MulNode& left, const SubNode& right);
std::unique_ptr<VAST> operator-(const MulNode& left, const MulNode& right);
std::unique_ptr<VAST> operator-(const MulNode& left, const ExpNode& right);

// @dontinclude Dynamic VAST Catch
std::unique_ptr<VAST> operator-(const VAST& lhs, const VAST& rhs);


// ----------------------- MULTIPLICATION METHODS ----------------------- //

// @dontinclude NumNode
std::unique_ptr<VAST> operator*(const NumNode& left, const NumNode& right);
std::unique_ptr<VAST> operator*(const NumNode& left, const VarNode& right);
std::unique_ptr<VAST> operator*(const NumNode& left, const AddNode& right);
std::unique_ptr<VAST> operator*(const NumNode& left, const SubNode& right);
std::unique_ptr<VAST> operator*(const NumNode& left, const MulNode& right);
std::unique_ptr<VAST> operator*(const NumNode& left, const ExpNode& right);

// @dontinclude VarNode
std::unique_ptr<VAST> operator*(const VarNode& left, const NumNode& right);
std::unique_ptr<VAST> operator*(const VarNode& left, const VarNode& right);
std::unique_ptr<VAST> operator*(const VarNode& left, const AddNode& right);
std::unique_ptr<VAST> operator*(const VarNode& left, const SubNode& right);
std::unique_ptr<VAST> operator*(const VarNode& left, const MulNode& right);
std::unique_ptr<VAST> operator*(const VarNode& left, const ExpNode& right);

// @dontinclude AddNode
std::unique_ptr<VAST> operator*(const AddNode& left, const NumNode& right);
std::unique_ptr<VAST> operator*(const AddNode& left, const VarNode& right);
std::unique_ptr<VAST> operator*(const AddNode& left, const AddNode& right);
std::unique_ptr<VAST> operator*(const AddNode& left, const SubNode& right);
std::unique_ptr<VAST> operator*(const AddNode& left, const MulNode& right);
std::unique_ptr<VAST> operator*(const AddNode& left, const ExpNode& right);

// @dontinclude SubNode
std::unique_ptr<VAST> operator*(const SubNode& left, const NumNode& right);
std::unique_ptr<VAST> operator*(const SubNode& left, const VarNode& right);
std::unique_ptr<VAST> operator*(const SubNode& left, const AddNode& right);
std::unique_ptr<VAST> operator*(const SubNode& left, const SubNode& right);
std::unique_ptr<VAST> operator*(const SubNode& left, const MulNode& right);
std::unique_ptr<VAST> operator*(const SubNode& left, const ExpNode& right);

// @dontinclude MulNode
std::unique_ptr<VAST> operator*(const MulNode& left, const NumNode& right);
std::unique_ptr<VAST> operator*(const MulNode& left, const VarNode& right);
std::unique_ptr<VAST> operator*(const MulNode& left, const AddNode& right);
std::unique_ptr<VAST> operator*(const MulNode& left, const SubNode& right);
std::unique_ptr<VAST> operator*(const MulNode& left, const MulNode& right);
std::unique_ptr<VAST> operator*(const MulNode& left, const ExpNode& right);

// @dontinclude Dynamic VAST Catch
std::unique_ptr<VAST> operator*(const VAST& lhs, const VAST& rhs);


// ----------------------- UNARY METHODS ----------------------- //

std::unique_ptr<VAST> operator-(const NumNode& obj);
std::unique_ptr<VAST> operator-(const VarNode& obj);
std::unique_ptr<VAST> operator-(const AddNode& obj);
std::unique_ptr<VAST> operator-(const SubNode& obj);
std::unique_ptr<VAST> operator-(const MulNode& obj);

// @dontinclude Dynamic VAST Catch
std::unique_ptr<VAST> operator-(const VAST& obj);



#endif