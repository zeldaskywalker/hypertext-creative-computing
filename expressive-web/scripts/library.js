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
        book_div.className = "book_on_shelf";
        library_container.appendChild(book_div);

        var open_book_container = document.getElementById('open-book');
        var open_book_div = document.createElement('div');
        open_book_div.className = "book_details";
        open_book_div.innerText = book.initials + " read " + book.title + " by " + book.author + "." 
        open_book_container.appendChild(open_book_div);

        book_div.addEventListener("click", function() {
          console.log('i am here');
          open_book_div.style.display = "flex";
        })
    })
  });
}

getAllBooks();

// TODO: on pressing a specific book, create a pop-up with all book info on right hand side
// function click(book){
//   var open_book_container = document.getElementById('open-book');
//   var book_div = document.createElement('div');
//   book_div.className = "book_details";
//   book_div.innerText = book.initials + " read " + book.title + " by " + book.author + "." 
//   open_book_container.appendChild(book_div);
// }