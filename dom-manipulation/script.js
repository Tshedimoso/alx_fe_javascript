const quotes = [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Success" },
];

function displayRandomQuote() {
    const category = document.getElementById("categorySelect").value;
    let filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);
    
    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerText = "No quotes available in this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById("quoteDisplay").innerText = filteredQuotes[randomIndex].text;
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

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
