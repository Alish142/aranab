document.addEventListener('DOMContentLoaded', function() {
    const fundraiserId = getFundraiserIdFromUrl();

    if (fundraiserId) {
        fetchFundraiserDetails(fundraiserId);
    } else {
        document.getElementById('fundraiser-details').innerHTML = '<p class="error-message">No fundraiser selected.</p>';
    }

    // Handle donate button click
    document.getElementById('donate-btn').addEventListener('click', function() {
        alert("This feature is under construction");

    });

    document.getElementById('return-btn').addEventListener('click', function() {
        window.history.back(); //This will take the user back to the previous page
    })


});

// Function to get the fundraiser ID from the URL
function getFundraiserIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Function to fetch fundraiser details
function fetchFundraiserDetails(fundraiserId) {
    fetch(`http://localhost:3000/api/fundraisers/${fundraiserId}`)
        .then(response => response.json())
        .then(fundraiser => {
            displayFundraiserDetails(fundraiser);
        })
        .catch(error => {
            console.error('Error fetching fundraiser details:', error);
            document.getElementById('fundraiser-details').innerHTML = '<p class="error-message">Error loading fundraiser details.</p>';
        });
}

// Function to display fundraiser details
function displayFundraiserDetails(fundraiser) {
    const fundraiserDetails = document.getElementById('fundraiser-details');
    fundraiserDetails.innerHTML = 
    `   <h3>${fundraiser.CAPTION}</h3>
        <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
        <p><strong>Target:</strong> $${fundraiser.TARGET_FUNDING}</p>
        <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>
        <p><strong>City:</strong> ${fundraiser.CITY}</p>
        <p><strong>Category:</strong> ${fundraiser.CATEGORY}</p>
       
        
    `;
  
}
