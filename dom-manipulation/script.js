// MOCK SERVER CONFIG (JSONPlaceholder)


const MOCK_API_URL = "https://jsonplaceholder.typicode.com/posts";
const SERVER_SYNC_INTERVAL = 15000; // 15 seconds

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(MOCK_API_URL);
    const serverData = await response.json();

    // Convert mock posts into timestamped quote format
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server",
      updatedAt: Date.now() //Simulate server timestamp
    }));

    syncServerData(serverQuotes);

    console.log("Periodic server sync complete");

  } catch (error) {
    console.error("Server sync failed:", error);
  }
}
async function postQuoteToServer(quote) {
  try {
    await fetch(MOCK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    console.log(" Quote sent to server");

  } catch (error) {
    console.error(" Failed to send quote to server:", error);
  }
}

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
populateCategories();

const savedFilter = localStorage.getItem("selectedCategory");
if (savedFilter) {
  categoryFilter.value = savedFilter;
}

function populateCategories() {
  // Clear old options except "All"
  const categoryFilter = document.getElementById("categoryFilter");
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
  // Periodic server sync (simulate live updates)
setInterval(fetchQuotesFromServer, SERVER_SYNC_INTERVAL);
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

  //  Update quotes array
  quotes.push(newQuote);

  // Persist quotes in localStorage
  saveQuotesToLocalStorage();

  // Update categories immediately in dropdown
  populateCategories();

  //  Automatically select the new category if it's new
  document.getElementById("categoryFilter").value = quoteCategory;

  //  Persist selected category
  localStorage.setItem("selectedCategory", quoteCategory);

  //  Update DOM in real time
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
  postQuoteToServer(newQuote);
  const newQuote = {
  text: quoteText,
  category: quoteCategory,
  updatedAt: Date.now() // Local timestamp
};
}


// Filter Quotes by Category 


function filterQuotes() {
    const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;

  //  Save selected filter to localStorage
  localStorage.setItem("selectedCategory", selectedCategory);
  
  quoteDisplay.innerHTML = "";
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(
      quote => quote.category === selectedCategory
    );
  }
if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  const p = document.createElement("p");
  p.textContent = `"${randomQuote.text}"`;

  const small = document.createElement("small");
  small.textContent = `— ${randomQuote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);
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
let pendingConflict = null;

function syncServerData(serverQuotes) {
  let wasUpdated = false;

  serverQuotes.forEach(serverQuote => {
    const localIndex = quotes.findIndex(
      local =>
        local.text === serverQuote.text &&
        local.category === serverQuote.category
    );

    if (localIndex === -1) {
      //  New server quote
      quotes.push(serverQuote);
      wasUpdated = true;

    } else {
      const localQuote = quotes[localIndex];

      //  CONFLICT DETECTED
      if (
        localQuote.updatedAt &&
        serverQuote.updatedAt &&
        localQuote.updatedAt !== serverQuote.updatedAt
      ) {
        pendingConflict = {
          local: localQuote,
          server: serverQuote,
          index: localIndex
        };

        showConflictUI(localQuote, serverQuote);
        return;
      }

      // Default: Server wins automatically
      if (serverQuote.updatedAt > localQuote.updatedAt) {
        quotes[localIndex] = serverQuote;
        wasUpdated = true;
      }
    }
  });

  if (wasUpdated) {
    saveQuotesToLocalStorage();
    populateCategories();
    showRandomQuote();
    showNotification("Quotes updated from server.");
  }
}

function showNotification(message) {
  const box = document.getElementById("syncNotification");
  box.textContent = message;
  box.style.display = "block";

  setTimeout(() => {
    box.style.display = "none";
  }, 4000);
}
function showConflictUI(localQuote, serverQuote) {
  const box = document.getElementById("conflictBox");
  const text = document.getElementById("conflictText");

  text.innerHTML = `
    <p><strong>Your Version:</strong> "${localQuote.text}"</p>
    <p><strong>Server Version:</strong> "${serverQuote.text}"</p>
  `;
  box.style.display = "block";
}
function resolveConflict(choice) {
  if (!pendingConflict) return;

  if (choice === "server") {
    quotes[pendingConflict.index] = pendingConflict.server;
    showNotification("✅ Server version kept.");
  } else {
    showNotification("✅ Local version kept.");
  }

  pendingConflict = null;

  document.getElementById("conflictBox").style.display = "none";

  saveQuotesToLocalStorage();
  populateCategories();
  showRandomQuote();
}

