function handleSubmitForContactForm(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = '';

    if (!name) {
        alert('Please enter your name.');
        return;
    }

    if (!email) {
        alert('Please enter your email.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!message) {
        alert('Please enter your message.');
        return;
    }

    successMessage.textContent = 'Form submitted successfully!';
    successMessage.style.display = 'block';

    document.getElementById("contactForm").reset();
    setTimeout(function() {
        successMessage.style.display = "none";
    }, 2000);
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


// RAPID API INTEGRATION
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '11259bfaacmshf9e66522606f145p1cedd6jsnaf0c872d212b',
        'x-rapidapi-host': 'google-search72.p.rapidapi.com'
    }
};

class Data {
    constructor(title, snippet) {
        this.title = title;
        this.snippet = snippet;
    }
}

async function fetchSearchResults(searchTerm) {
    const url = `https://google-search72.p.rapidapi.com/search?q=${encodeURIComponent(searchTerm)}&lr=en-US&num=10`;
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.items.map(item => new Data(item.title, item.snippet));
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    searchResultsContainer.innerHTML = '';

    results.forEach(data => {
        const resultElement = document.createElement('div');
        resultElement.classList.add('result');

        const title = document.createElement('h3');
        title.textContent = data.title;
        resultElement.appendChild(title);

        const snippet = document.createElement('p');
        snippet.textContent = data.snippet;
        resultElement.appendChild(snippet);

        searchResultsContainer.appendChild(resultElement);
    });
}

function search(data, query) {
    return data.some(d => d.title.toLowerCase().includes(query.toLowerCase()));
}

async function handleSubmitForSearch(event) {
    event.preventDefault();
    const query = document.getElementById('searchQuery').value.trim();
    const data = await fetchSearchResults(query);
    
    if (data && data.length > 0) {
        displaySearchResults(data);
        const found = search(data, query);
        if (found) {
            console.log('data found in the results!');
        } else {
            console.log('data not found in the results.');
        }
    } else {
        console.log('No results found.');
    }
}
