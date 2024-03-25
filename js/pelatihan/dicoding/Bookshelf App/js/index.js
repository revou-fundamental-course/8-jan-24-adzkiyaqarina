const key = 'bookshelf';

/**
 * Save data to local storage
 * @param {Array} data
 */
function save(data) {
	localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Load data from local storage
 * @returns {Array} data
 */
function load() {
	return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * Insert new book to the bookshelf
 * @param {string} title
 * @param {string} author
 * @param {number} year
 * @param {boolean} isComplete
 */
function insert(title, author, year, isComplete) {
	const books = load();
	const id = Date.now().toString();
	const book = { id, title, author, year, isComplete };
	books.push(book);
	save(books);
}

/**
 * Update book data
 * @param {string} id
 * @param {Object} data
 */
function update(id, data) {
	const books = load();
	const index = books.findIndex((book) => book.id === id);
	books[index] = { ...books[index], ...data };
	save(books);
}

/**
 * Mark book as complete or uncomplete
 * @param {string} id
 * @returns {void}
 */
function complete(id) {
	const books = load();
	const index = books.findIndex((book) => book.id === id);

	// if book not found in the shelf, check local storage (should not happen, just in case)
	if (index === -1) {
		console.error('Book not found in the shelf, check local storage');
		return;
	}

	books[index].isComplete = !books[index].isComplete;
	save(books);
}

/**
 * Remove book from the bookshelf
 * @param {string} id
 * @returns {void}
 */
function remove(id) {
	const books = load();
	const index = books.findIndex((book) => book.id === id);
	books.splice(index, 1);
	save(books);
}

/**
 * Function to generate random color
 * @returns {string} hsl color
 */
function randomCssColor() {
	return `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`;
}

/**
 * Render single book to the shelf
 * @param {Object} book
 * @returns {string} html
 */
function render(book) {
	const html = String.raw;
	return html`
        <div class="book" data-id="${
			book.id
		}" style="background-color: ${randomCssColor()}">
            <h3>${book.title}</h3>
            <p class="author">${book.author}</p>
            <p class="year">${book.year}</p>
            <div class="action">
                <button id="complete">Complete</button>
                <button id="delete">Delete</button>
            </div>
        </div>
    `;
}

/**
 * Refresh the bookshelf
 * @returns {void}
 * @description
 * - Load books from local storage
 * - Render each book to the shelf
 * - If no book in each shelf, show message
 */
function refresh() {
	const books = load();
	const uncompleted = document.getElementById('uncompleted');
	const completed = document.getElementById('completed');

	uncompleted.innerHTML = '';
	completed.innerHTML = '';

	// render each book to the shelf
	books.forEach((book) => {
		const shelf = book.isComplete ? completed : uncompleted;
		shelf.innerHTML += render(book);
	});

	// if no book in each shelf, show message
	if (uncompleted.innerHTML === '')
		uncompleted.innerHTML = '<p class="empty">This shelf is empty</p>';
	if (completed.innerHTML === '')
		completed.innerHTML = '<p class="empty">This shelf is empty</p>';
}

document.addEventListener('DOMContentLoaded', () => {
	refresh();

	const form = document.getElementById('form');

	// form submit event
	form.addEventListener('submit', (event) => {
		event.preventDefault();

		const title = form.title.value;
		const author = form.author.value;
		const year = form.year.value;

		// validate
		if (!title || !author || !year) {
			alert('Please fill all fields');
			return;
		}

		insert(title, author, year, false);
		form.reset();
		refresh();
	});

	document.addEventListener('click', (event) => {
		// if target is not an element with id, return
		if (!event.target.id) return;

		// check whether the clicked element is delete or complete button
		if (!['delete', 'complete'].includes(event.target.id)) return;

		const book = event.target.closest('.book');
		const id = book.dataset.id;
		const action = event.target.id;

		if (action === 'delete') remove(id);
		else complete(id);
		refresh();
	});
});
