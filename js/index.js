document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
  
    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (searchTerm === "") return;
  
      try {
        const users = await searchUsers(searchTerm);
        displayUsers(users);
      } catch (error) {
        console.error("Error searching for users:", error);
      }
    });
  
    async function searchUsers(query) {
      const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      return data.items; // Extract the array of user items from the response
    }
  
    function displayUsers(users) {
      searchResults.innerHTML = ""; // Clear previous search results
      users.forEach(user => {
        const userElement = document.createElement("div");
        userElement.innerHTML = `
          <h2>${user.login}</h2>
          <img src="${user.avatar_url}" alt="${user.login}" style="width: 100px; height: 100px;">
          <a href="${user.html_url}" target="_blank">View Profile</a>
        `;
        searchResults.appendChild(userElement);
        userElement.addEventListener("click", async () => {
          try {
            const repos = await getUserRepos(user.login);
            displayRepos(userElement, repos);
          } catch (error) {
            console.error("Error fetching user repositories:", error);
          }
        });
      });
    }
  
    async function getUserRepos(username) {
      const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user repositories");
      }
      return response.json();
    }
  
    function displayRepos(userElement, repos) {
      const repoList = document.createElement("ul");
      repos.forEach(repo => {
        const repoItem = document.createElement("li");
        repoItem.textContent = repo.full_name;
        repoList.appendChild(repoItem);
      });
      userElement.appendChild(repoList);
    }
  });
  