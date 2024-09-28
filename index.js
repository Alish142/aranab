
// Wait for the DOM to be fully loadead before executing the script
document.addEventListener('DOMContentLoaded', function() {
    fetchFundraisers();
// CAll the function to fetch data from the API and display them
    function fetchFundraisers() {
      // A get request to fundraisers API
        fetch('http://localhost:3000/api/fundraisers')
            .then(response => response.json())
            .then(data => {
                // The container element for the list of fundraisers
                const fundraisersList = document.getElementById('fundraisers-list');
                fundraisersList.innerHTML = ''; // Clear existing content
               // The data ilerated for each fundraiser
                data.forEach(fundraiser => {
                    // to create a new fundraiser in the data 
                    const fundraiserItem = createFundraiserItem(fundraiser);
                    //Adding the fundraiser item to the list
                    fundraisersList.appendChild(fundraiserItem);
                
                });
            })
            .catch(error => {
                //to find error if they occur
                console.error('Error fetching fundraisers:', error);
               // Display error message to the user 
                const fundraisersList = document.getElementById('fundraisers-list');
                fundraisersList.innerHTML = '<p class="error-message">Error loading fundraisers. Please try again later.</p>';
            });
    }

    function createFundraiserItem(fundraiser) {
        const fundraiserItem = document.createElement('div');
        fundraiserItem.classList.add('fundraiser-item');

        const progress = (parseFloat(fundraiser.CURRENT_FUNDING) / parseFloat(fundraiser.TARGET_FUNDING)) * 100;

        fundraiserItem.innerHTML = `
            <h3>${fundraiser.CAPTION}</h3>
            <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
            <p><strong>City:</strong> ${fundraiser.CITY}</p>
            <p><strong>Category:</strong> ${fundraiser.CATEGORY}</p>
            <p><strong>Target Funding:</strong> $${parseFloat(fundraiser.TARGET_FUNDING).toLocaleString()}</p>
            <p><strong>Current Funding:</strong> $${parseFloat(fundraiser.CURRENT_FUNDING).toLocaleString()}</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${progress}%"></div>
            </div>
            <p><strong>Progress:</strong> ${progress.toFixed(1)}%</p>
            <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}" class="donate-btn">DONATE</a>
        `;

        return fundraiserItem;
    }
});
