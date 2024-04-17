document.addEventListener('DOMContentLoaded', () => {
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    let searchType = 'users';

    githubForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value;

        if (searchType === 'users') {
            searchUsers(searchTerm)
                .then(users => {
                    displayUsers(users);
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        } else {
            searchRepos(searchTerm)
                .then(repos => {
                    displayRepos(repos);
                })
                .catch(error => {
                    console.error('Error fetching repositories:', error);
                });
        }
    });

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (value.startsWith('user:')) {
            searchType = 'users';
        } else if (value.startsWith('repo:')) {
            searchType = 'repos';
        }
    });


    function displayUsers(users) {
        userList.innerHTML = '';
        reposList.innerHTML = '';
    
        users.forEach(user => {
            const userElement = `
                <li class="user" data-username="${user.login}">
                    <img src="${user.avatar_url}" alt="${user.login}'s image">
                    <a href="${user.html_url}" target="_blank">${user.login}</a>
                </li>
            `;
            userList.insertAdjacentHTML('beforeend', userElement);
        });
    }
    

    function displayRepos(repos) {
        reposList.innerHTML = '';

        repos.forEach(repo => {
            const repoElement = `
                <li class="repo">
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${repo.description || 'No description'}</p>
                </li>
            `;
            reposList.insertAdjacentHTML('beforeend', repoElement);
        });
    }

    async function searchUsers(searchTerm) {
        const response = await fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        return data.items;
    }

    async function searchRepos(searchTerm) {
        const response = await fetch(`https://api.github.com/search/repositories?q=${searchTerm}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        return data.items;
    }

    userList.addEventListener('click', async (e) => {
        if (e.target.closest('.user')) {
            const username = e.target.closest('.user').getAttribute('data-username');
            const repos = await getUserRepos(username);
            displayRepos(repos);
        }
    });

    async function getUserRepos(username) {
        const response = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        return data;
    }
});
