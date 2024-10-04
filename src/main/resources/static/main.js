$(async function () {
    await populateUsersTable();
    await populateRolesCheckboxes("editRolesCheckboxesContainer")
    await populateRolesCheckboxes("deleteRolesCheckboxesContainer")
    await populateRolesCheckboxes("newUserCheckboxesContainer")

})

const usersTable = document.querySelector('#tableData')


const userFetchService = {
    findAllUsers: async () => await fetch("http://localhost:8080/api/admin/users"),
    getAllRoles: async () => await fetch("http://localhost:8080/api/admin/users/roles"),
    findUser: async (id) => await fetch(`http://localhost:8080/api/admin/users/${id}`),
    addNewUser: async(user) => await fetch(`http://localhost:8080/api/admin/users`,
                                                {method: 'POST', headers: {'Content-Type':'application/json'}, body:JSON.stringify(user)}),
    updateUser: async (user, id) => await fetch(`http://localhost:8080/api/admin/users/${id}`,
                                                {method: 'PUT', headers: {'Content-Type':'application/json'}, body:JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`http://localhost:8080/api/admin/users/${id}`,
                                                {method: 'DELETE', headers: {'Content-Type':'application/json'}})
}

async function populateUsersTable() {
    await userFetchService.findAllUsers()
        .then(response => {
            return response.json()})
        .then(users => {
            const usersListHTML = users.map(user => {
                const roles = user.roles.map(role => role.authority).join(', ')
                return `
                <tr data-userId="${user.id}">
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.age}</td>
                    <td>${roles}</td>
                    <td><button class="btn btn-info editingButton" data-target="#editUserModal" data-userId="${user.id}"
                           id="editUserButton" data-toggle="modal">Edit</button>
                    </td>
                    <td><button class="btn btn-outline-danger deleteButton" data-target="#deleteUserModal" data-userId="${user.id}"
                           id="deleteUserButton" data-toggle="modal" >Delete</button></td>
                </tr>`
            }).join("")

            usersTable.insertAdjacentHTML("afterbegin", usersListHTML)
        })
}

async function populateRolesCheckboxes(elementId) {

    const response = await userFetchService.getAllRoles()
    const allRoles = await response.json()

    const rolesContainer = document.getElementById(elementId)
    rolesContainer.innerHTML = ""

    allRoles.forEach(role => {
        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.name = "allRoles"
        checkbox.value = role.id
        checkbox.id = "role" + role.id

        const label = document.createElement("label")
        label.htmlFor = checkbox.id
        label.textContent = role.authority
        label.style.marginLeft = "3px"

        rolesContainer.appendChild(checkbox)
        rolesContainer.appendChild(label)
    })
}


$('#addUserConfirmButton').on('click', async function() {
    const newUser = {
        username : $("#newUserUsername").val(),
        password : $("#newUserPassword").val(),
        email : $("#newUserEmail").val(),
        age : $("#newUserAge").val(),
        roles : []
    }

    $('input[name="allRoles"]:checked').each(function () {
        newUser.roles.push({id: parseInt($(this).val(), 10)})
    })
    await addNewUser(newUser)
})

async function addNewUser(newUser){
    const response = await userFetchService.addNewUser(newUser)

    if(response.status === 400) {
        const errors = await response.json()
        displayValidationErrors(errors, "AddNew")
    } else {
        usersTable.innerHTML='';
        await populateUsersTable()
        showUsersTable()
    }
}


usersTable.addEventListener('click', function (event){
    event.preventDefault()

    if(event.target.classList.contains('deleteButton')) {
        onDeleteButtonClick(event.target.getAttribute("data-userId"))
    }
    else if (event.target.classList.contains('editingButton')) {
        onEditButtonClick(event.target.getAttribute("data-userId"))
    }
})


async function onEditButtonClick(userId) {
    cleanValidationErrors()

    const userResponse = await userFetchService.findUser(userId)
    const userForUpdate = await userResponse.json()

    $("#editId").val(userId);
    $("#editUsername").val(userForUpdate.username);
    $("#editPassword").val('');
    $("#editEmail").val(userForUpdate.email);
    $("#editAge").val(userForUpdate.age);

    const roleCheckboxes = document.querySelectorAll('#editRolesCheckboxesContainer input[type="checkbox"][name="allRoles"]')
    roleCheckboxes.forEach(checkbox => checkbox.checked = false)

    userForUpdate.roles.forEach(role => {
        const roleCheckbox = document.querySelector(`#editRolesCheckboxesContainer #role${role.id}`)
        if (roleCheckbox) {
            roleCheckbox.checked = true
        }
    })

    $('#editUserModal').modal();
}

$('#editConfirmButton').on('click', async function () {
    const userId = $("#editId").val()
    const editedUser = {
        username : $("#editUsername").val(),
        email : $("#editEmail").val(),
        age : $("#editAge").val(),
        roles : []
    }
    // === "" ? "mock(empty password)" : $("#editPassword").val(),
    const passwordValue = $("#editPassword").val()
    if (passwordValue !== "") {
        editedUser.password = passwordValue
    }
    console.log(editedUser.password)

        $('input[name="allRoles"]:checked').each(function () {
        editedUser.roles.push({id: parseInt($(this).val(), 10)})
    })

    await editUser(editedUser, userId)
})

async function editUser(editedUser, userId){
    const response = await userFetchService.updateUser(editedUser, userId)
    if (response.status === 400) {
        const errors = await response.json()
        displayValidationErrors(errors, "Edit")
    }
    else {
        usersTable.innerHTML='';
        await populateUsersTable()
        $('#editUserModal').modal('hide')
    }
}


async function onDeleteButtonClick(userId) {
    const userResponse = await userFetchService.findUser(userId)
    const userForDelete = await userResponse.json()

    $("#deleteId").val(userId);
    $("#deleteUsername").val(userForDelete.username);
    $("#deletePassword").val(userForDelete.password);
    $("#deleteEmail").val(userForDelete.email);
    $("#deleteAge").val(userForDelete.age);

    const roleCheckboxes = document.querySelectorAll('#deleteRolesCheckboxesContainer input[type="checkbox"][name="allRoles"]')
    roleCheckboxes.forEach(checkbox => checkbox.checked = false)

    userForDelete.roles.forEach(role => {
        const roleCheckbox = document.querySelector(`#deleteRolesCheckboxesContainer #role${role.id}`)
        if (roleCheckbox) {
            roleCheckbox.checked = true
        }
    })

    $('#deleteUserModal').modal();
}

$('#deleteConfirmButton').on('click', async function () {
    const userId = $("#deleteId").val()
    await deleteUser(userId)
    $('#deleteUserModal').modal('hide');
})

async function deleteUser(userId){
    await userFetchService.deleteUser(userId)
    usersTable.innerHTML='';
    await populateUsersTable()
}



function displayValidationErrors(errors, action) {
    cleanValidationErrors()

    errors.forEach(error => {
        $(`#${error.field}${action}FieldError`).text(error.defaultMessage)
    })
}

function cleanValidationErrors() {
    $('.error-massage').empty()
}



function showUsersTable() {
    document.getElementById('usersTable').style.display=''
    document.getElementById('addUserForm').style.display='none'
    setActiveTab('usersTableTab')
}

function showAddUserForm() {
    resetAddUserForm()
    document.getElementById('addUserForm').style.display=''
    document.getElementById('usersTable').style.display='none'
    setActiveTab('addUserTab')
}

