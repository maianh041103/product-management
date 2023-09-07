module.exports = (query) => {
    let objectSearch = {
        keyword: ""
    }
    objectSearch.keyword = query.keyword;
    if (objectSearch.keyword) {
        const regex = new RegExp(objectSearch.keyword, "i"); // i la khong phan biet hoa thuong
        objectSearch.regex = regex;
    }
    return objectSearch;
}