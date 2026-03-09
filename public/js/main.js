export function changePage(page="home", is_index_file=false) {
    const base_url = (is_index_file) ? "./pages/": "../pages/";
    const file_name = (page.includes(".html")) ? page: page+".html";
    const url = base_url + file_name;
    window.location.href = url;
}