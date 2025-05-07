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
        book_div.addEventListener("click", function() {
          addBookDetails(book);
        });
        library_container.appendChild(book_div);
    })
  });
}

const list_of_books = await getAllBooks();

function addBookDetails(book) {
  var open_book_container = document.getElementById('open-book-container');

  // create div for open book
  var open_book_div = document.createElement('div');
  open_book_div.id = "open-book-details";

  // create left and right pages for open book
  var left_page = document.createElement('div');
  var right_page = document.createElement('div');

  left_page.id = "left";
  right_page.id = "right";
  left_page.innerText = book.initials + " read " + book.title + " by " + book.author + ".";
  right_page.innerText = "reader's note: " + book["reader's note"] + "– " + book.initials;
  open_book_div.appendChild(left_page);
  open_book_div.appendChild(right_page);

  // create the close button
  var close_button = document.createElement('button');
  close_button.innerHTML = '&times;'; // Use an "X" symbol
  close_button.style.cursor = 'pointer';
  open_book_div.appendChild(close_button);
  open_book_container.appendChild(open_book_div);

  close_button.addEventListener("click", function() {
    console.log('removing');
    open_book_div.remove();
  });
}