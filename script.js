document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  const searchBookForm = document.getElementById("searchBook");

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  function saveBookToStorage() {
    const incompleteBooks = Array.from(
      incompleteBookshelfList.querySelectorAll(".book_item")
    ).map((book) => getBookInfo(book));

    const completeBooks = Array.from(
      completeBookshelfList.querySelectorAll(".book_item")
    ).map((book) => getBookInfo(book));

    localStorage.setItem("incompleteBooks", JSON.stringify(incompleteBooks));
    localStorage.setItem("completeBooks", JSON.stringify(completeBooks));
  }

  function loadBookFromStorage() {
    const incompleteBooks =
      JSON.parse(localStorage.getItem("incompleteBooks")) || [];
    const completeBooks =
      JSON.parse(localStorage.getItem("completeBooks")) || [];

    incompleteBooks.forEach(function (book) {
      const bookElement = makeBookElement(book);
      incompleteBookshelfList.appendChild(bookElement);
    });

    completeBooks.forEach(function (book) {
      const bookElement = makeBookElement(book);
      completeBookshelfList.appendChild(bookElement);
    });
  }

  loadBookFromStorage();

  function addBook() {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById(
      "inputBookIsComplete"
    ).checked;

    const book = {
      id: +new Date(),
      title: inputBookTitle,
      author: inputBookAuthor,
      year: parseInt(inputBookYear),
      isComplete: inputBookIsComplete,
    };

    const bookElement = makeBookElement(book);
    if (inputBookIsComplete) {
      completeBookshelfList.appendChild(bookElement);
    } else {
      incompleteBookshelfList.appendChild(bookElement);
    }

    saveBookToStorage();
  }

  function makeBookElement(book) {
    const bookElement = document.createElement("article");
    bookElement.classList.add("book_item");
    bookElement.dataset.id = book.id;

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis: " + book.author;

    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun: " + book.year;

    const bookAction = document.createElement("div");
    bookAction.classList.add("action");

    const buttonActionDelete = document.createElement("button");
    buttonActionDelete.classList.add("red");
    buttonActionDelete.innerText = "Hapus buku";
    buttonActionDelete.addEventListener("click", function () {
      if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
        bookElement.remove();
        saveBookToStorage();
        alert("Buku berhasil dihapus.");
      }
    });
    bookAction.appendChild(buttonActionDelete);

    const buttonActionComplete = document.createElement("button");
    buttonActionComplete.classList.add("green");
    buttonActionComplete.innerText = book.isComplete
      ? "Belum selesai membaca"
      : "Selesai dibaca";
    buttonActionComplete.addEventListener("click", function () {
      book.isComplete = !book.isComplete;

      if (book.isComplete) {
        completeBookshelfList.appendChild(bookElement);
        buttonActionComplete.innerText = "Belum selesai membaca";
      } else {
        incompleteBookshelfList.appendChild(bookElement);
        buttonActionComplete.innerText = "Selesai dibaca";
      }

      saveBookToStorage();
    });
    bookAction.appendChild(buttonActionComplete);

    bookElement.appendChild(bookTitle);
    bookElement.appendChild(bookAuthor);
    bookElement.appendChild(bookYear);
    bookElement.appendChild(bookAction);

    return bookElement;
  }

  function searchBook() {
    const searchBookTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const allBooks = document.querySelectorAll(".book_item");

    allBooks.forEach(function (book) {
      const title = book.querySelector("h3");
      if (title && title.innerText.toLowerCase().includes(searchBookTitle)) {
        book.style.display = "block";
      } else {
        book.style.display = "none";
      }
    });
  }

  function getBookInfo(bookElement) {
    const id = bookElement.dataset.id;
    const titleElement = bookElement.querySelector("h3");
    const authorElement = bookElement.querySelector("p:nth-of-type(1)"); // Index 0 untuk penulis
    const yearElement = bookElement.querySelector("p:nth-of-type(2)"); // Index 1 untuk tahun

    const title = titleElement ? titleElement.innerText : "";
    const author = authorElement
      ? authorElement.innerText.replace("Penulis: ", "")
      : "";
    const year = yearElement
      ? parseInt(yearElement.innerText.replace("Tahun: ", ""))
      : 0;

    const isComplete = bookElement.parentNode.id === "completeBookshelfList";

    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }
});
