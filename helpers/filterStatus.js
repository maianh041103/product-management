module.exports = (query) => {
    const filterStatus = [
        {
            name: "Tất cả",
            status: "",
            //class: "active"
        },
        {
            name: "Đang hoạt động",
            status: "active"
        },
        {
            name: "Dừng hoạt động",
            status: "inactive"
        }
    ]
    let index;
    if (query.status) {
        index = filterStatus.findIndex(item => item.status == query.status)
    } else {
        index = filterStatus.findIndex(item => item.status == "")
    }
    filterStatus[index].class = "active";

    return filterStatus;
}