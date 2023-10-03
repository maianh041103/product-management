//Change permision
const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    const permissions = [];
    const dataRows = document.querySelectorAll("[data-name]");
    if (dataRows) {
      dataRows.forEach((row, index) => {
        if (row.getAttribute('data-name') === 'id') {
          const ids = row.querySelectorAll(['input']);
          ids.forEach(id => {
            permissions.push({
              id: id.value,
              permissions: []
            });
          })
        }
        else {
          const inputChecked = row.querySelectorAll('input:checked');
          inputChecked.forEach((name, index) => {
            permissions[index].permissions.push(row.getAttribute('data-name'));
          })
        }
      })
    }
    const formChangePermissions = document.querySelector('[form-change-permissions');
    const input = formChangePermissions.querySelector('[data-permissions]');
    input.value = JSON.stringify(permissions);
    formChangePermissions.submit();
  })
}
//End Change Permission

//Update view Permission
const dataPermission = document.querySelector('[data-permission]');
if (dataPermission) {
  const rolesString = dataPermission.getAttribute('data-permission');
  const roles = JSON.parse(rolesString);
  roles.forEach((item, index) => {
    const permisions = item.permissions;
    permisions.forEach((permision) => {
      const inputRow = document.querySelector(`[data-name=${permision}]`);
      const inputCol = inputRow.querySelectorAll('input')[index];
      inputCol.checked = true;
    })
  })
}