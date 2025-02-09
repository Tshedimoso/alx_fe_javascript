const quotes = [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Success" },
];

function showRandomQuote() {
    const category = document.getElementById("categorySelect").value;
    let filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);
    
    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "<em>No quotes available in this category.</em>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById("quoteDisplay").innerHTML = `<strong>${filteredQuotes[randomIndex].text}</strong>`;
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

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);

    document.body.appendChild(formContainer);
}

// Ensure the form is created when the page loads
document.addEventListener("DOMContentLoaded", createAddQuoteForm);
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
