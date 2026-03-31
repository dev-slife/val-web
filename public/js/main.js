/**
 * Author: dev.slife
 * Date Created: 3/23/26
 * Date Updated: 3/29/26
 * Description:
 *      Handles main frontend interaction.
 */


// --------------------------- HELPER FUNCTIONS --------------------------- //

async function expressPage(url) {
    try {
        const response = await fetch(url);
        window.location.href = response.url;
        return response.url;
    } catch (error) {
        console.error("Could not fetch Express page using: ", url);
        return null;
    }
}

async function expressFetch(url) {
    try {
        const response = await fetch(url);
        console.log(response);
        // const data = await response.json();
        // console.log(data);
        return "";
    } catch (error) {
        console.error("Could not fetch Express API using: ", url);
        return null;
    }
}


// --------------------------- MODULE FUNCTIONS --------------------------- //

export function changePage(page="home", is_index_file=false) {
    // First try to use the express route
    const expressURL = window.location.href + (page == "home") ? "": page;
    if (!expressPage(expressURL)) {
        // If not default to html file
        const base_url = (is_index_file) ? "./pages/": "../pages/";
        const file_name = (page.includes(".html")) ? page: page+".html";
        const url = base_url + file_name;
        window.location.href = url;
    }
}