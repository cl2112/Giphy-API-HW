$(document).ready(function(){

var topics = ["megaman","castlevania","contra","strider"];


var searchUrl = "http://api.giphy.com/v1/gifs/search?q=";
var key = "&api_key=dc6zaTOxFJmzC";
var limit = "&limit=40";
var searchTerm = "grim";

var returnedData;

var expandedImages = 0;
var totalImagesReturned = 40;
var totalClusters;
var filledClusters = [];
var attachedImages = [];
var injector = [];



//createButtons();
//retrieveData();
//createGrid();
//fillGrid();


function retrieveData(){
	$.ajax({
		url: searchUrl + searchTerm + limit + key,
		method: "GET"
	}).done(function(response){
		console.log(response);
		returnedData = response;
		console.log(returnedData);
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
}



/*
function fillGrid(){
	console.log("filled grid")
	var cluster = 0;
	var block = 0;
	for (i=0;i<totalImagesReturned;i++){
		if (attachedImages.indexOf(""+i)== -1){
			if (filledClusters.indexOf(""+cluster)!=-1){
				cluster++;
				block = 0;
				i--;
				console.log("filled cluster");
			} else {
				//console.log(returnedData);
				var stillUrl = returnedData.data[i].images.original_still.url;
				//console.log(stillUrl);
				var movingUrl = returnedData.data[i].images.original.url;
				//console.log(movingUrl);
				$(".gridContainer").children().eq(cluster).children().eq(block).empty();
				$(".gridContainer").children().eq(cluster).children().eq(block).append("<img class='blockGif' data-imageNumber='"+i+"' data-still='"+stillUrl+"' data-moving='"+movingUrl+"' src='"+stillUrl+"'>")
				//console.log("index="+filledClusters.indexOf(""+cluster));
				if (block == 3){
					cluster++;
					block = 0;
					console.log("next cluster");
				} else {
					block++;
					console.log("next block");
				}
			}
		} else {
			console.log("image attached");
			$(".gridContainer").children().eq(cluster).append($("<img>").addClass("expandedGif").attr("src",returnedData.data[i].images.original.url));
			cluster++;
		}
	}
}
*/


function fillGrid(){
	console.log("filled Grid");
	var cluster = 0;
	var block = 0;
	for (i=0;i<totalImagesReturned;i++){
		if (filledClusters.indexOf(""+cluster)!=-1){
				cluster++;
				block = 0;
				i--;
				console.log("filled cluster");
		} else {
			if (attachedImages.indexOf(""+i)== -1){
				//console.log(returnedData);
				var stillUrl = returnedData.data[i].images.original_still.url;
				//console.log(stillUrl);
				var movingUrl = returnedData.data[i].images.original.url;
				//console.log(movingUrl);
				$(".gridContainer").children().eq(cluster).children().eq(block).empty();
				$(".gridContainer").children().eq(cluster).children().eq(block).append("<img class='blockGif' data-imageNumber='"+i+"' data-still='"+stillUrl+"' data-moving='"+movingUrl+"' src='"+stillUrl+"'>")
				//console.log("index="+filledClusters.indexOf(""+cluster));
				if (block == 3){
					cluster++;
					block = 0;
					console.log("next cluster");
				} else {
					block++;
					console.log("next block");
				}
			} else {
				console.log("image Attached");
				//$(".gridContainer").children().eq(cluster-1).append($("<img>").addClass("expandedGif").attr("src",returnedData.data[i].images.original.url));
				//	cluster++;
			}
		}
	}
	for (var i = 0; i < injector.length; i++) {
		var imageDiv = $("<img>").addClass("expandedGif").attr("src",injector[i].url).attr("data-injectorIndex",i);
		$(".gridContainer").children().eq(injector[i].cluster).append(imageDiv);
	}
}











$("#fill").on("click", function(){
	fillGrid();
})


$("#grid").on("click", function(){
	createGrid();
})
$("#data").on("click", function(){
	retrieveData();
})



$(document).on("click", ".gridBlock", function(){
	var clusterNumber = $(this).parent().attr("data-cluster");
	console.log(clusterNumber);
	filledClusters.push(clusterNumber);
	console.log(filledClusters);
	var imageNumber = $(this).children().eq(0).attr("data-imageNumber");
	console.log(imageNumber);
	attachedImages.push(imageNumber);
	console.log(attachedImages);
	var movingUrl = $(this).children().eq(0).attr("data-moving");
	console.log(movingUrl);
	injector.push({"cluster":clusterNumber, "image": imageNumber, "url":movingUrl});
	console.log(injector);
	expandedImages++;
	createGrid();
	fillGrid();
})

$(document).on("click", ".expandedGif", function(){
 var injectorIndex = $(this).attr("data-injectorIndex");
 var clusterNumber = injector[injectorIndex].cluster;
 filledClusters.splice(filledClusters.indexOf(clusterNumber),1);
 var imageNumber = injector[injectorIndex].image;
 attachedImages.splice(attachedImages.indexOf(imageNumber),1);
 injector.splice(injectorIndex,1);
 createGrid();
 fillGrid();
})










/*

		for (i=0; i<response.data.length; i++) {
			//console.log(filled.indexOf(""+rowNumber+colNumber))
			if (filled.indexOf(""+rowNumber + colNumber) != -1){
				if (colNumber == 9){
					console.log(""+rowNumber+colNumber+"-skipped and changed row")
					colNumber = 0;
					rowNumber++;
				} else {
					console.log(""+rowNumber + colNumber+"-skipped filled");
					$(".gridContainer").children().eq(rowNumber).children().eq(colNumber).empty();
					colNumber++;
					i--;
				}
			} else {
				//console.log($(".gridContainer").children().eq(rowNumber).children().eq(colNumber))
				$(".gridContainer").children().eq(rowNumber).children().eq(colNumber).empty();
				$(".gridContainer").children().eq(rowNumber).children().eq(colNumber).append($("<img src='"+response.data[i].images.original_still.url+"' class='gridBlockGif' data-still='"+response.data[i].images.original_still.url+"' data-moving='"+response.data[i].images.original.url+"' data-row='"+rowNumber+"' data-col='"+colNumber+"'> <p class='normalFont'>"+response.data[i].rating+"</p>"))
				//$(".gifCol").append($("<div class='gifContainer'> <img src='"+response.data[i].images.original_still.url+"' class='displayedGif' data-still='"+response.data[i].images.original_still.url+"' data-moving='"+response.data[i].images.original.url+"'> <p>"+response.data[i].rating+"</p> </div>"))
				if (colNumber == 9){
					colNumber = 0;
					rowNumber++;
				} else {
					colNumber++;
				}
			}
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
	console.log($(this).children().eq(0).attr("data-still"))
//	if ($(this).children().eq(0).attr("src") == $(this).children().eq(0).attr("data-moving")){
//		var stillUrl = $(this).children().eq(0).attr("data-still");
//		$(this).children().eq(0).attr("src", stillUrl);
		

//	} else {
		var movingUrl = $(this).children().eq(0).attr("data-moving");
		$(this).children().eq(0).attr("src", movingUrl);
		var positionRow = parseInt($(this).children().eq(0).attr("data-row"));
		var positionCol = parseInt($(this).children().eq(0).attr("data-col"));
		
		console.log($(this).children().eq(0).attr("data-row"));

		filled.push(""+positionRow+(positionCol+1),""+(positionRow+1)+positionCol, ""+(positionRow+1)+(positionCol+1))
		console.log(filled);
		$(this).clone().css({
			"position": "absolute",
			"top":""+(positionRow*100)+"px",
			"left":""+(positionCol*100)+"px",
			"height":"200px",
			"width":"200px"
		}).addClass("expandedDup ").appendTo(".gridContainer")
		//console.log(filled.indexOf("13"));
		searchedGif();

//	}
})

$(document).on("click", ".expandedDup", function(){
	$(this).remove();
})

$(document).on("mouseenter", ".gifContainer", function(){
	$(this).css("box-shadow", "4px 4px 4px 4px");
})

$(document).on("mouseleave", ".gifContainer", function(){
	$(this).css("box-shadow","2px 2px 2px 2px");

})
*/

})