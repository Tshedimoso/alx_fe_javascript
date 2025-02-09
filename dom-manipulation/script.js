const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Success" },
];

// Load last viewed quote from session storage
document.addEventListener("DOMContentLoaded", () => {
    const lastQuote = sessionStorage.getItem("lastQuote");
    const lastCategory = localStorage.getItem("lastCategory") || "all"; // Retrieve last selected category from localStorage

    if (lastQuote) {
        document.getElementById("quoteDisplay").innerHTML = `<strong>${lastQuote}</strong>`;
    }

    // Set the last selected category filter in the dropdown
    document.getElementById("categorySelect").value = lastCategory;

    // Populate categories in the dropdown
    populateCategories(lastCategory);
});

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate categories in the category dropdown
function populateCategories(lastCategory) {
    const categories = Array.from(new Set(quotes.map(q => q.category)));
    const categorySelect = document.getElementById("categorySelect");

    // Clear current options and add default option
    categorySelect.innerHTML = `<option value="all">All Categories</option>`;

    categories.forEach(category => {
        let option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Restore the last selected category from localStorage
    categorySelect.value = lastCategory;
}

// Filter quotes based on the selected category
function filterQuotes() {
    const category = document.getElementById("categorySelect").value;
    const filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);

    // Display the filtered quotes
    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "<em>No quotes available in this category.</em>";
    } else {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        document.getElementById("quoteDisplay").innerHTML = `<strong>${filteredQuotes[randomIndex].text}</strong>`;
    }

    // Save the selected category filter in localStorage
    localStorage.setItem("lastCategory", category);
    // Save the last viewed quote to sessionStorage
    sessionStorage.setItem("lastQuote", filteredQuotes[randomIndex].text);
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
    populateCategories(localStorage.getItem("lastCategory") || "all"); // Re-populate the categories dropdown with the new category

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
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
                populateCategories(localStorage.getItem("lastCategory") || "all"); // Re-populate the categories dropdown
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
