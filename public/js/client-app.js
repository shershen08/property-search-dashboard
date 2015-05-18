//Search&Scrape
$(document).ready(function() {
    
    
    var scraper = new Scraper();
    scraper.init();









    var chatCahce = '';
    var chatUser = Math.random().toString(36).substring(7);
    $('.chat-wrapper h4 small').text(chatUser);
    var lastPublished = 0;


    function addChatMsgUI (data){

        var msgClass = 'partner';
        if(data[0] === chatUser){
            msgClass = 'me';
        }

        $('<div class="mgsg-item ' + msgClass + '"/>')
                                     .text(data[1])
                                     .appendTo($('#chat-list'));

        $('#chat-list').scrollTop(100000);
    }

    function updateChat(){

      $.ajax({url: '/chat'})
                .done(function(responseData){
                    //console.info('msg get', responseData);
                    var chatData = responseData.split('\n').reverse();

                    chatData.forEach(function(item){

                        var dataItem = item.split(' | ');
                        //[0] - user, [1] - msg, [2] - time

                        if(dataItem[2] > lastPublished){
                            
                            lastPublished = dataItem[2];

                            addChatMsgUI(dataItem);

                        } 
                    })


                });

    }

    $('#send-msg').on('click', function(){
        sendMsgAndUpdate()
    });
    $('#msg').on('keyup', function(event){
        if(event.keyCode == 13){ //Enter
                sendMsgAndUpdate();
        }
    });

    $('#chat-minify').click(function(event) {
        $('.chat-wrapper').toggleClass('minimised');
    });

    function sendMsgAndUpdate(){

             $.ajax({
                    url: '/chat',
                    method : "POST",
                    data: {"msg": $('#msg').val(), "user" : chatUser}
                })
                .done(function(responseData){
                    console.info('msg sent');
                    $('#msg').val('').focus();

                });
    }


 var chatUpdate = setInterval(function(){
                        updateChat();
                    }, 1000);
                      

});