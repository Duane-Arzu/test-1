const API_URL = "http://localhost:8000/api/v1/books"; // Replace with your actual backend URL

document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const bookTable = document.getElementById("bookTable");

    // Fetch and display books
    const fetchBooks = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
const books = data.books || [];
            bookTable.innerHTML = books.map((book) => `
                <tr>
                    <td>${book.title}</td>
                    <td>${book.authors}</td>
                    <td>${book.isbn}</td>
                    <td>${book.average_rating}</td>
                    <td>
                        <button class="delete" onclick="deleteBook(${book.id})">Delete</button>
                    </td>
                </tr>
            `).join("");
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    // Add a new book
    bookForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const authors = document.getElementById("authors").value;
        const isbn = document.getElementById("isbn").value;
        const publication_date = document.getElementById("publication_date").value;
        const genre = document.getElementById("genre").value;
        const description = document.getElementById("description").value;

        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title, authors, isbn, publication_date, genre, description
                }),
            });
            bookForm.reset();
            fetchBooks();
        } catch (error) {
            console.error("Error adding book:", error);
        }
    });

    // Delete a book
    window.deleteBook = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            fetchBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    // Initialize by fetching books
    fetchBooks();
});
