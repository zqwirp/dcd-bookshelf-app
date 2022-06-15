const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "BOOKS";

document.addEventListener("DOMContentLoaded", () => {
  resetField();

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
  const author = document.getElementById("author").valu;
  const year = document.getElementById("year").value;
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
  const generateRow = (desc, prop) => {
    const descText = document.createElement("td");
    descText.innerText = desc;
    const colon = document.createElement("td");
    colon.innerText = "\xa0:\xa0";
    const text = document.createElement("td");
    text.innerText = prop;
    const row = document.createElement("tr");
    row.append(descText, colon, text);
    return row;
  };

  const title = generateRow("Title", book.title);
  const author = generateRow("Author", book.author);
  const year = generateRow("Year", book.year);

  const infoWrapper = document.createElement("table");
  infoWrapper.classList.add("info");
  infoWrapper.append(title, author, year);

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.classList.add("buttons");

  if (book.status === false) {
    const checkButton = document.createElement("button");
    checkButton.classList.add("book__button", "check");

    checkButton.addEventListener("click", function () {
      moveBookToFinished(book.id);
    });

    buttonsWrapper.append(checkButton);
  } else {
    const undoButton = document.createElement("button");
    undoButton.classList.add("book__button", "undo");

    undoButton.addEventListener("click", function () {
      moveBookToUnfinished(book.id);
    });
    buttonsWrapper.append(undoButton);
  }

  const trashButton = document.createElement("button");
  trashButton.classList.add("book__button", "trash");

  trashButton.addEventListener("click", function () {
    removeBook(book.id);
  });

  buttonsWrapper.append(trashButton);

  const container = document.createElement("div");
  container.classList.add("book");
  container.append(infoWrapper, buttonsWrapper);
  container.setAttribute("id", `book-id-${book.id}`);

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
  document.getElementById("year").value = "";
  document.getElementById("status").checked = false;
}
