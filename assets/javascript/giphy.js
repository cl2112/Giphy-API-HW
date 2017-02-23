$(document).ready(function(){

var topics = ["megaman","castlevania","contra","strider"]


var searchUrl = "http://api.giphy.com/v1/gifs/search?q=";
var key = "&api_key=dc6zaTOxFJmzC";
var searchTerm = "random";

createButtons();


function searchedGif(){
	$.ajax({
		url: searchUrl + searchTerm + "+nes" + key,
		method: "GET"
	}).done(function(response){
		console.log(response);
		console.log(response.data[0].images.original.url);

		for (i=0; i<response.data.length; i++) {
			$(".gifCol").append($("<div class='gifContainer'> <img src='"+response.data[i].images.original_still.url+"' class='displayedGif' data-still='"+response.data[i].images.original_still.url+"' data-moving='"+response.data[i].images.original.url+"'> <p>"+response.data[i].rating+"</p> </div>"))
		}
		

	})
}

$("#random").on("click", function(){
	searchedGif();
})

function createButtons(){
	for (i=0; i<topics.length;i++){
		var btn = $("<button id='"+topics[i]+"'>");
		var btnClass = btn.addClass("btn btn-primary topic");
		var btnFilled = btnClass.text(topics[i]);
		$(".buttonCol").append(btnFilled);
	}
}

$(".topic").on("click",function(){
	console.log(this);
	var buttonId = $(this).attr("id");
	console.log(buttonId);
	searchTerm = buttonId;
	searchedGif();
})


$(document).on("click",".gifContainer", function(){
	console.log(this);
	console.log($(this).children().eq(0).attr("src"));
	if ($(this).children().eq(0).attr("src") == $(this).children().eq(0).attr("data-moving")){
		var stillUrl = $(this).children().eq(0).attr("data-still");
		$(this).children().eq(0).attr("src", stillUrl);
	} else {
		var movingUrl = $(this).children().eq(0).attr("data-moving");
		$(this).children().eq(0).attr("src", movingUrl);
	}
	
})






$(document).on("mouseenter", ".gifContainer", function(){
	$(this).css("box-shadow", "4px 4px 4px 4px");
})

$(document).on("mouseleave", ".gifContainer", function(){
	$(this).css("box-shadow","2px 2px 2px 2px");

})


})