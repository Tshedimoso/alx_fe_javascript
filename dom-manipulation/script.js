const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Success" },
];

// Load last viewed quote from session storage
document.addEventListener("DOMContentLoaded", () => {
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
        document.getElementById("quoteDisplay").innerHTML = `<strong>${lastQuote}</strong>`;
    }
    populateCategories(); // Populate categories when the page loads
    restoreLastFilter(); // Restore the last selected filter
});

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
    const category = document.getElementById("categorySelect").value;
    let filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);
    
    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "<em>No quotes available in this category.</em>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote = filteredQuotes[randomIndex].text;
    
    document.getElementById("quoteDisplay").innerHTML = `<strong>${selectedQuote}</strong>`;

    // Save last viewed quote to session storage
    sessionStorage.setItem("lastQuote", selectedQuote);
}

function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({ text: quoteText, category: quoteCategory });

    updateCategoryDropdown(quoteCategory);
    saveQuotes(); // Save to local storage

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
    populateCategories(); // Ensure the categories dropdown is updated
}

function updateCategoryDropdown(newCategory) {
    const categorySelect = document.getElementById("categorySelect");
    let exists = Array.from(categorySelect.options).some(option => option.value === newCategory);

    if (!exists) {
        let newOption = document.createElement("option");
        newOption.value = newCategory;
        newOption.textContent = newCategory;
        categorySelect.appendChild(newOption);
    }
}

function populateCategories() {
    const categorySelect = document.getElementById("categoryFilter");
    const uniqueCategories = [...new Set(quotes.map(q => q.category))];

    // Clear existing options
    categorySelect.innerHTML = "<option value='all'>All Categories</option>";

    // Add unique categories
    uniqueCategories.forEach(category => {
        let option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote = filteredQuotes[randomIndex]?.text || "No quotes available in this category.";

    document.getElementById("quoteDisplay").innerHTML = `<strong>${selectedQuote}</strong>`;

    // Save last selected filter in local storage
    localStorage.setItem("lastFilter", selectedCategory);
}

function restoreLastFilter() {
    const lastFilter = localStorage.getItem("lastFilter");
    if (lastFilter) {
        document.getElementById("categoryFilter").value = lastFilter;
        filterQuotes(); // Apply the last filter to the quotes
    }
}

function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.id = "quoteForm";

    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.onclick = addQuote;

    const exportButton = document.createElement("button");
    exportButton.textContent = "Export Quotes";
    exportButton.onclick = exportQuotes;

    const importInput = document.createElement("input");
    importInput.type = "file";
    importInput.id = "importFile";
    importInput.accept = ".json";
    importInput.onchange = importFromJsonFile;

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
    formContainer.appendChild(exportButton);
    formContainer.appendChild(importInput);

    document.body.appendChild(formContainer);
}

// Export quotes as a JSON file
function exportQuotes() {
    const jsonBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(jsonBlob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert("Quotes imported successfully!");
                populateCategories(); // Ensure categories are updated
            } else {
                alert("Invalid JSON format.");
            }
        } catch (error) {
            alert("Error reading JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Ensure the form is created when the page loads
document.addEventListener("DOMContentLoaded", createAddQuoteForm);
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Simulating periodic server interaction (every 5 seconds)
setInterval(() => {
    fetchQuotesFromServer(); // Simulate fetching data from server every 5 seconds
}, 5000);

// Simulate fetching data from a server (using JSONPlaceholder API)
async function fetchQuotesFromServer() {
    try {
        // Fetch data from mock API
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        
        if (!response.ok) {
            throw new Error('Failed to fetch data from server');
        }
        
        const serverData = await response.json();
        
        // Extract just the quote-like data from the API response for this demo
        const formattedData = serverData.slice(0, 5).map(post => ({
            text: post.title, // Using the title as the quote text
            category: post.userId % 2 === 0 ? 'Motivation' : 'Life' // Randomly assigning categories
        }));
        
        handleDataSync(formattedData); // Handle the syncing and conflict resolution
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data from the server.');
    }
}

// Post new quote to the server (using POST method)
async function postToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Specify the content type as JSON
            },
            body: JSON.stringify({
                title: quote.text, // Using title as quote text
                userId: Math.floor(Math.random() * 10) + 1, // Random userId (mock)
                body: quote.category, // Use category as the body (mock API structure)
            })
        });

        if (!response.ok) {
            throw new Error('Failed to post quote to server');
        }

        const result = await response.json();
        console.log('Post successful:', result);
        alert('Quote posted to server successfully!');
    } catch (error) {
        console.error('Error posting data:', error);
        alert('Error posting data to the server.');
    }
}

// Handle syncing with server and resolving conflicts (server data takes precedence)
function syncQuotes(serverData) {
    const conflicts = [];
    const updatedQuotes = [];

    // Merge local and server data, resolving conflicts by giving server data precedence
    serverData.forEach(serverQuote => {
        const existingQuoteIndex = quotes.findIndex(localQuote => localQuote.text === serverQuote.text);

        if (existingQuoteIndex !== -1) {
            // Conflict found: Same text but different category
            if (quotes[existingQuoteIndex].category !== serverQuote.category) {
                conflicts.push({ local: quotes[existingQuoteIndex], server: serverQuote });
                // Resolve conflict by prioritizing server data
                quotes[existingQuoteIndex] = serverQuote;
            }
        } else {
            // No conflict: Add server quote to local storage
            updatedQuotes.push(serverQuote);
        }
    });

    // Add new quotes to local storage
    updatedQuotes.push(...quotes.filter(quote => !serverData.some(serverQuote => serverQuote.text === quote.text)));

    // Show conflict resolution notification (if any)
    if (conflicts.length > 0) {
        showConflictNotification(conflicts);
    } else {
        alert("Data synced successfully. No conflicts detected.");
    }

    // Save the merged quotes to local storage
    saveQuotes();
    populateCategories(); // Re-populate the categories dropdown based on the new data
}

// Show notification for resolved conflicts
function showConflictNotification(conflicts) {
    const notificationContainer = document.getElementById("notificationContainer");

    conflicts.forEach(conflict => {
        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.innerHTML = `Conflict resolved: <strong>${conflict.local.text}</strong> was updated.`;

        notificationContainer.appendChild(notification);
        setTimeout(() => notification.remove(), 5000); // Remove notification after 5 seconds
    });
}

// Add a container for notifications (optional, you can style it as needed)
document.body.insertAdjacentHTML('beforeend', '<div id="notificationContainer" style="position: fixed; bottom: 10px; right: 10px;"></div>');

// Function to add new quote and post to the server
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    // Create quote object
    const newQuote = { text: quoteText, category: quoteCategory };

    // Post new quote to the mock server
    postToServer(newQuote);

    // Add quote to local storage and update UI
    quotes.push(newQuote);
    updateCategoryDropdown(quoteCategory);
    saveQuotes(); // Save to local storage

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quotes synced with server!");
    populateCategories(); // Ensure the categories dropdown is updated
}
