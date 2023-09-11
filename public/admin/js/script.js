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

//Change Multi
const checkboxMulti = document.querySelector('[checkbox-multi]');
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");

    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    //Xu ly nut checkAll
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(button => {
                button.checked = true;
            })
        } else {
            inputsId.forEach(button => {
                button.checked = false;
            })
        }
    })

    //Xu ly tung nut con
    inputsId.forEach(button => {
        button.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })

    //Form 
    const formChangeMulti = document.querySelector("[form-change-multi]");
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        let ids = [];
        const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

        if (countChecked > 0) {
            inputsId.forEach(button => {
                if (button.checked) {
                    ids.push(button.value);
                }
            })

            const inputText = document.querySelector("input[name='ids']");
            inputText.value = ids.join(", ");
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 sản phẩm");
        }
    })
}

