$(document).ready(function(){

var topics = ["megaman x","castlevania","super contra","strider hiryu","doctor strange","hulk","berserk","spider-man"];


var searchUrl = "http://api.giphy.com/v1/gifs/search?q=";
var key = "&api_key=dc6zaTOxFJmzC";
var limit = "&limit=48";
var searchTerm = "grim";

var returnedData;

var expandedImages = 0;
var totalImagesReturned = 48;
var totalClusters;
var filledClusters = [];
var attachedImages = [];
var injector = [];
var buttonColors = ["btn-primary","btn-success","btn-warning","btn-danger"]

createButtons();


function retrieveData(){
	$.ajax({
		url: searchUrl + searchTerm + limit + key,
		method: "GET"
	}).done(function(response){
		//console.log(response);
		returnedData = response;
		//console.log(returnedData);
		createGrid();
	})
}	

function createGrid(){
	var totalGridBlocks = totalImagesReturned + (expandedImages*3);
	if (totalGridBlocks%4 == 0){
		totalClusters = totalGridBlocks/4;
	} else {
		totalClusters = (totalGridBlocks/4) + 1;
	}
	$(".gridContainer").empty();
	for (i=0;i<totalClusters;i++){
		$(".gridContainer").append("<div class='gridCluster' data-cluster='"+i+"'><div class='gridBlock block0' data-block='0'></div><div class='gridBlock block1' data-block='1'></div><div class='gridBlock block2' data-block='2'></div><div class='gridBlock block3' data-block='3'></div></div>");
	}
	fillGrid();
}

function fillGrid(){
	//console.log("filled Grid");
	var cluster = 0;
	var block = 0;
	for (i=0;i<totalImagesReturned;i++){
		if (filledClusters.indexOf(""+cluster)!=-1){
				cluster++;
				block = 0;
				i--;
				//console.log("filled cluster");
		} else {
			if (attachedImages.indexOf(""+i)== -1){
				//console.log(returnedData);
				var stillUrl = returnedData.data[i].images.original_still.url;
				//console.log(stillUrl);
				var movingUrl = returnedData.data[i].images.original.url;
				//console.log(movingUrl);
				var rating = returnedData.data[i].rating;
				//console.log(rating);
				$(".gridContainer").children().eq(cluster).children().eq(block).empty();
				$(".gridContainer").children().eq(cluster).children().eq(block).append("<img class='blockGif' data-imageNumber='"+i+"' data-still='"+stillUrl+"' data-moving='"+movingUrl+"' src='"+stillUrl+"'><p class='ratingPara'>"+rating+"</p>")
				//console.log("index="+filledClusters.indexOf(""+cluster));
				if (block == 3){
					cluster++;
					block = 0;
					//console.log("next cluster");
				} else {
					block++;
					//console.log("next block");
				}
			} else {
				//console.log("image Attached");
			}
		}
	}
	for (var i = 0; i < injector.length; i++) {
		var imageDiv = $("<img>").addClass("expandedGif").attr("src",injector[i].url).attr("data-injectorIndex",i);
		$(".gridContainer").children().eq(injector[i].cluster).append(imageDiv);
	}
}


$(document).on("click", ".gridBlock", function(){
	var clusterNumber = $(this).parent().attr("data-cluster");
	//console.log(clusterNumber);
	filledClusters.push(clusterNumber);
	//console.log(filledClusters);
	var imageNumber = $(this).children().eq(0).attr("data-imageNumber");
	//console.log(imageNumber);
	attachedImages.push(imageNumber);
	//console.log(attachedImages);
	var movingUrl = $(this).children().eq(0).attr("data-moving");
	//console.log(movingUrl);
	injector.push({"cluster":clusterNumber, "image": imageNumber, "url":movingUrl});
	//console.log(injector);
	expandedImages++;
	createGrid();
})

$(document).on("click", ".expandedGif", function(){
 var injectorIndex = $(this).attr("data-injectorIndex");
 var clusterNumber = injector[injectorIndex].cluster;
 filledClusters.splice(filledClusters.indexOf(clusterNumber),1);
 var imageNumber = injector[injectorIndex].image;
 attachedImages.splice(attachedImages.indexOf(imageNumber),1);
 injector.splice(injectorIndex,1);
 expandedImages--;
 createGrid();
})


$(document).on("click",".btn",function(){
	var topic = $(this).attr("data-topic");

})

function createButtons(){
	$(".buttonContainer").empty();
	var colorRotation = 0;
	for (var i = 0; i < topics.length; i++) {
		$(".buttonContainer").append("<button class='topicButton btn "+buttonColors[colorRotation]+"' data-topic='"+topics[i]+"'>"+topics[i]+"</button>");
		if (colorRotation == 3){
			colorRotation = 0;
		} else {
			colorRotation++;
		}
	}
}

$(document).on("click", ".topicButton", function(){
	searchTerm = $(this).attr("data-topic");
	minimizeAllExpandedBlocks();
	retrieveData();
})


$("#addTopic").on("click", function(event) {
event.preventDefault();
var typedInTopic = $("#topicInput").val();
topics.push(typedInTopic);
createButtons();
$("#topicInput").val("");
 });


function minimizeAllExpandedBlocks(){
	injector = [];
	attachedImages = [];
	filledClusters = [];
	expandedImages = 0;
}

function expandAllBlocks(){
	minimizeAllExpandedBlocks();
	for (var i = 0; i < totalImagesReturned; i++) {
		var clusterNumber = i;
		filledClusters.push(clusterNumber);
		var imageNumber = i;
		attachedImages.push(imageNumber);
		var movingUrl = returnedData.data[i].images.original.url;
		injector.push({"cluster":clusterNumber, "image": imageNumber, "url":movingUrl});
	}
	expandedImages = totalImagesReturned;
	createGrid();
}

$("#expandAllBlocks").on("click", function(){
	expandAllBlocks();
})

$("#minimizeAllBlocks").on("click", function(){
	minimizeAllExpandedBlocks();
	createGrid();
})


//end
})