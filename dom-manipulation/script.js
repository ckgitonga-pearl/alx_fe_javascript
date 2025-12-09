
// Load Quotes from Local Storage 


let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

// DOM Elements


const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");


// Save Quotes to Local Storage 


function saveQuotesToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}


// Populate Category Dropdown 


function populateCategories() {
  // Clear old options except "All"
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter 
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}


// Show Random Quote (Filtered) 


function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  const selectedCategory = categoryFilter.value;

  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  // Save last viewed quote in session storage 
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));

  const p = document.createElement("p");
  p.textContent = `"${randomQuote.text}"`;

  const small = document.createElement("small");
  small.textContent = `— ${randomQuote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);
}


// REQUIRED FUNCTION 


function createAddQuoteForm() {
  console.log("Add Quote Form Loaded");
}


// Add New Quote  + Save to Local Storage 


function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };

  quotes.push(newQuote);
  saveQuotesToLocalStorage();
  populateCategories(); // Update filter options dynamically

  quoteDisplay.innerHTML = "";

  const p = document.createElement("p");
  p.textContent = `"${newQuote.text}"`;

  const small = document.createElement("small");
  small.textContent = `— ${newQuote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}


// Filter Quotes by Category 


function filterQuotes() {
  const selectedCategory = categoryFilter.value;

  //  Save selected filter to localStorage
  localStorage.setItem("selectedCategory", selectedCategory);

  showRandomQuote(); //  Show a random quote from the filtered list
}


// Restore Last Session Quote 


function loadLastSessionQuote() {
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (!lastQuote) return;

  quoteDisplay.innerHTML = "";

  const p = document.createElement("p");
  p.textContent = `"${lastQuote.text}"`;

  const small = document.createElement("small");
  small.textContent = `— ${lastQuote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);
}

// ✅ JSON EXPORT FUNCTION


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

  URL.revokeObjectURL(url);
}


// JSON IMPORT FUNCTION


function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);

    quotes.push(...importedQuotes);
    saveQuotesToLocalStorage();
    populateCategories(); //  Refresh dropdown after import

    alert("Quotes imported successfully!");
  };

  fileReader.readAsText(event.target.files[0]);
}


// Event Listener


newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize App 


createAddQuoteForm();
populateCategories();

const savedFilter = localStorage.getItem("selectedCategory");
if (savedFilter) {
  categoryFilter.value = savedFilter;
}

if (sessionStorage.getItem("lastQuote")) {
  loadLastSessionQuote();
} else {
  showRandomQuote();
}