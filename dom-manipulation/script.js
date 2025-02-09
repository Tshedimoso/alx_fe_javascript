const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Success" },
];

// Simulating fetching from a server
function fetchFromServer() {
    // Simulate server response with a slight delay
    setTimeout(() => {
        const simulatedServerData = [
            { text: "The best way to predict the future is to create it.", category: "Motivation" },
            { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
        ];

        handleDataSync(simulatedServerData);
    }, 2000); // Simulate server delay of 2 seconds
}

// Handle syncing with the server and conflict resolution
function handleDataSync(serverData) {
    // Check for conflicts (e.g., same quote with different text or category)
    const mergedQuotes = mergeQuotes(serverData);

    // If any conflicts were resolved, notify the user
    if (mergedQuotes.conflicts.length > 0) {
        alert(`Data sync complete! ${mergedQuotes.conflicts.length} conflict(s) resolved.`);
    } else {
        alert("Data sync complete! No conflicts.");
    }

    // Update local storage and the quotes array
    quotes.length = 0; // Clear the local array
    quotes.push(...mergedQuotes.updatedQuotes); // Push the merged quotes

    saveQuotes(); // Save to localStorage
    populateCategories(localStorage.getItem("lastCategory") || "all"); // Re-populate the categories dropdown
}

// Merge the server data with local data, resolving conflicts by giving server data precedence
function mergeQuotes(serverData) {
    const conflicts = [];
    const updatedQuotes = [];

    serverData.forEach(serverQuote => {
        const existingQuoteIndex = quotes.findIndex(localQuote => localQuote.text === serverQuote.text);
        
        if (existingQuoteIndex !== -1) {
            // Conflict: same text but different category
            if (quotes[existingQuoteIndex].category !== serverQuote.category) {
                conflicts.push({ local: quotes[existingQuoteIndex], server: serverQuote });
                // Resolve conflict: prioritize server data
                quotes[existingQuoteIndex] = serverQuote;
            }
        } else {
            // No conflict: add server quote to the local list
            updatedQuotes.push(serverQuote);
        }
    });

    // Add all non-conflicting quotes
    updatedQuotes.push(...quotes.filter(quote => !serverData.some(serverQuote => serverQuote.text === quote.text)));

    return { conflicts, updatedQuotes };
}

// Set up periodic sync with server (every 5 seconds)
setInterval(() => {
    fetchFromServer();
}, 5000); // Periodic sync every 5 seconds

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes and server data initially
document.addEventListener("DOMContentLoaded", () => {
    fetchFromServer(); // Simulate initial data fetch from the server
});

// Your existing functions will remain unchanged (e.g., showRandomQuote, addQuote, etc.)

