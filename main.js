
// Localisation of the chat Pipeline
var locChatPipeline = $("chat_pipeline");

// Loads JSON data into a variable
var dataJSON = null;
$.getJSON("main.json", function(inData, err) {	// Loading is asynchronous
    dataJSON = inData;
  	// Now that we have all our data loaded, call game initialization
    init();
});
/* Here (line 6) dataJSON may not be available yet, but you can expect it to be in
a few ms. Just don't call any code straight from the script for a few ms.
*/

// Game initialization function
function init() {
  // Init...
  var mainGM = new GameManager();
  mainGM.Init();
}