// Filename: cmd/api/routes.go
package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (a *applicationDependencies) routes() http.Handler {

	router := httprouter.New()

	router.NotFound = http.HandlerFunc(a.notFoundResponse)

	router.MethodNotAllowed = http.HandlerFunc(a.methodNotAllowedResponse)

	// Section for Books
	router.HandlerFunc(http.MethodGet, "/api/v1/healthcheck", a.healthcheckHandler)
	router.HandlerFunc(http.MethodGet, "/api/v1/books/:bid", a.displayBookHandler)
	router.HandlerFunc(http.MethodGet, "/api/v1/books", a.listBooksHandler)
	router.HandlerFunc(http.MethodGet, "/api/v1/book/search", a.searchBookHandler)
	router.HandlerFunc(http.MethodPost, "/api/v1/books", a.createBookHandler)
	router.HandlerFunc(http.MethodPatch, "/api/v1/books/:bid", a.updateBookHandler)
	router.HandlerFunc(http.MethodDelete, "/api/v1/books/:bid", a.deleteBookHandler)

	// Section for Reading Lists
	router.HandlerFunc(http.MethodGet, "/api/v1/lists", a.requireActivatedUser(a.ReadinglistHandler))
	router.HandlerFunc(http.MethodGet, "/api/v1/lists/:lid", a.requireActivatedUser(a.displayReadingListHandler))
	router.HandlerFunc(http.MethodPost, "/api/v1/lists", a.requireActivatedUser(a.createReadingListHandler))
	router.HandlerFunc(http.MethodPatch, "/api/v1/lists/:lid", a.requireActivatedUser(a.updateReadingListHandler))
	router.HandlerFunc(http.MethodDelete, "/api/v1/lists/:lid", a.requireActivatedUser(a.deleteReadingListHandler))
	router.HandlerFunc(http.MethodPost, "/api/v1/lists/:lid/books", a.requireActivatedUser(a.addReadingListBookHandler))
	router.HandlerFunc(http.MethodDelete, "/api/v1/lists/:lid/books", a.requireActivatedUser(a.RemoveReadingListBookHandler))

	// Section for Reviews
	router.HandlerFunc(http.MethodPost, "/api/v1/books/:bid/reviews", a.createReviewHandler)
	router.HandlerFunc(http.MethodGet, "/api/v1/books/:bid/reviews", a.bookReviewsHandler)
	router.HandlerFunc(http.MethodGet, "/api/v1/books/:bid/reviews/:rid", a.displayReviewHandler)
	router.HandlerFunc(http.MethodPatch, "/api/v1/reviews/:rid", a.updateReviewHandler)
	router.HandlerFunc(http.MethodDelete, "/api/v1/reviews/:rid", a.deleteReviewHandler)

	// Users Section
	// =============
	router.HandlerFunc(http.MethodPut, "/api/v1/users/activated", a.activateUserHandler)
	router.HandlerFunc(http.MethodGet, "/api/v1/users/:uid", a.listUserProfileHandler)
	router.HandlerFunc(http.MethodGet, "/api/v1/users/:uid/reviews", a.getUserReviewsHandler)
	router.HandlerFunc(http.MethodGet, "/api/v1/users/:uid/lists", a.getUserListsHandler)
	router.HandlerFunc(http.MethodPost, "/api/v1/tokens/authentication", a.createAuthenticationTokenHandler)
	router.HandlerFunc(http.MethodPost, "/api/v1/users", a.registerUserHandler)

	// Serve index.html directly
	router.HandlerFunc(http.MethodGet, "/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./ui/html/index.html")
	})

	// router.HandlerFunc(http.MethodGet, "/", a.requireActivatedUser(func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "./ui/html/index.html")
	// }))
	router.HandlerFunc(http.MethodGet, "/books", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./ui/html/books.html")
	})
	// router.HandlerFunc(http.MethodGet, "/books", a.requireActivatedUser(func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "./ui/html/books.html")
	// }))

	// Serve all static files under /static (CSS, JS, images, etc.)
	fileServer := http.FileServer(http.Dir("./ui/static"))
	router.Handler(http.MethodGet, "/static/*filepath", http.StripPrefix("/static", fileServer))

	return a.recoverPanic(a.rateLimit(a.authenticate(router)))
	//----------------------------------------------------------------------------
	// // Public routes
	// router.HandlerFunc(http.MethodPost, "/api/v1/books", a.createBookHandler)
	// router.HandlerFunc(http.MethodGet, "/api/v1/books", a.listBooksHandler)

	// // Protected routes
	// protected := httprouter.New()
	// protected.HandlerFunc(http.MethodGet, "/api/v1/books/:id", a.requireActivatedUser(a.displBookHandler))
	// protected.HandlerFunc(http.MethodPut, "/api/v1/books/:id", a.requireActivatedUser(a.updateBookHandler))
	// protected.HandlerFunc(http.MethodDelete, "/api/v1/books/:id", a.requireActivatedUser(a.deleteBookHandler))

	// // Combine both
	// final := http.NewServeMux()
	// final.Handle("/", a.authenticate(router))                 // Public routes (still sets user but doesn't block)
	// final.Handle("/api/v1/books/", a.authenticate(protected)) // Protected routes

	// // Static files
	// fileServer := http.FileServer(http.Dir("./ui/static/"))
	// final.Handle("/static/", http.StripPrefix("/static", fileServer))

	//return a.recoverPanic(a.enableCORS(a.rateLimit(final)))
}
