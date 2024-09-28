
//Necessary Modules
const express = require('express');
const app = express(); // initialize the express application
const dbConnection = require('./crowdfunding_db'); //import data from the database
const cors=require("cors"); // import the cors to hanle cross-origin requests

app.use(cors()); //ENABLE CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies


//----------------------_Fundraisers Routes------------

// GET API to retrieve all active fundraisers including their categories
app.get('/api/fundraisers', (req, res) => {  //SQL query to get the all active fundraiser and their associated
    const query = `
        SELECT F.FUNDRAISER_ID, F.ORGANIZER, F,CAPTION, F.TARGET_FUNDING, F.CITY, F.ACTIVE, C.NAME AS CATEGORY
        FROM FUNDRAISER F
        JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID
        WHERE F.ACTIVE = 1`;

    dbConnection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching fundraisers:', error);
            res.status(500).send('Failed to fetch fundraisers');
            return;     //Return a error response
        }
        res.json(results); //Send the lists of fundraiser as a json response
    });
});



//Get fundraiser bsaed on the search criteria( organizer, city and category)

app.get("/api/fundraisers/search", (req, res) => {
    const { organizer, city, category } = req.query; //

    // Now SQL to fetch the active fundraisers
    let query = `
        SELECT F.FUNDRAISER_ID, F.ORGANIZER, F.CAPTION, F.TARGET_FUNDING,
               F.CURRENT_FUNDING, F.CITY, F.ACTIVE, C.NAME AS CATEGORY
        FROM FUNDRAISER F
        JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID
        WHERE F.ACTIVE = 1
    `;

    const queryParams = [];

    if (organizer) { // Add the organizer filter
        query += " AND F.ORGANIZER LIKE ?";
        queryParams.push(`%${organizer}%`); //Search for organiser using a "like " clause
    }

    if (city) { // Add the city filter
        query += " AND F.CITY LIKE ?";
        queryParams.push(`%${city}%`); //Search for city using a "like " clause
    }

    if (category) { // Add the category filter
        query += " AND C.NAME LIKE ?";
        queryParams.push(`%${category}%`);  //Search for category using a "like " clause
    }

    // Now executing the query with the filters
    dbConnection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Error occurred fetching the fundraisers:', error);
            return res.status(500).json({ error: 'Internal Server Error' }); // Return the error response
        }
        res.json(results); // Return the filtered list of fundraisers
    });
});




//Get API to retrieve the details of the particular fundraisers  by  its ID

// Get fundraiser details by ID
app.get("/api/fundraisers/:id", (req, res) => {
    const fundraiserID = req.params.id;

    const query = `
        SELECT F.FUNDRAISER_ID, F.ORGANIZER, F.CAPTION, F.TARGET_FUNDING, F.CITY, F.ACTIVE, C.NAME AS CATEGORY
        FROM FUNDRAISER F
        JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID
        WHERE F.FUNDRAISER_ID = ? 
    `;
 //Excecute the query
    dbConnection.query(query, [fundraiserID], (error, results) => {
        if (error) {
            console.error("Error fetching the fundraiser details:", error); //log error
            return res.status(500).json({ error: "Server Error" }); // Return a 500 error response
        }
 //If the fundraisers is not found, return a 404 response
        if (results.length === 0) {
            return res.status(404).json({
                error: "Fundraiser not found"
            });
        }

        res.json(result[0]);// Return the details of the fundraiser as a JSON response
    });

});

/// Get all categories
app.get("/api/categories", (req, res) => {
    const query = 'SELECT * FROM CATEGORY';  //SQL query to fetch the all categories 
    

    //execute query
    dbConnection.query(query, (error, results) => {
        if (error) {
            console.error("Error Fetching categories:", error);  //log the error for the debugging
            return res.status(500).json({ error: "Internal server error" }); // Show 500 error in response 
        }

        res.json(results); // Return the list of categories
    });
});


//-----------------SERVER SETUP-----------------

//START THE SERVER AND LISTEN ON THE PROT 3000

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
