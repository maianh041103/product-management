const buttonsChangeStatus = document.querySelectorAll('[data-status]');
if (buttonsChangeStatus.length > 0) {
    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute('data-status');
            const id = button.getAttribute('data-id');
            const statusChange = status == 'active' ? "inactive" : "active";

            const formChangeStatus = document.querySelector("#form-change-status");
            const path = formChangeStatus.getAttribute('path') + `/${statusChange}/${id}/?_method=PATCH`;
            formChangeStatus.action = path;
            formChangeStatus.submit();
        })
    })
}