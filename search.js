document.addEventListener('DOMContentLoaded', () => {
    // Fetch categories and populate the select element
    fetch('http://localhost:3000/api/categories')
        .then(response => response.json())
        .then(categories => {
            const categorySelect = document.getElementById("category");
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.NAME;
                option.textContent = category.NAME;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));

    // Search form submission
    const searchForm = document.getElementById("fundraisers-search-form");
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const organizer = document.getElementById("organizer").value;
        const city = document.getElementById("city").value;
        const category = document.getElementById("category").value;

        // Create search parameters
        const searchParams = new URLSearchParams({
            organizer,
            city,
            category
        }).toString();

        fetch(`http://localhost:3000/api/fundraisers/search?${searchParams}`)
            .then(response => response.json())
            .then((results) => {
                const resultsContainer = document.getElementById("search-results");
                resultsContainer.innerHTML = ''; // Clear previous results

                if (results.length === 0) {
                    // Display fa message if no fundraisers are found
                    resultsContainer.innerHTML = '<p class="error">No fundraisers found.</p>';
                } else {
                    // Loop through each fundraiser result and create a card for it
                    results.forEach((fundraiser) => {
                        const card = document.createElement("div");
                        card.classList.add("card");
                        card.innerHTML = `
                            <h3>${fundraiser.CAPTION}</h3>
                            <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
                            <p><strong>Target:</strong> $${fundraiser.TARGET_FUNDING}</p>
                            <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>
                            <p><strong>City:</strong> ${fundraiser.CITY}</p>
                            <p><strong>Category:</strong> ${fundraiser.CATEGORY}</p>
                            <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}">  <button class="donate-btn">Donate Now </button></a>
                        `;
                        resultsContainer.appendChild(card);
                    });
                }
            })
            .catch((error) => console.error("Error fetching search results!", error));
    });

    // Clear button functionality to reset the form and clear search results
    document.getElementById("clear-btn").addEventListener("click", () => {
        // Clear the values of the search form inputs
        document.getElementById("organizer").value = '';
        document.getElementById("city").value = '';
        document.getElementById("category").value = '';

        // Clear the search results display area
        document.getElementById("search-results").innerHTML = '';
    });
});
