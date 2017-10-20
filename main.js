
// Localisation of the chat Pipeline
var locChatPipeline = $("chat_pipeline");

function buttonAddClass() {
	$("#fs_but").addClass('fs_transitionButton');
	$("#fs_textSlide").addClass('hidden');
	var delayTimeOut = setTimeout( function(){
		$("#fs_all").addClass('hidden');
		$("#chat_window").removeClass('hidden');
		init();
	}, 600);
	
}

// Loads JSON data into a variable
var dataJSON = null;
// We wait for the DOM to be loaded so we don't have issue with stuff not being loaded.
$(document).ready(function(){
	$.getJSON("main.json", function(inData, err) {	// Loading is asynchronous
	    dataJSON = inData;
	  	// Now that we have all our data loaded, call game initialization
	    // init();
	});
});

function reloadPage(){
	location.reload(true);
}

// Game initialization function
function init() {

  // Init...
  var mainGM = new GameManager();
  mainGM.Init();
}
