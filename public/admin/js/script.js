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
