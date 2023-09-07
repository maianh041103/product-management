//Filter
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {

    buttonStatus.forEach(item => {
        item.addEventListener('click', (e) => {
            let url = new URL(window.location.href);

            const status = item.getAttribute('button-status');

            if (status) {
                url.searchParams.set('status', status);
            } else {
                url.searchParams.delete('status');
            }

            window.location.href = url.href;
        })
    })
}
//End Filter

//Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        let keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url;
    })
}
//End Search

//Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
buttonPagination.forEach(button => {
    button.addEventListener("click", () => {
        const page = button.getAttribute("button-pagination");
        let url = new URL(location.href);
        if (page) {
            url.searchParams.set("page", page);
        }
        location.href = url.href;
    })
})
//End Pagination