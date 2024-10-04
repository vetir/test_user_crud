function setActiveTab(tabId) {
    var horizontalNavLinks = document
        .getElementById('horizontalNavLinks')
        .getElementsByClassName('nav-link')

    for (var i=0; i < horizontalNavLinks.length; i++) {
        horizontalNavLinks[i].classList.remove('active')
    }
    document.getElementById(tabId).classList.add('active')
}

function resetAddUserForm() {
    $("#newUserId").val('');
    $("#newUserUsername").val('');
    $("#newUserPassword").val('');
    $("#newUserEmail").val('');
    $("#newUserAge").val('');

    $('#newUserCheckboxesContainer input[type="checkbox"]').prop('checked', false);

    cleanValidationErrors()
}