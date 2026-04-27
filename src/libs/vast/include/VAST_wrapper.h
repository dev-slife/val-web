/**
 * Author: dev.slife
 * Date Created: 4/27/26
 * Date Updated: 4/27/26
 * Description:
 *      Helps other coding languages distinguish functions within VAST system.
 */



#ifdef _WIN32
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT __attribute__((visibility("default")))
#endif

#ifdef __cplusplus
extern "C" {
#endif

EXPORT const char* VAST_simplify(const char* input);
EXPORT const char* VAST_solve_literal(const char* input);

#ifdef __cplusplus
}
#endif