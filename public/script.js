const API_BASE_URL = 'http://localhost:3000';
let allBooks = [];
let filteredBooks = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    getAllBooks();
});

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked nav tab
    event.target.classList.add('active');
    
    // Refresh data if switching to dashboard
    if (tabName === 'dashboard') {
        getAllBooks();
    }
}

// Utility function to display response
function displayResponse(elementId, data, isError = false) {
    const element = document.getElementById(elementId);
    element.style.display = 'block';
    element.className = `response ${isError ? 'error' : 'success'}`;
    element.textContent = JSON.stringify(data, null, 2);
}

// Show toast notification
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : 'success'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Get all books
async function getAllBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        const data = await response.json();
        
        if (response.ok) {
            allBooks = data;
            filteredBooks = [...allBooks];
            displayBooksGrid(filteredBooks);
            updateStatistics(allBooks);
            populateYearFilter(allBooks);
        } else {
            showToast('Failed to fetch books', true);
        }
    } catch (error) {
        showToast('Error connecting to server', true);
        console.error('Error:', error);
    }
}

// Display books in grid format
function displayBooksGrid(books) {
    const grid = document.getElementById('booksGrid');
    
    if (!books || books.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;"><i class="fas fa-book-open"></i><br>No books found</p>';
        return;
    }
    
    grid.innerHTML = books.map(book => `
        <div class="book-card">
            <h4>${book.title}</h4>
            <div class="book-info">
                <p><i class="fas fa-user"></i> <strong>Author:</strong> ${book.author || 'N/A'}</p>
                <p><i class="fas fa-calendar"></i> <strong>Year:</strong> ${book.publishedYear || 'N/A'}</p>
                <p><i class="fas fa-tag"></i> <strong>ID:</strong> ${book._id}</p>
            </div>
            <div class="book-actions">
                <button onclick="fillUpdateForm('${book._id}', '${escapeQuotes(book.title)}', '${escapeQuotes(book.author || '')}', '${book.publishedYear || ''}')" class="btn-success">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteBookFromCard('${book._id}')" class="btn-danger">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Escape quotes for HTML attributes
function escapeQuotes(str) {
    return str ? str.replace(/'/g, '&#39;').replace(/"/g, '&quot;') : '';
}

// Update statistics
function updateStatistics(books) {
    const totalBooks = books.length;
    const uniqueAuthors = new Set(books.filter(book => book.author).map(book => book.author)).size;
    const years = books.filter(book => book.publishedYear).map(book => book.publishedYear);
    const latestYear = years.length > 0 ? Math.max(...years) : '-';
    const oldestYear = years.length > 0 ? Math.min(...years) : '-';
    
    document.getElementById('totalBooks').textContent = totalBooks;
    document.getElementById('totalAuthors').textContent = uniqueAuthors;
    document.getElementById('latestYear').textContent = latestYear;
    document.getElementById('oldestYear').textContent = oldestYear;
}

// Populate year filter dropdown
function populateYearFilter(books) {
    const yearFilter = document.getElementById('yearFilter');
    const years = [...new Set(books.filter(book => book.publishedYear).map(book => book.publishedYear))].sort((a, b) => b - a);
    
    yearFilter.innerHTML = '<option value="">All Years</option>';
    years.forEach(year => {
        yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
    });
}

// Filter books
function filterBooks() {
    const titleSearch = document.getElementById('searchTitle').value.toLowerCase();
    const authorSearch = document.getElementById('searchAuthor').value.toLowerCase();
    const yearFilter = document.getElementById('yearFilter').value;
    
    filteredBooks = allBooks.filter(book => {
        const titleMatch = !titleSearch || book.title.toLowerCase().includes(titleSearch);
        const authorMatch = !authorSearch || (book.author && book.author.toLowerCase().includes(authorSearch));
        const yearMatch = !yearFilter || book.publishedYear == yearFilter;
        
        return titleMatch && authorMatch && yearMatch;
    });
    
    displayBooksGrid(filteredBooks);
}

// Clear filters
function clearFilters() {
    document.getElementById('searchTitle').value = '';
    document.getElementById('searchAuthor').value = '';
    document.getElementById('yearFilter').value = '';
    filteredBooks = [...allBooks];
    displayBooksGrid(filteredBooks);
}

// Export books to JSON
function exportBooks() {
    const dataStr = JSON.stringify(allBooks, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `books_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Books exported successfully!');
}

// Add single book
async function addSingleBook() {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const publishedYear = document.getElementById('publishedYear').value;
    
    if (!title) {
        displayResponse('addBookResponse', { error: 'Title is required' }, true);
        return;
    }
    
    const bookData = { title };
    if (author) bookData.author = author;
    if (publishedYear) bookData.publishedYear = parseInt(publishedYear);
    
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayResponse('addBookResponse', data);
            const authorInfo = data.author ? ` by ${data.author}` : '';
            const yearInfo = data.publishedYear ? ` (${data.publishedYear})` : '';
            showToast(`Book "${data.title}"${authorInfo}${yearInfo} added successfully`);
            // Clear form
            document.getElementById('title').value = '';
            document.getElementById('author').value = '';
            document.getElementById('publishedYear').value = '';
            // Refresh books list
            getAllBooks();
        } else {
            displayResponse('addBookResponse', data, true);
            showToast('Failed to add book', true);
        }
    } catch (error) {
        displayResponse('addBookResponse', { error: error.message }, true);
        showToast('Error adding book', true);
    }
}

// Add multiple books
async function addMultipleBooks() {
    const bulkBooksText = document.getElementById('bulkBooks').value.trim();
    
    if (!bulkBooksText) {
        displayResponse('bulkResponse', { error: 'Please enter books JSON array' }, true);
        return;
    }
    
    try {
        const booksData = JSON.parse(bulkBooksText);
        
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booksData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayResponse('bulkResponse', data);
            const count = Array.isArray(data) ? data.length : 1;
            showToast(`${count} books added successfully`);
            document.getElementById('bulkBooks').value = '';
            getAllBooks();
        } else {
            displayResponse('bulkResponse', data, true);
            showToast('Failed to add books', true);
        }
    } catch (error) {
        displayResponse('bulkResponse', { error: 'Invalid JSON format: ' + error.message }, true);
        showToast('Invalid JSON format', true);
    }
}

// Load sample data
function loadSampleData() {
    const sampleData = [
        {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "publishedYear": 1925
        },
        {
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "publishedYear": 1960
        },
        {
            "title": "1984",
            "author": "George Orwell",
            "publishedYear": 1949
        },
        {
            "title": "Pride and Prejudice",
            "author": "Jane Austen",
            "publishedYear": 1813
        },
        {
            "title": "The Catcher in the Rye",
            "author": "J.D. Salinger",
            "publishedYear": 1951
        }
    ];
    
    document.getElementById('bulkBooks').value = JSON.stringify(sampleData, null, 2);
    showToast('Sample data loaded!');
}

// Validate JSON
function validateJSON() {
    const bulkBooksText = document.getElementById('bulkBooks').value.trim();
    
    if (!bulkBooksText) {
        displayResponse('bulkResponse', { error: 'No JSON to validate' }, true);
        return;
    }
    
    try {
        const parsed = JSON.parse(bulkBooksText);
        displayResponse('bulkResponse', { message: 'Valid JSON format!', data: parsed });
        showToast('JSON is valid!');
    } catch (error) {
        displayResponse('bulkResponse', { error: 'Invalid JSON: ' + error.message }, true);
        showToast('Invalid JSON format', true);
    }
}

// Handle file import
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            document.getElementById('bulkBooks').value = JSON.stringify(jsonData, null, 2);
            displayResponse('fileImportResponse', { message: 'File imported successfully!' });
            showToast('File imported successfully!');
        } catch (error) {
            displayResponse('fileImportResponse', { error: 'Invalid JSON file: ' + error.message }, true);
            showToast('Invalid JSON file', true);
        }
    };
    reader.readAsText(file);
}

// Get single book
async function getSingleBook() {
    const bookId = document.getElementById('bookId').value.trim();
    
    if (!bookId) {
        displayResponse('singleBookResponse', { error: 'Book ID is required' }, true);
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        const data = await response.json();
        
        if (response.ok) {
            displayResponse('singleBookResponse', data);
            const authorInfo = data.author ? ` by ${data.author}` : '';
            const yearInfo = data.publishedYear ? ` (${data.publishedYear})` : '';
            showToast(`Book "${data.title}"${authorInfo}${yearInfo} retrieved successfully`);
        } else {
            displayResponse('singleBookResponse', data, true);
            showToast('Book not found', true);
        }
    } catch (error) {
        displayResponse('singleBookResponse', { error: error.message }, true);
        showToast('Error retrieving book', true);
    }
}

// Update book
async function updateBook() {
    const updateId = document.getElementById('updateId').value.trim();
    const updateTitle = document.getElementById('updateTitle').value.trim();
    const updateAuthor = document.getElementById('updateAuthor').value.trim();
    const updateYear = document.getElementById('updateYear').value;
    
    if (!updateId) {
        displayResponse('updateResponse', { error: 'Book ID is required' }, true);
        return;
    }
    
    const updateData = {};
    if (updateTitle) updateData.title = updateTitle;
    if (updateAuthor) updateData.author = updateAuthor;
    if (updateYear) updateData.publishedYear = parseInt(updateYear);
    
    if (Object.keys(updateData).length === 0) {
        displayResponse('updateResponse', { error: 'At least one field must be provided for update' }, true);
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/${updateId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayResponse('updateResponse', data);
            const authorInfo = data.author ? ` by ${data.author}` : '';
            const yearInfo = data.publishedYear ? ` (${data.publishedYear})` : '';
            const updatedFields = Object.keys(updateData).join(', ');
            showToast(`Book "${data.title}"${authorInfo}${yearInfo} updated (${updatedFields})`);
            // Clear form
            document.getElementById('updateId').value = '';
            document.getElementById('updateTitle').value = '';
            document.getElementById('updateAuthor').value = '';
            document.getElementById('updateYear').value = '';
            // Refresh books list
            getAllBooks();
        } else {
            displayResponse('updateResponse', data, true);
            showToast('Failed to update book', true);
        }
    } catch (error) {
        displayResponse('updateResponse', { error: error.message }, true);
        showToast('Error updating book', true);
    }
}

// Delete single book
async function deleteSingleBook() {
    const deleteId = document.getElementById('deleteId').value.trim();
    
    if (!deleteId) {
        displayResponse('deleteResponse', { error: 'Book ID is required' }, true);
        return;
    }
    
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/${deleteId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayResponse('deleteResponse', data);
            showToast(`Book with ID "${deleteId}" deleted successfully`);
            document.getElementById('deleteId').value = '';
            getAllBooks();
        } else {
            displayResponse('deleteResponse', data, true);
            showToast('Failed to delete book', true);
        }
    } catch (error) {
        displayResponse('deleteResponse', { error: error.message }, true);
        showToast('Error deleting book', true);
    }
}

// Delete all books
async function deleteAllBooks() {
    if (!confirm('Are you sure you want to delete ALL books? This action cannot be undone!')) {
        return;
    }
    
    const currentCount = allBooks.length;
    
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayResponse('deleteAllResponse', data);
            showToast(`All ${currentCount} books deleted successfully`);
            getAllBooks();
        } else {
            displayResponse('deleteAllResponse', data, true);
            showToast('Failed to delete all books', true);
        }
    } catch (error) {
        displayResponse('deleteAllResponse', { error: error.message }, true);
        showToast('Error deleting all books', true);
    }
}

// Helper function to fill update form from book card
function fillUpdateForm(id, title, author, year) {
    document.getElementById('updateId').value = id;
    document.getElementById('updateTitle').value = title;
    document.getElementById('updateAuthor').value = author;
    document.getElementById('updateYear').value = year;
    
    // Switch to manage tab
    switchTab('manage');
    
    // Scroll to update section
    setTimeout(() => {
        document.querySelector('#manage .section:nth-of-type(2)').scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    showToast('Book details loaded for editing');
}

// Helper function to delete book from card
async function deleteBookFromCard(bookId) {
    // Find the book details for the toast message
    const book = allBooks.find(b => b._id === bookId);
    const bookTitle = book ? book.title : 'Unknown';
    const bookYear = book && book.publishedYear ? ` (${book.publishedYear})` : '';
    
    if (!confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const authorInfo = book && book.author ? ` by ${book.author}` : '';
            showToast(`Book "${bookTitle}"${authorInfo}${bookYear} deleted successfully`);
            getAllBooks();
        } else {
            showToast('Failed to delete book', true);
        }
    } catch (error) {
        showToast('Error deleting book', true);
    }
}