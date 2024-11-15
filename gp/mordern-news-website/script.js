const API_KEY = "e702f0a2540d0bd11d389b60542e1852";  // Mediastack API Key
const url = "https://api.mediastack.com/v1/news";  // Mediastack News API URL
  // Mediastack News API URL

window.addEventListener("load", () => {
    // Default to "General" category when the page loads
    fetchNews("general");
});

async function fetchNews(categoryOrQuery) {
    try {
        let apiUrl = `${url}?access_key=${API_KEY}&languages=en`;
        
        // Check if we're dealing with a category or a search query
        if (categoryOrQuery && categoryOrQuery !== "general") {
            if (categoryOrQuery === "search") {
                const query = searchText.value.trim();
                if (query) {
                    apiUrl += `&keywords=${query}`;  // Use the `keywords` parameter for searching
                }
            } else {
                apiUrl += `&categories=${categoryOrQuery}`;  // Use the `categories` parameter for category-based queries
            }
        }

        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error(`Failed to fetch data. Status: ${res.status}`);
        }

        const data = await res.json();
        if (data.data && data.data.length > 0) {
            bindData(data.data);
        } else {
            throw new Error("No data returned from API.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        displayError(`Something went wrong while fetching news: ${error.message}`);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const newsCardTemplate = document.getElementById("template-news-card");
    cardsContainer.innerHTML = "";  // Clear any previous data

    if (!articles || articles.length === 0) {
        displayError("No articles found.");
        return;
    }

    articles.forEach((article) => {
        if (!article.image) return;  // Skip if there's no image

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    // Fallback image if no image is available
    newsImg.src = article.image || 'https://via.placeholder.com/400x200';

    newsTitle.innerHTML = `${article.title.slice(0, 60)}...`;  // Shorten title if too long
    newsDesc.innerHTML = `${article.description.slice(0, 150)}...`;  // Shorten description

    const date = new Date(article.published_at).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    newsSource.innerHTML = `${article.source} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);

    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;

    fetchNews("search");  // Trigger search with the entered query
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

function displayError(message) {
    const cardsContainer = document.getElementById("cardscontainer");
    cardsContainer.innerHTML = `<p class="error-message">${message}</p>`;
}
document.getElementById('hamburger-icon').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
  });
  