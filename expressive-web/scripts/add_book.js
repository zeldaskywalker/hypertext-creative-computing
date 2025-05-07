// upload new book to baserow
async function uploadNewBook() {
    // get book picture file from picture input
    const book_picture_file = document.getElementById("picture").files[0];

    // create FormData to upload file to baserow
    var formData = new FormData();
    formData.append("file", book_picture_file);
    axios({
        method: "POST",
        url: "https://api.baserow.io/api/user-files/upload-file/",
        headers: {
            Authorization: "Token LnfGhMqIKGMAFpImIbVbEwf6T0BqTg4K",
            "Content-Type": "multipart/form-data"
        },
        data: formData,
    })

    // grab response from uploading file to baserow
    .then(function (response) {
        return response.data;
    })

    // with file data from response, send book details to create a new book entry in baserow
    .then(function (file) {
        axios({
            method: "POST",
            url: "https://api.baserow.io/api/database/rows/table/519748/?user_field_names=true",
            headers: {
                "Authorization": "Token LnfGhMqIKGMAFpImIbVbEwf6T0BqTg4K",
                "Content-Type": "application/json"
            },
            data: {
                "title": document.getElementById("title").value,
                "readers' note": document.getElementById("note").value,
                "author": document.getElementById("author").value,
                "location of reading": document.getElementById("location").value,
                "initials": document.getElementById("initials").value,
                "picture": [ file ]
            }
        })
    }).then(function () {
        window.location.href = "thanks.html";
    })
}

const book_pic_button = document.getElementById('picture');
const file_chosen = document.getElementById('file-chosen');

book_pic_button.addEventListener('change', function(){
    file_chosen.textContent = "⇧ " + this.files[0].name;
})
