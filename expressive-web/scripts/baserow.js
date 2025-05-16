// gets communal notes for a book from baserow
export async function getCommunalNotesForBook(book_id) {
  var final_url = "https://api.baserow.io/api/database/rows/table/519747/?user_field_names=true&order_by=-posted&filters=%7B%22filter_type%22%3A%22AND%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22link_row_has%22%2C%22field%22%3A%22book%22%2C%22value%22%3A%22" + book_id + "%22%7D%5D%2C%22groups%22%3A%5B%5D%7D";

  return axios({
    method: "GET",
    url: final_url,
    headers: {
      "Authorization": "Token LnfGhMqIKGMAFpImIbVbEwf6T0BqTg4K",
      "Content-Type": "application/json"
    }
  }).then(function (response) {
    const results = response.data.results;
    return results;
  });
}

// gets communal notes for a book from baserow
export async function getAllCommunalNotes() {
  var final_url = "https://api.baserow.io/api/database/rows/table/519747/?user_field_names=true&order_by=-posted";

  return axios({
    method: "GET",
    url: final_url,
    headers: {
      "Authorization": "Token LnfGhMqIKGMAFpImIbVbEwf6T0BqTg4K",
      "Content-Type": "application/json"
    }
  }).then(function (response) {
    const results = response.data.results;
    return results;
  });
}

// upload a note to a book in baserow
export async function uploadCommunalNote(book_id) {
  return axios({
      method: "POST",
      url: "https://api.baserow.io/api/database/rows/table/519747/?user_field_names=true",
      headers: {
          "Authorization": "Token LnfGhMqIKGMAFpImIbVbEwf6T0BqTg4K",
          "Content-Type": "application/json"
      },
      data: {
          "note": document.getElementById("note").value,
          "initials": document.getElementById("initials").value,
          "book": [ book_id ]
      }
  });
}

// get all books from baserow
export async function getAllBooks() {
  return axios({
    method: "GET",
    url: "https://api.baserow.io/api/database/rows/table/519748/?user_field_names=true&order_by=-added on",
    headers: {
      Authorization: "Token LnfGhMqIKGMAFpImIbVbEwf6T0BqTg4K"
    }
  }).then(function (response) {
    const results = response.data.results;
    return results;
  });
}