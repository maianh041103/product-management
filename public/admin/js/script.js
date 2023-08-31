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
