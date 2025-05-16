import { dateParser, handleMobileOrResize, checkInfoModalStatus } from "./utils.js";
import { getCommunalNotesForBook, uploadCommunalNote, getAllBooks, getAllCommunalNotes } from "./baserow.js";

async function createBooksOnShelf(books) {
  books.forEach((book, index) => {
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
    book_div.addEventListener("click", async function() {
      await openBook(book);
    });

    shelf_container.appendChild(book_div);
  });
}

// create book
async function createBook(book) {
  var book_div = document.createElement('div');
  book_div.id = 'book';

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

  // add entry to communal notes to right page
  // div containing buttons to add note or see notes
  var see_or_add_notes_div = document.createElement('div');
  see_or_add_notes_div.id = "see-or-add-notes";

  // add div to lead to adding a note, which will hide book and create form
  var add_note_link = document.createElement('a');
  add_note_link.id = 'add-note-link-on-book-page';
  add_note_link.innerText = "add your own note ⋆˚࿔";

  // add div to see communal notes
  var see_notes_link = document.createElement('a');
  see_notes_link.id = 'see-notes-link-on-book-page'
  see_notes_link.innerText = "see communal notes ᝰ";

  see_or_add_notes_div.appendChild(see_notes_link);
  see_or_add_notes_div.appendChild(add_note_link);

  page_right_div.appendChild(see_or_add_notes_div);

  // append pages and back cover to book cover
  book_cover_div.appendChild(back_cover_div);
  book_cover_div.appendChild(page_right_div);
  book_cover_div.appendChild(page_left_div);

  // append book cover to book
  book_div.appendChild(book_cover_div);

  return book_div;
}

// create the close button
function createCloseButton() {
  var close_button = document.createElement('button');
  close_button.innerHTML = '&times;'; // Use an "X" symbol
  close_button.style.cursor = 'pointer';
  close_button.id = 'close-button';

  return close_button;
}

async function openBook(book) {
  var open_book_modal = document.getElementById('book-modal');

  var book_div = await createBook(book);
  var close_button = createCloseButton();

  // append close button and book div to modal
  open_book_modal.appendChild(close_button);
  open_book_modal.appendChild(book_div);
  open_book_modal.className = 'opened-book-modal';

  var overall_communal_note_form = await addCommunalNoteFormToPage(book.id);
  var overall_communal_notes_div = await addCommunalNotesToPage(book.id);

  var add_note_link = document.getElementById('add-note-link-on-book-page');
  var see_notes_link = document.getElementById('see-notes-link-on-book-page');

  add_note_link.addEventListener("click", async function() {
    book_div.style.display = "none";

    var overall_communal_note_form = document.getElementById('overall-add-communal-note-form');

    if (overall_communal_note_form) {
      overall_communal_note_form.remove();
    }
    overall_communal_note_form = await addCommunalNoteFormToPage(book.id);
    overall_communal_note_form.style.display = 'flex';

    var thanks_div = document.getElementById('thanks');
    if (thanks_div) {
      thanks_div.remove();
    }

    if (overall_communal_notes_div) {
      overall_communal_notes_div.remove();
    }
    // add form to open book modal
    open_book_modal.appendChild(overall_communal_note_form);
  });

  see_notes_link.addEventListener("click", async function() {
    book_div.style.display = "none";

    var overall_communal_notes_div = document.getElementById('overall-communal-notes');

    if (overall_communal_notes_div) {
      overall_communal_notes_div.remove();
    }

    overall_communal_notes_div = await addCommunalNotesToPage(book.id);
    overall_communal_notes_div.style.display = "flex";

    var thanks_div = document.getElementById('thanks');
    if (thanks_div) {
      thanks_div.remove();
    }

    if (overall_communal_note_form) {
      overall_communal_note_form.remove();
    }
  
    // add communal_notes to open book modal
    open_book_modal.appendChild(overall_communal_notes_div);
  });

  // on click, remove the book, and close the modal!
  close_button.addEventListener("click", function() {
    book_div.remove();

    var overall_communal_notes_div = document.getElementById('overall-communal-notes');
    if (overall_communal_notes_div) {
      overall_communal_notes_div.remove();
    }

    var overall_communal_note_form = document.getElementById('overall-add-communal-note-form');
    if (overall_communal_note_form) {
      overall_communal_note_form.remove();
    }
  
    var thanks_div = document.getElementById('thanks');
    if (thanks_div) {
      thanks_div.remove();
    }
    open_book_modal.classList = [];
    close_button.remove();
    open_book_modal.close();
  });

  // once modal is built from book information, show it
  open_book_modal.showModal();
}

async function addCommunalNotesToPage(book_id) {
  var communal_notes_data = await getCommunalNotesForBook(book_id);

  var overall_communal_notes_div = document.createElement('div');
  overall_communal_notes_div.id = "overall-communal-notes";
  overall_communal_notes_div.style.display = "none";

  var communal_notes_h1 = document.createElement('h1');
  communal_notes_h1.id = "communal-notes-title";
  communal_notes_h1.innerText = "communal notes ⋆✴︎˚｡⋆";

  var communal_notes_title = document.createElement('div');
  communal_notes_title.id = "communal-notes-title-div";
  communal_notes_title.appendChild(communal_notes_h1);

  // div containing links to return to book or see notes
  var add_or_turn_div = document.createElement('div');
  add_or_turn_div.id = "add-or-return";

  // link to return to book
  var return_to_book = document.createElement('a');
  return_to_book.innerHTML = "↜ go back to book ⋆˙⟡";
  return_to_book.id = 'return-to-book';

  var book_div = document.getElementById('book');

  return_to_book.addEventListener("click", function() {
    book_div.style.display = "flex";

    var overall_communal_note_form = document.getElementById('overall-add-communal-note-form');
    if (overall_communal_note_form) {
      overall_communal_note_form.remove();
    }

    var overall_communal_notes_div = document.getElementById('overall-communal-notes');
    if (overall_communal_notes_div) {
      overall_communal_notes_div.remove();
    }
  });

  // add div to lead to adding a note, which will hide book and communal notes
  var add_note_link = document.createElement('a');
  add_note_link.innerText = "add your own note ⋆˚࿔";
  add_note_link.id = "add-note-link";


  add_note_link.addEventListener("click", async function() {
    var overall_communal_note_form = document.getElementById('overall-add-communal-note-form');

    if(!overall_communal_note_form) {
      var overall_communal_note_form = await addCommunalNoteFormToPage(book_id);
      var open_book_modal = document.getElementById('book-modal');
  
      // add form to open book modal
      open_book_modal.appendChild(overall_communal_note_form);
    }

    var overall_communal_notes_div = document.getElementById('overall-communal-notes');
  
    if (overall_communal_notes_div) {
      overall_communal_notes_div.remove();
    }
    overall_communal_note_form.style.display = "flex";
  });

  add_or_turn_div.appendChild(return_to_book);
  add_or_turn_div.appendChild(add_note_link);
  overall_communal_notes_div.appendChild(add_or_turn_div);
  overall_communal_notes_div.appendChild(communal_notes_title);

  var notes_only_div = document.createElement('div');
  notes_only_div.id = 'notes-only';

  if (!communal_notes_data || communal_notes_data.length === 0) {
    var note_para = document.createElement('p');
    note_para.className = "individual-note";
    note_para.innerText = "there are currently no notes in this book... perhaps you can add your own!";
    notes_only_div.appendChild(note_para);
  } else {
    communal_notes_data.forEach(note => {
      var note_para = document.createElement('p');
      note_para.className = "individual-note";
      var initials;
      if (!note.initials) {
        initials = "anonymous";
      } else {
        initials = note.initials;
      }
      note_para.innerHTML = "<u><i>" + initials + "</i></u>" + ": " + note.note;
      notes_only_div.appendChild(note_para);
    })
  };

  overall_communal_notes_div.appendChild(notes_only_div);

  return overall_communal_notes_div;
}

function createFormContent(book_id) {
  // div that contains form content
  var communal_note_form_content_div = document.createElement('div');
  communal_note_form_content_div.id = "communal-note-form-container";

  var note_label = createNoteLabel();
  var note_input = createNoteInput();

  var initials_label = createInitialsLabel();
  var initials_input = createInitialsInput();

  var add_note_button = createSubmitButton(book_id);

  communal_note_form_content_div.appendChild(note_label);
  communal_note_form_content_div.appendChild(note_input);
  communal_note_form_content_div.appendChild(initials_label);
  communal_note_form_content_div.appendChild(initials_input);
  communal_note_form_content_div.appendChild(add_note_button);
  return communal_note_form_content_div;
}

function createNoteLabel() {
  // note label and input
  var note_label = document.createElement('label');
  note_label.for = "note";
  note_label.innerText = "note: ";

  return note_label;
}

function createNoteInput() {
  var note_input = document.createElement('textarea');
  note_input.required = true;
  note_input.id = "note";
  note_input.class = "req";
  note_input.name = "note";
  note_input.placeholder = "share your thoughts here...";

  return note_input;
}

function createInitialsLabel() {
  // initials lable and input
  var initials_label = document.createElement('label');
  initials_label.for = "initials";
  initials_label.innerText = "initials: ";
  return initials_label;
}

function createInitialsInput() {
  var initials_input = document.createElement('input');
  initials_input.type = "text";
  initials_input.id = "initials";
  initials_input.name = "initials";
  initials_input.placeholder = "... or anon!";
  initials_input.maxLength = 6;
  return initials_input;
}

function createSubmitButton(book_id) {
  // submission button
  var add_note_button = document.createElement('input');
  add_note_button.type = "button";
  add_note_button.id = "add-communal-note-button";
  add_note_button.value = "add your note ♡";

  add_note_button.addEventListener("click", async function() {
    var overall_communal_note_form = document.getElementById('overall-add-communal-note-form');

    await uploadCommunalNote(book_id);

    if (overall_communal_note_form) {
      overall_communal_note_form.remove();
    }

    var thanks_div = document.createElement('div');
    thanks_div.id = "thanks";
    var thanks_h1 = document.createElement('h1');
    thanks_h1.innerText = "you've added a note! ♡";

    thanks_div.appendChild(see_or_return_div);
    thanks_div.appendChild(thanks_h1);
    var open_book_modal = document.getElementById('book-modal');
    // add form to open book modal
    open_book_modal.appendChild(thanks_div);
  });

  return add_note_button;
}

// add communal notes addition form
async function addCommunalNoteFormToPage(book_id) {
  var book = document.getElementById('book');
  // create overall communal note form, which contains the following:
  // see or return
  // form
  var overall_communal_note_form = document.createElement('div');
  overall_communal_note_form.id = 'overall-add-communal-note-form';
  overall_communal_note_form.style.display = "none";

  // div containing links to return to book or see notes
  var see_or_return_div = document.createElement('div');
  see_or_return_div.id = "see-or-return";

  // link to return to book
  var return_to_book = document.createElement('a');
  return_to_book.innerHTML = "↜ go back to book ⋆˙⟡";
  return_to_book.id = 'return-to-book';

  return_to_book.addEventListener("click", function() {
    book.style.display = "flex";

    var overall_communal_note_form = document.getElementById('overall-add-communal-note-form');
    if (overall_communal_note_form) {
      overall_communal_note_form.remove();
    }

    var overall_communal_notes_div = document.getElementById('overall-communal-notes');
    if (overall_communal_notes_div) {
      overall_communal_notes_div.remove();
    }

    var thanks_div = document.getElementById('thanks');
    if (thanks_div) {
      thanks_div.remove();
    }
  });

  // link to see communal notes
  var see_notes_link = document.createElement('a');
  see_notes_link.innerText = "↜ see communal notes ⋆✴︎˚｡⋆";
  see_notes_link.id = "see-note-link";

  see_notes_link.addEventListener("click", async function() {
    book.style.display = "none";
    var overall_communal_notes_div = document.getElementById('overall-communal-notes');

    if (overall_communal_notes_div) {
      overall_communal_notes_div.remove();
    }

    overall_communal_notes_div = await addCommunalNotesToPage(book_id);
    overall_communal_notes_div.style.display = "flex";
    var open_book_modal = document.getElementById('book-modal');
    // add form to open book modal
    open_book_modal.appendChild(overall_communal_notes_div);
  
    overall_communal_note_form.remove();

    var thanks_div = document.getElementById('thanks');
    if (thanks_div) {
      thanks_div.remove();
    }
  });

  see_or_return_div.appendChild(return_to_book);
  see_or_return_div.appendChild(see_notes_link);

  var title_div = document.createElement('div');
  title_div.id = 'add-form-title-div';

  // title
  var form_title = document.createElement('h1');
  form_title.id = 'add-communal-notes-title';
  form_title.innerText = "leave a note in this book ⋆˚࿔<";
  title_div.appendChild(form_title);

  // form
  var communal_note_form = document.createElement('form');
  communal_note_form.id = "communal-note-info";

  var communal_note_form_content_div = createFormContent(book_id);
  communal_note_form.appendChild(communal_note_form_content_div);

  // add divs to overall container
  overall_communal_note_form.appendChild(see_or_return_div);
  overall_communal_note_form.appendChild(title_div);
  overall_communal_note_form.appendChild(communal_note_form);

  return overall_communal_note_form;
}

function openInfo() {
  var open_info_modal = document.getElementById('info-modal');
  var close_button = document.getElementById('close-button');
  open_info_modal.className = 'opened-book-modal';

  // on click, remove the book, and close the modal!
  close_button.addEventListener("click", function() {
    open_info_modal.classList = [];
    open_info_modal.close();
  });

  // once modal is built from books and notes, show it
  open_info_modal.showModal();
}

// TODO: add communal notes additions too
async function openBoard(notes, books) {
  var open_board_modal = document.getElementById('board-modal');

  // board
  var board_div = document.createElement('div');
  board_div.id = 'board-content';

  var board_title = document.createElement('h2');
  board_title.innerText = 'LIBRARY LOGS:'
  board_div.appendChild(board_title);

  var book_logs_div = document.createElement('div');
  book_logs_div.id = 'board-book-logs';
  book_logs_div.style.display = "flex";

  var communal_notes_logs_div = document.createElement('div');
  communal_notes_logs_div.id = 'board-communal-notes-logs';
  communal_notes_logs_div.style.display = "none";

  // add a log of communal notes additions
  notes.forEach(note => {
     // new paragraph with when the book was added and by whom
     var para = document.createElement('p');

     // set initials to 'anonymous' if none were provided
     var notes_initials;
     if (!note.initials) {
       notes_initials = 'anonymous'
     } else {
       notes_initials = note.initials; 
     }
 
     para.innerHTML = "~~~ " + notes_initials + " added a note to <u>" + note.book[0].value;
     para.innerHTML += " on " + dateParser(note.posted) + ".";
 
     communal_notes_logs_div.appendChild(para);
  })

  // add a log of book additions
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

    book_logs_div.appendChild(para);
  });

  var buttons_div = document.createElement('div');
  buttons_div.id = "board-buttons";
  var books_button = document.createElement('button');
  books_button.className = "board-button";
  books_button.id = "books-button-toggled";
  books_button.innerText = "books";
  var notes_button = document.createElement('button');
  notes_button.className = "board-button";
  notes_button.id = "notes-button";
  notes_button.innerText = "notes";

  books_button.addEventListener("click", function () {
    book_logs_div.style.display = "flex";
    communal_notes_logs_div.style.display = "none";
    notes_button.id = 'notes-button';
    books_button.id = 'books-button-toggled';
  });

  notes_button.addEventListener("click", function () {
    communal_notes_logs_div.style.display = "flex";
    book_logs_div.style.display = "none";
    notes_button.id = 'notes-button-toggled';
    books_button.id = 'books-button';
  })

  buttons_div.appendChild(books_button);
  buttons_div.appendChild(notes_button);

  board_div.append(buttons_div);
  board_div.append(book_logs_div);
  board_div.append(communal_notes_logs_div);

  // create the close button
  var close_button = document.createElement('button');
  close_button.innerHTML = '&times;'; // Use an "X" symbol
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

// run page!
async function main() {
  // before anything, check for correct size of screen
  handleMobileOrResize();
  window.addEventListener("resize", handleMobileOrResize);

  // on page load, check if info modal needs to be shown again
  window.addEventListener("load", function() {
    checkInfoModalStatus()
  })

  var info = document.getElementById('info');
  info.addEventListener("click", openInfo);

  // get all books from database to load into bookshelves
  var list_of_books = await getAllBooks();
  await createBooksOnShelf(list_of_books);

  var notes = await getAllCommunalNotes();
  
  // add logs from list of books from database to bulletin board
  var board = document.getElementById('board');
  board.addEventListener("click", async function() {
    await openBoard(notes, list_of_books);
  });
}

main();