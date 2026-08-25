/**
 * Author: dev.slife
 * Date Created: 4/27/26
 * Date Updated: 8/20/26
 * Description:
 *      Helps other coding languages distinguish functions within AMA.
 */





#ifdef _WIN32
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT __attribute__((visibility("default")))
#endif

#ifdef __cplusplus
extern "C" {
#endif

EXPORT const char* AMA_simplify(const char* input);
EXPORT const char* AMA_solve_literal(const char* input);
EXPORT const bool AMA_equivalent(const char* input1, const char* input2);

#ifdef __cplusplus
}
#endif