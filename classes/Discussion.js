// Object Discussion
// Used to manage message within it
var CHAT_CLASS_INTERLOCUTEUR = "chat_pipeline_message";
var CHAT_CLASS_JOUEUR = "chat_pipeline_answer";
// Default delay for the apparition of message in milliseconds !
var MESSAGE_DELAY_DEFFAULT = 1500;


function Discussion(name,gameManager){
	
	// List all the messages belonging to this discussion
	this.listMessage = [];
	this.name = name;
	this.gameManager = gameManager;
	this.locator;

	this.addMessage = function(message){

		// Parametring for the type of message Joueur/Interlocuteur
		var chat_class;
		if (message.type == MSG_TYPE_JOUEUR){
			chat_class = CHAT_CLASS_JOUEUR;
		// If the message is from the interlocuteur
		}else if (message.type == MSG_TYPE_INTERLOCUTEUR){
			chat_class = CHAT_CLASS_INTERLOCUTEUR;
		}
		// Appending 
		if (chat_class != undefined){
			var currentDiscussion = this;

			var msg_delay = MESSAGE_DELAY_DEFFAULT;
			if (message.delay != undefined){
				msg_delay = message.delay;
			}
			// If the message if from the player, no Waiting
			if(chat_class == CHAT_CLASS_JOUEUR){
				msg_delay = 0;
			}else{
			// If the message is from the interlocuteur we wait
				currentDiscussion.addWaitingMessage(chat_class);
			}

			var delayTimeOut = setTimeout( function(){
				currentDiscussion.locator.find(".chat_pipeline").find('.chat_pipeline_spinner').remove();
				// Add the true message
				currentDiscussion.listMessage.push(message);
				currentDiscussion.locator.find(".chat_pipeline").append('<div class="'+chat_class+' chat_pipeline_element" id ="'+message.name+'">'+message.content +'</div>');
				currentDiscussion.gameManager.fireNextElement(message.nextElement);
			}, msg_delay);
			
		}else{
			console.log("message type unidentified, currently is "+ message.type+" . Should be either "+CHAT_CLASS_INTERLOCUTEUR+" or "+CHAT_CLASS_JOUEUR);
		}
	}

	this.addWaitingMessage = function(type){
		var htmlWaitMsg = "";
		htmlWaitMsg += '<div class="'+type+' chat_pipeline_element chat_pipeline_spinner" >';
		htmlWaitMsg += '	<div class="chat_bouncer1"></div>';
		htmlWaitMsg += '	<div class="chat_bouncer2"></div>';
		htmlWaitMsg += '	<div class="chat_bouncer3"></div>';
		htmlWaitMsg += '	<div class="chat_bouncer4"></div>';
		htmlWaitMsg += '</div>';

		this.locator.find(".chat_pipeline").append(htmlWaitMsg);

	}

	this.addToHTML = function(){
		// If the discussion is not yet in the html
		if($("#"+this.name).length == 0 ){
			var htmlDisc = "";
			htmlDisc +='<div id="'+this.name+'" class="chat_discussion">';
			htmlDisc +='	<div class="chat_pipeline"> ';
			htmlDisc +='		 ';
			htmlDisc +='	</div> ';
			htmlDisc +='	<div class="chat_ans"> ';
			htmlDisc +='		<div class="chat_ans_text"> ';
			htmlDisc +='			 ';
			htmlDisc +='		</div> ';
			htmlDisc +='		<div class="chat_ans_emoji_choice"> ';
			htmlDisc +='		</div> ';
			htmlDisc +='	</div> ';
			htmlDisc +='</div> ';

			$("#chat_window").append(htmlDisc);
		}

		this.locator = $("#"+this.name);

	}

	this.addAnswerChoice = function(message){
		this.locator.find(".chat_ans_text").text(message.content);
		this.locator.find(".chat_ans_emoji_choice").text("");
		var currentDiscussion = this;
		$.each(message.choices,function(emoji,nextElement){
			currentDiscussion.add_choice(emoji,nextElement,message)
		});
	}

	this.add_choice = function(emoji,nextElement,sourceMessage){
		// Create Html of the button
		var but_html = '<button class="chat_emoji_but" id="'+nextElement+'">'+emoji+'</button>';
		// Get the emplacement of the button
		var chat_ans_emoji = this.locator.find(".chat_ans_emoji_choice");
		// Add the button
		chat_ans_emoji.append(but_html);
		// Add the .click event
		$('#'+nextElement).click({"sourceMessage":sourceMessage,"nextElement":nextElement,"emoji":emoji,"gameManager":this.gameManager,"discussion":this},this.gameManager.playerChoosing);
	}




}
