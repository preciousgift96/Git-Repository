// ============================================
// GET HTML ELEMENTS
// ============================================
const languageSelect = document.getElementById("language");
const searchButton = document.getElementById("search-btn");
const status = document.getElementById("status");
const repositoryCard = document.getElementById("repository-card");
const repositoryName = document.getElementById("repository-name");
const repositoryDescription =
  document.getElementById("repository-description");
const repositoryLanguage =
  document.getElementById("repository-language");
const repositoryLink =
  document.getElementById("repository-link");
const stars = document.getElementById("stars");
const forks = document.getElementById("forks");
const issues = document.getElementById("issues");
const ownerAvatar =
  document.getElementById("owner-avatar");
const ownerName =
  document.getElementById("owner-name");
const refreshButton =
  document.getElementById("refresh-btn");
// ============================================
// GITHUB API
// ============================================
const GITHUB_API =
  "https://api.github.com/search/repositories";
// ============================================
// SEARCH FOR A RANDOM REPOSITORY
// ============================================
async function findRandomRepository() {
  // Get selected language
  const language = languageSelect.value;
  // Make sure a language was selected
  if (!language) {
    showStatus(
      "Please select a programming language first.",
      "error"
    );
    repositoryCard.classList.add("hidden");
    return;
  }
  // Show loading state
  showStatus(
    "Searching GitHub for a repository...",
    "loading"
  );
  repositoryCard.classList.add("hidden");
  searchButton.disabled = true;
  try {
    // ========================================
    // CREATE SEARCH URL
    // ========================================
    const query =
      `language:${language}`;
    const url =
      `${GITHUB_API}?q=${encodeURIComponent(query)}&per_page=100`;
    // ========================================
    // SEND REQUEST TO GITHUB
    // ========================================
    const response = await fetch(url);
    // Check if GitHub returned an error
    if (!response.ok) {
      throw new Error(
        "Unable to fetch repositories from GitHub."
      );
    }
    // ========================================
    // CONVERT RESPONSE TO JSON
    // ========================================
    const data = await response.json();
    // ========================================
    // CHECK IF RESULTS EXIST
    // ========================================
    if (
      !data.items ||
      data.items.length === 0
    ) {
      showStatus(
        `No repositories were found for ${language}.`,
        "empty"
      );
      return;
    }
    // ========================================
    // PICK RANDOM REPOSITORY
    // ========================================
    const randomIndex =
      Math.floor(
        Math.random() * data.items.length
      );
    const repository =
      data.items[randomIndex];
    // ========================================
    // DISPLAY REPOSITORY
    // ========================================
    displayRepository(repository);
  } catch (error) {
    console.error(error);
    showStatus(
      "Something went wrong while contacting GitHub. Please try again.",
      "error"
    );
  } finally {
    searchButton.disabled = false;
  }
}
// ============================================
// DISPLAY REPOSITORY
// ============================================
function displayRepository(repository) {
  // Repository name
  repositoryName.textContent =
    repository.full_name;
  // Repository description
  repositoryDescription.textContent =
    repository.description ||
    "No description available.";
  // Programming language
  repositoryLanguage.textContent =
    repository.language ||
    "Unknown";
  // GitHub URL
  repositoryLink.href =
    repository.html_url;
  // Stars
  stars.textContent =
    formatNumber(repository.stargazers_count);
  // Forks
  forks.textContent =
    formatNumber(repository.forks_count);
  // Open issues
  issues.textContent =
    formatNumber(repository.open_issues_count);
  // Owner information
  ownerName.textContent =
    repository.owner.login;
  ownerAvatar.src =
    repository.owner.avatar_url;
  // Show repository card
  repositoryCard.classList.remove("hidden");
  // Clear status message
  status.innerHTML = "";
  // Scroll to repository
  repositoryCard.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}
// ============================================
// FORMAT LARGE NUMBERS
// ============================================
function formatNumber(number) {
  return new Intl.NumberFormat(
    "en-US",
    {
      notation: "compact",
      maximumFractionDigits: 1
    }
  ).format(number);
}
// ============================================
// SHOW STATUS MESSAGE
// ============================================
function showStatus(message, type = "") {
  status.className = "status";
  if (type) {
    status.classList.add(type);
  }
  status.innerHTML = `
    <p>${message}</p>
  `;
}
// ============================================
// SEARCH BUTTON
// ============================================
searchButton.addEventListener(
  "click",
  findRandomRepository
);
// ============================================
// REFRESH BUTTON
// ============================================
refreshButton.addEventListener(
  "click",
  findRandomRepository
);
// ============================================
// SEARCH WHEN ENTER IS PRESSED
// ============================================
languageSelect.addEventListener(
  "change",
  () => {
    if (languageSelect.value) {
      findRandomRepository();
    }
  }
);