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
if (buttonPagination) {
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
}
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

    if (formChangeMulti) {
        formChangeMulti.addEventListener("submit", (e) => {
            e.preventDefault();
            let ids = [];

            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

            const typeChange = e.target.elements.type.value;

            if (countChecked > 0) {
                inputsId.forEach(button => {
                    if (button.checked) {
                        if (typeChange == "change-position") {
                            const position = button.closest("tr").querySelector("input[name='position']").value;
                            ids.push(`${button.value}-${position}`);
                        }
                        else {
                            ids.push(button.value);
                        }
                    }
                })


                if (typeChange == "delete-all") {
                    const isConfirm = confirm(`Bạn có chắc chắn muốn xóa ${countChecked} sản phẩm?`);
                    if (!isConfirm) {
                        return;
                    }
                }

                const inputText = document.querySelector("input[name='ids']");
                inputText.value = ids.join(", ");
                formChangeMulti.submit();
            } else {
                alert("Vui lòng chọn ít nhất 1 sản phẩm");
            }
        })
    }
}
//End form change-multi

//Show Alert
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
    const time = showAlert.getAttribute('data-time');
    const closeAlert = document.querySelector('[close-alert]');
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time)

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}

// Delete Item
const buttonsDelete = document.querySelectorAll('[button-delete]');
if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa?");
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                const path = formDeleteItem.getAttribute("path") + id + "?_method=DELETE";
                formDeleteItem.action = path;
                formDeleteItem.submit();
            }
        })
    })
}

//Upload Image
const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
    const uploadImageInput = document.querySelector('[upload-image-input]');
    const uploadImagePreview = document.querySelector('[upload-image-preview ]');
    uploadImageInput.addEventListener("change", (e) => {
        const [file] = e.target.files;
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    })
    const buttonDeleteImage = document.querySelector('[delete-image]');
    if (buttonDeleteImage) {
        buttonDeleteImage.addEventListener("click", (e) => {
            e.preventDefault();
            uploadImageInput.value = "";
            uploadImagePreview.src = "";
        })
    }
}
//End upload image

//Sort
const sort = document.querySelector("[sort]");
if (sort) {
    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");
    let url = new URL(location.href);

    //Sắp xếp
    sortSelect.addEventListener("change", (e) => {
        const sort = e.target.value.split('-');
        const [sortKey, sortValue] = sort;
        url.searchParams.set('sortKey', sortKey);
        url.searchParams.set('sortValue', sortValue);
        location.href = url.href;
    })

    //Xóa lựa chọn sắp xếp
    sortClear.addEventListener("click", (e) => {
        url.searchParams.delete('sortKey');
        url.searchParams.delete('sortValue');
        location.href = url.href;
    })

    //Thêm selected cho option
    const query = url.searchParams;
    if (query) {
        const sortKey = query.get('sortKey');
        const sortValue = query.get('sortValue');
        const stringSort = sortKey + '-' + sortValue;
        const optionSelected = sortSelect.querySelector(`option[value = ${stringSort}]`);
        optionSelected.selected = true;
    }

}
//End Sort

