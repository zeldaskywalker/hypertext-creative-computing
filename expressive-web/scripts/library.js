async function getAllBooks() {
  // get all books from baserow
  return axios({
    method: "GET",
    url: "https://api.baserow.io/api/database/rows/table/519748/?user_field_names=true&order_by=-added on",
    headers: {
      Authorization: "Token LnfGhMqIKGMAFpImIbVbEwf6T0BqTg4K"
    }
  }).then(function (response) {
    const results = response.data.results;
    return results;
  }).then(function(results) {
    // for each book, add a div with book title
    results.forEach((book, index) => {
      // there are 3 shelves that each fit 16 books
      // use the index to keep track of where the book should be placed
      var shelf_container;
      if (index <= 15) {
        shelf_container = document.getElementById('top-shelf');
      } else if (index >= 16 && index <= 31) {
        shelf_container = document.getElementById('middle-shelf');
      } else if (index >= 32) {
        shelf_container = document.getElementById('bottom-shelf');
      }

      var book_div = document.createElement('div');
      book_div.innerText = book.title;
      book_div.className = "book-on-shelf";

      // on click, call the openBook function defined below
      book_div.addEventListener("click", function() {
        openBook(book);
      });

      shelf_container.appendChild(book_div);
    });
    return results;
  });
}

function openBook(book) {
  var open_book_modal = document.getElementById('book-modal');

  // book
  var book_div = document.createElement('div');
  book_div.className = 'book';

  // book cover
  var book_cover_div = document.createElement('div');
  book_cover_div.className = 'book-cover';

  // back cover
  var back_cover_div = document.createElement('div');
  back_cover_div.className = 'back-cover';

  // left and right back covers
  var back_cover_left_div = document.createElement('div');
  var back_cover_right_div = document.createElement('div');
  back_cover_left_div.className = 'back-cover-left';
  back_cover_right_div.className = 'back-cover-right';
  back_cover_div.appendChild(back_cover_left_div);
  back_cover_div.appendChild(back_cover_right_div);

  // page left
  var page_left_div = document.createElement('div');
  page_left_div.className = 'page page-left';

  var page_content_left_div = document.createElement('div');
  page_content_left_div.className = 'page-content';

  // add title, author, and picture of uploaded book to left page
  page_content_left_div.innerHTML = "<h1>" + book.title +  "</h1>"
  page_content_left_div.innerHTML += "<h2>by: " + book.author + "</h2>";
  page_content_left_div.innerHTML += "<img id='book-img' src='" + book.picture[0].url + "'>";
  page_left_div.appendChild(page_content_left_div);

  // page right
  var page_right_div = document.createElement('div');
  page_right_div.className = 'page page-right';

  var page_content_right_div = document.createElement('div');
  page_content_right_div.className = 'page-content';

  // add initials, reader's note, and location of reading for uploaded book to right page

  // set initials to 'anonymous' if none were provided
  var book_initials;
  if (!book.initials) {
    book_initials = 'anonymous'
  } else {
    book_initials = book.initials; 
  }

  page_content_right_div.innerHTML += "<h3>reader's note <i>by " + book_initials + "</i></h3>";
  page_content_right_div.innerHTML += "<p>" + book["reader's note"] + "</p>";
  page_content_right_div.innerHTML += "<h3>location of reading</h3>";
  page_content_right_div.innerHTML += "<p>" + book["location of reading"] + "</p>";
  page_right_div.appendChild(page_content_right_div);

  // append pages and back cover to book cover
  book_cover_div.appendChild(back_cover_div);
  book_cover_div.appendChild(page_right_div);
  book_cover_div.appendChild(page_left_div);

  // append book cover to book
  book_div.appendChild(book_cover_div);

  // create the close button
  var close_button = document.createElement('button');
  close_button.innerHTML = '&times;'; // Use an "X" symbol
  close_button.style.cursor = 'pointer';
  close_button.id = 'close-button';

  // append close button and book div to modal
  open_book_modal.appendChild(close_button);
  open_book_modal.appendChild(book_div);
  open_book_modal.className = 'opened-book-modal';

  // on click, remove the book, and close the modal!
  close_button.addEventListener("click", function() {
    book_div.remove();
    open_book_modal.classList = [];
    open_book_modal.close();
  });

  // once modal is built from book information, show it
  open_book_modal.showModal();
}

// TODO: add community notes additions too
function openBoard(books) {
  var open_board_modal = document.getElementById('board-modal');

  // board
  var board_div = document.createElement('div');
  board_div.id = 'board-content';

  var board_title = document.createElement('h2');
  board_title.innerText = 'LIBRARY LOGS:'
  board_div.appendChild(board_title);

  // within the board, add a log of book additions
  books.forEach(book => {
    // new paragraph with when the book was added and by whom
    var para = document.createElement('p');

    // set initials to 'anonymous' if none were provided
    var book_initials;
    if (!book.initials) {
      book_initials = 'anonymous'
    } else {
      book_initials = book.initials; 
    }

    para.innerHTML = "~~~ " + book_initials + " added <u>" + book.title + "</u> by " + book.author;
    para.innerHTML += " on " + dateParser(book['added on']) + ".";

    board_div.appendChild(para);
  });

  // create the close button
  var close_button = document.createElement('button');
  close_button.innerHTML = '&times;'; // Use an "X" symbol
  close_button.style.cursor = 'pointer';
  close_button.id = 'close-button';

  // append close button and book div to modal
  open_board_modal.appendChild(close_button);
  open_board_modal.appendChild(board_div);
  open_board_modal.className = 'opened-book-modal';

  // on click, remove the book, and close the modal!
  close_button.addEventListener("click", function() {
    board_div.remove();
    open_board_modal.classList = [];
    open_board_modal.close();
  });

  // once modal is built from books and notes, show it
  open_board_modal.showModal();
}

function dateParser(strDate) {
  const full_date = new Date(strDate);
  const weekday_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const final_day_of_week = weekday_names[full_date.getDay()];
  const final_month = month_names[full_date.getMonth()];
  const final_day = full_date.getDate();
  const final_year = full_date.getFullYear();
  const time = full_date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  const formatted_date = `${final_day_of_week}, ${final_month} ${final_day}, ${final_year} at ${time}`;
  return formatted_date;
}

var list_of_books = await getAllBooks();
console.log(list_of_books);

var board = document.getElementById('board');
board.addEventListener("click", function() {
  openBoard(list_of_books);
});