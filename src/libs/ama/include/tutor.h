/**
 * Author: dev.slife
 * Date Created: 4/2/26
 * Date Updated: 4/15/26
 * Description:
 *      All tutor declarations used to help map logic, so you can see how AMA evaluated an equation.
 */





#ifndef TUTOR_H
#define TUTOR_H


// ----------------------- LIBRARIES ----------------------- //

#include "nodes/AMA.h"


// ----------------------- HELPER ----------------------- //

/**
 * @brief Converts the Tag Enum to its string name.
 * 
 * @return A string representing the Tag name.
 */
inline std::string tagToStr(Tag tag) {
    const char* names[] = {"V", " ", " ", "+", "-", "*", "/", "^"};
    if (tag >= 0 && tag < 8) {
        return names[tag];
    }
    return "?";
}


// ----------------------- CONSTANTS & STRUCTURES ----------------------- //

struct TutorEntry {
    size_t id;
    Tag operation;
    std::string left;
    std::string right;
    std::string answer;

    std::string display() {
        return "#" + std::to_string(id) + ": " + answer + ", [" + left + tagToStr(operation) + right + "]";
    }
};


// ----------------------- FUNCTIONS ----------------------- //

/**
 * @brief Grabs the Tutor log used to help explain how AMA evaluated an equation.
 * 
 * @return A vector of all the TutorEntries.
 */
std::vector<TutorEntry> grabTutorLog();

/**
 * @brief Creates a TutorEntry and adds it to the log.
 * 
 * @param oper The operation performed
 * @param result The result of performing the operation
 */
void addTutorEntry(Tag oper, std::string result, std::string l, std::string r);

/**
 * @brief Removes all entries that have been logged.
 */
void clearTutorLog();

/**
 * @brief Shows the Tutor log.
 * 
 * @return A string representing the log.
 */
std::string showTutorLog();

/**
 * @brief Returns the Tutor log for byte data (extern "C")
 * 
 * @return A string representing the byte data
 */
std::string byteTutorLog();



#endif