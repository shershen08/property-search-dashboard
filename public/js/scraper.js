var Scraper = function(){


  function updateDocTitle(numOfRes){
        var old = document.title.split('::')[0];
        document.title = old + ' :: ' + numOfRes + ' results';
    }


    function showResults(dataList){

        $('#results-pre').empty();
        
        updateDocTitle(dataList.meta.total);

        $('#results-table').dynatable({dataset: {records: dataList.data}});
    }

    function bindings(){
         $('#go-search').click(function(event) {
            if($('#scrape-url').val().length > 1){

                var reqLine = $('#scrape-url').val().trim();


                $('#results-pre').html('Loading the results....');
                //dynatable.processingIndicator.show()

                $('<div class="history-item"/>').html('<span class="remove-item glyphicon glyphicon-remove pull-right"></span><h4>' + reqLine.split('http://www.pararius.nl/')[1] + '</h4>' 
                                                + (new Date())).appendTo($('#history-list'));

                $.ajax({
                    url: '/scrape?q=' + reqLine
                    //,data: {q: reqLine},
                })
                .done(function(responseData){
                    showResults(JSON.parse(responseData));
                })
                .fail(function() {
                    console.log("Error loading results from /scrape");
                });
                


            }
        });


        $('#history-list').on('click','.remove-item',function(event) {
           $(this).parent().remove();
        });
    }



    return {
        init : function(){

                bindings();
        }
    }

}