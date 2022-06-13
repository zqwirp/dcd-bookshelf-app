const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "BOOKS";

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("submit-form");
  submitForm.addEventListener("submit", event => {
    event.preventDefault();
    handleSubmitBook();
    resetField();
  });

  if (isStorageExist()) loadDataFromStorage();
});

document.addEventListener(RENDER_EVENT, function () {
  const unfinishedBookShelf = document.getElementById("unfinished-shelf");
  unfinishedBookShelf.innerHTML = "";

  const finishedBookShelf = document.getElementById("finished-shelf");
  finishedBookShelf.innerHTML = "";

  for (const book of books) {
    const element = makeBookElement(book);

    if (book.status === false) {
      unfinishedBookShelf.append(element);
    } else {
      finishedBookShelf.append(element);
    }
  }

  console.clear();
  console.table(books);
});

function handleSubmitBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value || "-";
  const year = document.getElementById("year").value || "-";
  const status = document.getElementById("status").checked;
  const id = (function () {
    const time = +new Date();
    const n = time.toString();
    return n.slice(n.length - 7);
  })();

  const book = {
    id,
    title,
    author,
    year,
    status,
  };
  books.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBookElement(book) {
  const textTitle = document.createElement("div");
  textTitle.classList.add("book__title");
  textTitle.innerText = book.title;

  const textAuthor = document.createElement("div");
  textAuthor.classList.add("book__author");
  textAuthor.innerText = book.author;

  const textYear = document.createElement("div");
  textYear.classList.add("book__year");
  textYear.innerText = book.year;

  const textStatus = document.createElement("div");
  textStatus.classList.add("book__status");
  textStatus.innerText = book.status ? "Finished" : "Unfinished";

  const container = document.createElement("div");
  container.classList.add("book");
  container.append(textTitle, textAuthor, textYear, textStatus);
  container.setAttribute("id", `book-id-${book.id}`);

  if (book.status === false) {
    const checkButton = document.createElement("button");
    checkButton.innerText = "check";
    // checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      console.log("check button");
      moveBookToFinished(book.id);
    });

    container.append(checkButton);
  } else {
    const undoButton = document.createElement("button");
    undoButton.innerText = "undo";
    // undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      console.log("undo-button");
      moveBookToUnfinished(book.id);
    });
    container.append(undoButton);
  }

  const trashButton = document.createElement("button");
  trashButton.innerText = "remove";
  // trashButton.classList.add("trash-button");

  trashButton.addEventListener("click", function () {
    console.log("remove-button");
    removeBook(book.id);
  });

  container.append(trashButton);

  return container;
}

function moveBookToFinished(bookId) {
  const book = findBook(bookId);

  if (book == null) return;

  book.status = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function moveBookToUnfinished(bookId) {
  const book = findBook(bookId);

  if (book == null) return;

  book.status = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const book = findBookIndex(bookId);

  if (book === -1) return;

  books.splice(book, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Your browser doesn't support local storage.");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function resetField() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").valua = "";
}
