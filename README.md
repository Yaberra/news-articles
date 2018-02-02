# news-articles

set up the server js folder, installed rewquired packages. 

Scraping

Within server.js set up a GET route for scraping the washington post website
First grabbed the body of the html with request
Then, loaded that into cheerio and save it to $ for a shorthand selector
Grabbed .pb-local-content tag
Create an empty result object
Added the text and href of every link, and save them as properties of the result object
successfully scraped data to the command line  
<img width="960" alt="logging scraped data as a json object on console" src="https://user-images.githubusercontent.com/30003973/35713559-f5c94c2c-0795-11e8-9235-715190413efc.png">

The data is also stored in the Mongo database. 
<img width="743" alt="articles logging to database" src="https://user-images.githubusercontent.com/30003973/35713553-f16a0c7a-0795-11e8-8099-0b5594aee2c3.png">

Created a heroku and deployed successfully to heroku. 

When a user clicks on Scraped Articles the data console logs as an object. 
<img width="960" alt="article logging on commandline" src="https://user-images.githubusercontent.com/30003973/35713549-ec16a76a-0795-11e8-8950-e4a27665496f.png">