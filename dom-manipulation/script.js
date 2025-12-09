
// Quote Data (Array of Objects)


const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

// DOM Elements


const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");


// Show Random Quote ✅


function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

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


// Add New Quote 


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

  //  Update ARRAY dynamically
  quotes.push(newQuote);

  //  Update DOM using createElement + appendChild
  quoteDisplay.innerHTML = "";

  const p = document.createElement("p");
  p.textContent = `"${newQuote.text}"`;

  const small = document.createElement("small");
  small.textContent = `— ${newQuote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);

  //  Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Event Listener


newQuoteBtn.addEventListener("click", showRandomQuote);


// Initialize App 

createAddQuoteForm();
showRandomQuote();