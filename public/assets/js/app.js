$(document).ready(function() {
            console.log("connected");

            // Displaying all scraped articles 
            // .........................................................................................................

            $(document).on("click", "#scrapedArticles", function() {
              console.log("testing results"); 
                $(".articles").empty();
                $.getJSON("/articles", function(articles) {
                  console.log(articles);
                    articles.forEach(function(result) {
                        console.log(result)
                        $(".articles").append("<tr><td>" + result._id + "</td>" +
                            "<td>" + result.title + "</td>" +
                            "<td>" + result.link + "</td>" +
                            "<td>" + result.image + "</td>" +
                            "<td>" + result.blurb + "</td>" +
                            "<td>" + result.notes + "</td></tr>");
                        
                    })
                })
            })


            function loadScrapedResults() {
            $.get("/articles", () => {
            console.log("here are the articles");
            }).done(() => {
            window.location.reload();
            });
            };

            // Saving the scraped Articles 
            // .............................................................................................................


            // When you click the saveArticle button
            $(document).on("click", "#addArticle", function() {
                $(".articles").empty();
                // db.articles.update() 

                // Grab the id associated with the article from the submit button
                var thisId = $(this).attr("data-id");

                // / Now make an ajax call for the Article
                $.ajax({
                        method: "GET",
                        url: "/articles/" + thisId
                    })
                    .then(function(data) {
                        console.log(data);
                    })

            })


            // Deleting Articles 
            // .....................................................................................................................


            $(document).on("click", ".deleteArticle", function() {
                // db.articles.remove() {
                var thisId = $(this).attr("data-id");

                $.ajax({
                    method: "GET",
                    url: "/articles/" + thisId

                })

                // }  

            });



            // Adding and Updating Notes 

            // ....................................................................................................................

            // Whenever someone clicks the save note button
            $(document).on("click", ".Notes", function() {
                // Pop open the modal dialog
                $('#modal1').modal('open');
                // Empty the notes from the note section
                $(".Notes").empty();
                // Save the id 
                var thisId = $(this).attr("data-id");

                // Now make an ajax call for the Article
                $.ajax({
                        method: "GET",
                        url: "/articles/" + thisId
                    })
                    // With that done, add the note information to the page
                    .then(function(data) {
                        console.log(data);
                        // The title of the article
                        $(".Notes").append("<article class='modal-header'><h5>" + result.title + "</h5>");
                        // An input to enter a new title
                        $(".Notes").append("<input class='modal-title' name='title' >");
                        // A textarea to add a new note body
                        $(".Notes").append("<textarea class='modal-body' name='body'></textarea>");
                        // A button to submit a new note, with the id of the article saved to it
                        $(".Notes").append("<button data-id='saveNote'" + data._id + "' >Save Note</button>");

                        // If there's a note in the article
                        if (data.note) {
                            // Place the title of the note in the title input
                            $("#titleinput").val(data.Notes.title);
                            // Place the body of the note in the body textarea
                            $("#bodyinput").val(data.Notes.body);
                        }
                    })
                // Run a POST request to change the note, using what's entered in the inputs
                $.ajax({
                        method: "POST",
                        url: "/articles/" + thisId,
                        data: {
                            // Value taken from title input
                            title: $(".modal-title").val(),
                            // Value taken from note textarea
                            body: $(".modal-body").val()
                        }
                    })
                    // With that done
                    .then(function(data) {
                        // Log the response
                        console.log(data);
                        // Empty the notes section
                        $(".Notes").empty();

                    })

                // Also, remove the values entered in the input and textarea for note entry
                $("#titleinput").val("");
                $("#bodyinput").val("");

            });

            // Deleting Notes 
            // .......................................................................................................................

            $(document).on("click", ".deleteNote", function() {
                // db.articles.remove() {
                // Grab the id associated with the article from the submit button
                var thisId = $(this).attr("data-id");
                // / Now make an ajax call for the Article
                $.ajax({
                    method: "GET",
                    url: "/articles/" + thisId

                })

                // }
            })

        });