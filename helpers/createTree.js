let countItem = 0;
const createTree = (arr, parentId = "") => {
    const tree = [];
    arr.forEach((item) => {
        if (item.parent_id === parentId) {
            countItem++;
            const newItem = item;
            newItem.index = countItem;
            const children = createTree(arr, item.id);
            if (children.length > 0) {
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
}

module.exports.createTree = (arr, parentId = "") => {
    countItem = 0;
    const tree = createTree(arr, parentId = "");
    return tree;
}