const add_book_form = document.getElementById("bookinfo");

// get book picture file
const book_picture_input = document.getElementById("picture");
const book_picture = book_picture_input.addEventListener("change", getBookPicture);
function getBookPicture() {
    return this.files[0];
}

// passed into baserow 
const formData = new FormData();
formData.append('file', book_picture);

async function uploadNewBook() {
    // upload file
    axios.post('/fileupload', formData, {
        method: "POST",
        url: "https://api.baserow.io/api/user-files/upload-file/",
        headers: {
          Authorization: "Token LnfGhMqIKGMAFpImIbVbEwf6T0BqTg4K",
          "Content-Type": "multipart/form-data"
        }
      }).then(function (response) {
        // get file name from response of uploading to baserow
        console.log('sending to baserow...');
        const file_name = response.name;
        return file_name;
      }).then(function (file_name) {
        // with file name, send book details to create a new book entry in baserow
        axios({
            method: "POST",
            url: "https://api.baserow.io/api/database/rows/table/519748/?user_field_names=true",
            headers: {
              Authorization: "Token LnfGhMqIKGMAFpImIbVbEwf6T0BqTg4K",
              "Content-Type": "application/json"
            },
            data: {
              "title": document.getElementById('#title'),
              "readers' note": document.getElementById('#note'),
              "author": document.getElementById('#author'),
              "location of reading": document.getElementById('#location'),
              "initials": document.getElementById('#initials'),
              "picture": [
                  {
                      "name": file_name
                  }
              ]
            }
          })
      })
}

add_book_form.addEventListener("submit", uploadNewBook);
