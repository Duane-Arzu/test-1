let API_URL = "http://localhost:8000/api/v1/books";

// Reusable fetch function
async function fetchBooks() {
  const bookTable = document.getElementById("bookTable");
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const books = data.books || [];

    bookTable.innerHTML = books.map(book => `
      <tr>
          <td>${book.title}</td>
          <td>${book.authors}</td>
          <td>${book.isbn}</td>
          <td>${book.average_rating}</td>
          <td>
              <button class="delete" onclick="deleteBook(${book.id})">Delete</button>
              <button class="edit" onclick="openEditModal(${book.id}, '${book.title}', '${book.authors}', '${book.isbn}')">Edit</button>
          </td>
      </tr>
    `).join("");
  } catch (error) {
    console.error("Error fetching books:", error);
    bookTable.innerHTML = "<tr><td colspan='5'>Failed to load books.</td></tr>";
  }
}

// Add new book
document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");

  if (bookForm) {
    bookForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const title = document.getElementById("title").value;
      const authors = document.getElementById("authors").value;
      const isbn = document.getElementById("isbn").value;
      const publication_date = document.getElementById("publication_date").value;
      const genre = document.getElementById("genre").value;
      const description = document.getElementById("description").value;

      let response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, authors, isbn, publication_date, genre, description })
      });

      let resp = await response.json();

      if (!resp.error) {
        location.href = "/books"; // redirect
      } else {
        if (resp.error.isbn) {
          document.getElementById("isbn-error").textContent = resp.error.isbn;
          document.getElementById("isbn").style.border = "1px solid red";
        }
        if (resp.error.title) {
          document.getElementById("title-error").textContent = resp.error.title;
          document.getElementById("title").style.border = "1px solid red";
        }
        if (resp.error.authors) {
          document.getElementById("authors-error").textContent = resp.error.authors;
          document.getElementById("authors").style.border = "1px solid red";
        }
      }
    });
  }

  fetchBooks(); // Load books when DOM is ready
});

// Expose to global for HTML buttons
window.deleteBook = async function (id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchBooks(); // Reload book list
  } catch (error) {
    console.error("Error deleting book:", error);
  }
};

window.openEditModal = function (id, title, authors, isbn) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-title").value = title;
  document.getElementById("edit-authors").value = authors;
  document.getElementById("edit-isbn").value = isbn;
  document.getElementById("editModal").style.display = "block";
};

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

// Edit book
document.getElementById("editForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const id = document.getElementById("edit-id").value;
  const updatedBook = {
    title: document.getElementById("edit-title").value,
    authors: document.getElementById("edit-authors").value,
    isbn: document.getElementById("edit-isbn").value
  };

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBook)
    });
    closeEditModal();
    fetchBooks(); // Refresh without full reload
  } catch (error) {
    console.error("Error updating book:", error);
  }
});
