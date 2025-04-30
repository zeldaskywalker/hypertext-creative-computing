async function getAllBooks() {
  // get all books from baserow
  axios({
    method: "GET",
    url: "https://api.baserow.io/api/database/rows/table/519748/?user_field_names=true",
    headers: {
      Authorization: "Token LnfGhMqIKGMAFpImIbVbEwf6T0BqTg4K"
    }
  }).then(function (response) {
    console.log('reading from baserow...');
    const results = response.data.results;
    return results;
  }).then(function(results) {
    // for each book, add a div with book title
    results.forEach(book => {
        var library_container = document.getElementById('library');
        var book_div = document.createElement('div');
        book_div.innerText = book.title;
        library_container.appendChild(book_div);
    })
  });
}

getAllBooks();

// TODO: on pressing a specific book, create a pop-up with all book info on right hand side