$(document).ready(function(){

var topics = ["megaman x","castlevania","super contra","strider hiryu","doctor strange","hulk","berserk","spider-man"];

var returnedData;

//Variables for the grid creating and grid filling functions.
//TotalImagesReturned can be changed to adjust the number of gifs returned from search up to 100.
var totalImagesReturned = 48;

var expandedImages = 0;
var totalClusters;
var filledClusters = [];
var attachedImages = [];
var injector = [];


//Used to change the colors of the buttons when creating them.
var buttonColors = ["btn-primary","btn-success","btn-warning","btn-danger"];



//query variables
var searchUrl = "http://api.giphy.com/v1/gifs/search?q=";
var key = "&api_key=dc6zaTOxFJmzC";
var limit = "&limit="+totalImagesReturned;
var searchTerm = "default";

createButtons();

//gets the data from the giphy servers and store the returned JSON object in returnedData.
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

//checks how many clusters are needed to have a place for every image and then creates the clusters
//then triggers the grid filling function
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

//fills up all the grid blocks created in createGrid() by starting in the first cluster's first block then continuing until
//there are no more blocks in the cluster then moves to the next cluster.
//checks if the cluster is full and if it is, then it moves to the next cluster.
//then it checks if the image is currenty attached to one of the filled clusters, if yes it skips the placement of that image,
//if no, then it fills that block with an image tag and attaches data to it.
//at the end, it goes back and fills every filled cluster with the image that is attached to it.
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

//when the user clicks on an image, add the values of it's location to appropriate arrays and creates an object to be used
//to fill in the cluster during fillGrid().
//then adds 1 to the total number of expanded images and calls the createGrid() function. 
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
//when the user clicks on an expanded image, remove the location data from their respective arrays, and remove the injector
//object tied to the image. Then reduce the number of expanded images by one and call the createGrid() function.
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

//for each topic in the topics array, append a button to .buttonContainer, alternating through the buttonColors array.
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

//when the user clicks on a topic button, take that topic and make it the new search term, then reset all attached images
//and filled clusters and injector data and start a search with the new search term.
$(document).on("click", ".topicButton", function(){
	searchTerm = $(this).attr("data-topic");
	minimizeAllExpandedBlocks();
	retrieveData();
})

//when the user clicks on the add topic button or presses enter, take the value of the text input and add it to the array
//of topics, then create buttons from the new topics array.
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