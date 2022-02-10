// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron object

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this;
		setTimeout(function () {

			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function (name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements needed. */
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)


// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();


	// Add book book to global array

	const newBook = new Book(
		document.querySelector('#newBookName').value, document.querySelector('#newBookAuthor').value, document.querySelector('#newBookGenre').value
	);
	libraryBooks.push(newBook);


	// Call addBookToLibraryTable properly to add book to the DOM

	addBookToLibraryTable(newBook);



}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// given loanBookId, loanCardNum
	const bookId = document.getElementById('loanBookId').value;
	const cardNum = document.getElementById('loanCardNum').value;


	// Get correct book and patron
	const book = libraryBooks[bookId];
	const loaner = patrons[cardNum];

	//console.log(loaner);	

	// Add patron to the book's patron property
	book.patron = loaner;

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(book);

	// Start the book loan timer.
	book.setLoanTime();


}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e) {


	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	if (e.target.classList.contains('return')) {

		const bookToReturnId = e.target.parentElement.parentElement.children[0].innerText;
		console.log("RETURN ID" + bookToReturnId);

		// Call removeBookFromPatronTable()

		removeBookFromPatronTable(libraryBooks[bookToReturnId]);


		// Change the book object to have a patron of 'null'

		libraryBooks[bookToReturnId].patron = null;
	}

}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const patronName = document.getElementById('newPatronName').value;
	const patron = new Patron(patronName);
	patrons.push(patron);

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(patron);

}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();
	// Get correct book
	const bookId = document.getElementById('bookInfoId').value;
	const book = libraryBooks[bookId];

	// Call displayBookInfo()	
	displayBookInfo(book);




}

// Adds a book to the library table.
function addBookToLibraryTable(book) {


	const tableRow = document.createElement('tr');
	const bookIdColumn = document.createElement('td');
	const titleColumn = document.createElement('td');
	const patronCardNumberColumn = document.createElement('td');
	bookIdColumn.appendChild(document.createTextNode(`${book.bookId}`));
	titleColumn.appendChild(document.createTextNode(`${book.title}`));

	// Check if the patron is null
	if (book.patron) {
		patronCardNumberColumn.appendChild(document.createTextNode(`${book.patron.cardNumber}`));
	}

	tableRow.appendChild(bookIdColumn);
	tableRow.appendChild(titleColumn);
	tableRow.appendChild(patronCardNumberColumn);

	//console.log(document.getElementById('bookTable'));

	document.getElementById('bookTable').appendChild(tableRow);



}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {

	bookInfo.children[0].children[0].innerText = book.bookId;
	bookInfo.children[1].children[0].innerText = book.title;
	bookInfo.children[2].children[0].innerText = book.author;
	bookInfo.children[3].children[0].innerText = book.genre;
	bookInfo.children[4].children[0].innerText = book.patron ? book.patron.name : 'N/A';




}

// Adds a book to a patron's book list with a status of 'Within due date'. 
function addBookToPatronLoans(book) {


	const tableRow = document.createElement('tr');

	const bookIdColumn = document.createElement('td');
	bookIdColumn.appendChild(document.createTextNode(`${book.bookId}`));
	tableRow.appendChild(bookIdColumn);

	const bookTitleColumn = document.createElement('td');
	const bookTitleColumnContent = document.createElement('strong');
	bookTitleColumnContent.appendChild(document.createTextNode(`${book.title}`));
	bookTitleColumn.appendChild(bookTitleColumnContent);
	tableRow.appendChild(bookTitleColumn);

	const statusColumn = document.createElement('td');
	const statusColumnContent = document.createElement('span');
	statusColumnContent.className = 'green';
	statusColumnContent.appendChild(document.createTextNode('Within due date'));
	statusColumn.appendChild(statusColumnContent);
	tableRow.appendChild(statusColumn);

	const returnColumn = document.createElement('td');
	const returnColumnContent = document.createElement('button');
	returnColumnContent.className = 'return';
	returnColumnContent.appendChild(document.createTextNode('return'));
	returnColumn.appendChild(returnColumnContent);
	tableRow.appendChild(returnColumn);

	document.getElementById('patrons').children[book.patron.cardNumber].querySelector('.patronLoansTable').children[0].appendChild(tableRow);





}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {

	const patronTable = document.createElement('div');
	patronTable.className = 'patron';

	const columnName = document.createElement('p');
	const columnNameElement = document.createElement('span');
	columnName.appendChild(document.createTextNode('Name: '))
	columnNameElement.appendChild(document.createTextNode(`${patron.name}`));
	columnName.appendChild(columnNameElement);
	patronTable.appendChild(columnName);

	const columnCard = document.createElement('p');
	const columnCardElement = document.createElement('span');
	columnCard.appendChild(document.createTextNode('Card Number: '))
	columnCardElement.appendChild(document.createTextNode(`${patron.cardNumber}`));
	columnCard.appendChild(columnCardElement);
	patronTable.appendChild(columnCard);

	const bookLoanHeader = document.createElement('h4');
	bookLoanHeader.appendChild(document.createTextNode('Books on loan:'));
	patronTable.appendChild(bookLoanHeader);

	const patronLoanTable = document.createElement('table');
	patronLoanTable.className = 'patronLoansTable';
	const patronLoanTableBody = document.createElement('tbody');
	patronLoanTable.appendChild(patronLoanTableBody);
	const patronLoanTableRow = document.createElement('tr');


	const patronLoanTableRowBook = document.createElement('th');
	patronLoanTableRowBook.appendChild(document.createTextNode('BookID'));
	const patronLoanTableRowTitle = document.createElement('th');
	patronLoanTableRowTitle.appendChild(document.createTextNode('Title'));
	const patronLoanTableRowStatus = document.createElement('th');
	patronLoanTableRowStatus.appendChild(document.createTextNode('Status'));
	const patronLoanTableRowReturn = document.createElement('th');
	patronLoanTableRowReturn.appendChild(document.createTextNode('Return'));

	patronLoanTableRow.appendChild(patronLoanTableRowBook);
	patronLoanTableRow.appendChild(patronLoanTableRowTitle);
	patronLoanTableRow.appendChild(patronLoanTableRowStatus);
	patronLoanTableRow.appendChild(patronLoanTableRowReturn);

	patronLoanTableBody.appendChild(patronLoanTableRow);
	patronTable.appendChild(patronLoanTable);
	document.getElementById('patrons').appendChild(patronTable);








}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {



	const targetLoanTable = document.getElementById('patrons').children[book.patron.cardNumber].querySelector('.patronLoansTable');

	// Skip the set of headings, get the row values
	const targetTbody = targetLoanTable.children[0];
	console.log("TBODY");
	console.log(targetTbody);

	var rowToEliminate;
	var i;
	for (i = 0; i < targetTbody.children.length; i++) {
		// fetch the BookID from the first column in the row
		if (targetTbody.children[i].children[0].innerText == book.bookId) {
			rowToEliminate = i;
		}
	}

	targetTbody.removeChild(targetTbody.children[rowToEliminate]);





	// Add code here

}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {



	const targetLoanTable = document.getElementById('patrons').children[book.patron.cardNumber].querySelector('.patronLoansTable');

	const targetTbody = targetLoanTable.children[0];

	var rowToEliminate;
	var i;
	for (i = 0; i < targetTbody.children.length; i++) {
		// fetch the BookID from the first column in the row
		if (targetTbody.children[i].children[0].innerText == book.bookId) {
			rowToEliminate = i;
		}
	}

	// access the status column
	targetTbody.children[rowToEliminate].children[2].innerText = 'Overdue';
	targetTbody.children[rowToEliminate].children[2].className = 'red';





}

