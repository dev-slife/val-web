/**
 * Author: dev.slife
 * Date Created: 3/23/26
 * Date Updated: 4/22/26
 * Description:
 *      Handles main frontend interaction.
 */


// --------------------------- HELPER FUNCTIONS --------------------------- //

async function expressPage(url) {
    try {
        const response = await fetch(url);
        return response.url;
    } catch (error) {
        console.error("Could not fetch Express page using: ", url);
        return null;
    }
}


// --------------------------- MODULE FUNCTIONS --------------------------- //

async function changePage(page="home", is_index_file=false) {
    // First try to use the express route
    const expressURL = (page == "home") ? '/': '/' + page;
    const route = await expressPage(expressURL);

    if (route) {
        window.location.href = route;
    } else {
        const base_url = (is_index_file) ? "./pages/": "../pages/";
        const file_name = (page.includes(".html")) ? page: page+".html";
        const url = base_url + file_name;
        window.location.href = url;
    }
}


// EXPORT

exports = {
    changePage: changePage
};