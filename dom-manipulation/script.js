// Task 0: Building a Dynamic Content Generator with Advanced DOM Manipulation

// Quotes array to store quotes and categories
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" }
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.innerText = quotes[randomIndex].text;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        alert("Quote added successfully!");
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    }
}

// Task 1: Implementing Web Storage and JSON Handling

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Call loadQuotes on page load
window.onload = loadQuotes;

// Function to export quotes as JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
}

// Task 2: Creating a Dynamic Content Filtering System Using Web Storage and JSON

// Function to populate category dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    const uniqueCategories = [...new Set(quotes.map(q => q.category))];
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.innerText = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const quoteDisplay = document.getElementById("quoteDisplay");
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    quoteDisplay.innerHTML = filteredQuotes.map(q => `<p>${q.text}</p>`).join("");
    localStorage.setItem("lastSelectedCategory", selectedCategory);
}

// Load last selected category on page load
window.onload = function () {
    loadQuotes();
    populateCategories();
    const lastCategory = localStorage.getItem("lastSelectedCategory");
    if (lastCategory) {
        document.getElementById("categoryFilter").value = lastCategory;
        filterQuotes();
    }
};

// Task 3: Syncing Data with Server and Implementing Conflict Resolution

// Function to fetch quotes from server (mock API)
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const data = await response.json();
        const serverQuotes = data.map(post => ({ text: post.title, category: "Server" }));
        quotes = [...quotes, ...serverQuotes];
        saveQuotes();
        alert("Quotes synced with server!");
    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
}

// Function to sync data with server periodically
setInterval(fetchQuotesFromServer, 30000); // Sync every 30 seconds
