const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("submit-form");
  submitForm.addEventListener("submit", event => {
    event.preventDefault();
    handleSubmitBook();
  });

  // if (isStorageExist()) {
  //   loadDataFromStorage();
  // }
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
  // const uncompletedTODOList = document.getElementById("todos");
  // uncompletedTODOList.innerHTML = "";

  // const completedTODOList = document.getElementById("completed-todos");
  // completedTODOList.innerHTML = "";

  // for (const todoItem of todos) {
  //   const todoElement = makeTodo(todoItem);
  //   if (!todoItem.isCompleted) uncompletedTODOList.append(todoElement);
  //   else completedTODOList.append(todoElement);
  // }
});

function handleSubmitBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const status = document.getElementById("status").checked;
  const id = (function () {
    const now = +new Date();
    return now.toString();
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
  // saveData();
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
      // addTaskToCompleted(todoObject.id);
    });

    container.append(checkButton);
  } else {
    const undoButton = document.createElement("button");
    undoButton.innerText = "undo";
    // undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      console.log("undo-button");
      // undoTaskFromCompleted(todoObject.id);
    });
    container.append(undoButton);
  }

  const trashButton = document.createElement("button");
  trashButton.innerText = "remove";
  // trashButton.classList.add("trash-button");

  trashButton.addEventListener("click", function () {
    console.log("remove-button");
    // removeTaskFromCompleted(todoObject.id);
  });

  container.append(trashButton);

  return container;
}
