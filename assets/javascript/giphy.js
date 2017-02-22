$(document).ready(function(){

var topics = ["megaman","castlevania","contra","strider"]


var searchUrl = "http://api.giphy.com/v1/gifs/search?q=";
var key = "&api_key=dc6zaTOxFJmzC";
var searchTerm = "random";

createButtons();


function searchedGif(){
	$.ajax({
		url: searchUrl + searchTerm + key,
		method: "GET"
	}).done(function(response){
		console.log(response);
		console.log(response.data[0].images.original.url);
		for (i=0; i<response.data.length; i++) {
			$(".col-xs-12").append($("<div> <img src='"+response.data[i].images.original.url+"'> </div>"))
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
		$(".col-xs-12").append(btnFilled);
	}
}

$(".topic").on("click",function(){
	console.log(this);
	var buttonId = $(this).attr("id");
	console.log(buttonId);
	searchTerm = buttonId;
	searchedGif();
})


})