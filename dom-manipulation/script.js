
// Load Quotes from Local Storage 


let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];


// DOM Elements


const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");


// Save Quotes to Local Storage 


function saveQuotesToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show Random Quote  + Session Storage 


function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Save last viewed quote in SESSION storage 
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

  //  Update array
  quotes.push(newQuote);

  // Save to Local Storage
  saveQuotesToLocalStorage();

  // Update DOM using createElement + appendChild
  quoteDisplay.innerHTML = "";

  const p = document.createElement("p");
  p.textContent = `"${newQuote.text}"`;

  const small = document.createElement("small");
  small.textContent = `— ${newQuote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);

  //  Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
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


// Event Listener


newQuoteBtn.addEventListener("click", showRandomQuote);


// Initialize App 


createAddQuoteForm();

// Load last quote from session OR show random
if (sessionStorage.getItem("lastQuote")) {
  loadLastSessionQuote();
} else {
  showRandomQuote();
}