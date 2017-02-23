$(document).ready(function(){

var topics = ["megaman","castlevania","contra","strider"]


var searchUrl = "http://api.giphy.com/v1/gifs/search?q=";
var key = "&limit=40&api_key=dc6zaTOxFJmzC";
var searchTerm = "random";

createButtons();


function searchedGif(){
	$.ajax({
		url: searchUrl + searchTerm + key,
		method: "GET"
	}).done(function(response){
		console.log(response);
		console.log(response.data[0].images.original.url);
		var rowNumber = 0;
		var colNumber = 0;

		for (i=0; i<response.data.length; i++) {
			console.log($(".gridContainer").children().eq(rowNumber).children().eq(colNumber))
			$(".gridContainer").children().eq(rowNumber).children().eq(colNumber).append($("<img src='"+response.data[i].images.original_still.url+"' class='gridBlockGif' data-still='"+response.data[i].images.original_still.url+"' data-moving='"+response.data[i].images.original.url+"'> <p class='normalFont'>"+response.data[i].rating+"</p>"))
			$(".gifCol").append($("<div class='gifContainer'> <img src='"+response.data[i].images.original_still.url+"' class='displayedGif' data-still='"+response.data[i].images.original_still.url+"' data-moving='"+response.data[i].images.original.url+"'> <p>"+response.data[i].rating+"</p> </div>"))
			if (colNumber == 9){
				colNumber = 0;
				rowNumber++;
			} else {
				colNumber++;
			}
		}
		

	})
}


function createButtons(){
	$(".buttonCol").empty();
	for (i=0; i<topics.length;i++){
		var btn = $("<button id='"+topics[i]+"'>");
		var btnClass = btn.addClass("btn btn-primary topic");
		var btnFilled = btnClass.text(topics[i]);
		$(".buttonCol").append(btnFilled);
	}
}

$(document).on("click",".topic",function(){
	console.log(this);
	var buttonId = $(this).attr("id");
	console.log(buttonId);
	searchTerm = buttonId;
	$(".gifCol").empty();
	searchedGif();
})


$(document).on("click",".gifContainer", function(){
	console.log(this);
	console.log($(this).children().eq(0).attr("src"));
	if ($(this).children().eq(0).attr("src") == $(this).children().eq(0).attr("data-moving")){
		var stillUrl = $(this).children().eq(0).attr("data-still");
		$(this).children().eq(0).attr("src", stillUrl);
		$(this).css({
			"height":"92px",
			"width" :"92px"
		})
	} else {
		var movingUrl = $(this).children().eq(0).attr("data-moving");
		$(this).children().eq(0).attr("src", movingUrl);
		$(this).css({
			"height":"200px",
			"width" :"200px",
			"z-index":"-1"
		})
	}
})

$("#add-topic").on("click", function(event) {
    event.preventDefault();
    var topic = $("#topic-input").val().trim();
    if (topic == ""){
       	console.log("field is blank")
    } else {
      	topics.push(topic);
    	createButtons();
    }
});


$(document).on("click",".gridBlock", function(){
	console.log(this);
	console.log($(this).children().eq(0).attr("src"));
	if ($(this).children().eq(0).attr("src") == $(this).children().eq(0).attr("data-moving")){
		var stillUrl = $(this).children().eq(0).attr("data-still");
		$(this).children().eq(0).attr("src", stillUrl);
		$(this).css({
			"height":"100px",
			"width" :"100px"
		})
	} else {
		var movingUrl = $(this).children().eq(0).attr("data-moving");
		$(this).children().eq(0).attr("src", movingUrl);
		$(this).css({
			"height":"200px",
			"width" :"200px"
		})
	}
})


$(document).on("mouseenter", ".gifContainer", function(){
	$(this).css("box-shadow", "4px 4px 4px 4px");
})

$(document).on("mouseleave", ".gifContainer", function(){
	$(this).css("box-shadow","2px 2px 2px 2px");

})


})