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
	this.text;
	this.portrait;
	this.background;

	this.addMessage = function(message){

		// Parametring for the type of message Joueur/Interlocuteur
		var chat_class;
		var message_type = message.type;
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
			if (message.delay != undefined && message.delay != ""){
				msg_delay = message.delay;
			}
			// If the message if from the player, no Waiting
			if(chat_class == CHAT_CLASS_JOUEUR){
				msg_delay = 0;
			}else{
			// If the message is from the interlocuteur we wait
				currentDiscussion.addWaitingMessage(chat_class);
				var chatPipeline = currentDiscussion.locator.find(".chat_pipeline");
				chatPipeline.scrollTop(chatPipeline[0].scrollHeight);
			}

			var delayTimeOut = setTimeout( function(){
				currentDiscussion.locator.find(".chat_pipeline").find('.chat_pipeline_spinner').remove();
				// Add the true message
				currentDiscussion.listMessage.push(message);
				currentDiscussion.locator.find(".chat_pipeline").append('<div class="'+chat_class+' chat_pipeline_element" id ="'+message.name+'">'+message.content +'</div>');
				if (message_type == MSG_TYPE_INTERLOCUTEUR) {
					myAudio = new Audio("sounds/"+currentDiscussion.audioMsgInterlocuteur+".mp3");
					myAudio.play();
				}else if (message_type == MSG_TYPE_JOUEUR){
					myAudio = new Audio("sounds/"+currentDiscussion.audioMsgJoueur+".mp3");
					myAudio.play();
				}
				var chatPipeline = currentDiscussion.locator.find(".chat_pipeline");
				chatPipeline.scrollTop(chatPipeline[0].scrollHeight);
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
			htmlDisc +='<div id="'+this.name+'" class="chat_discussion hidden">';
			htmlDisc +='	<div class="chat_pipeline"> ';
			htmlDisc +='		 ';
			htmlDisc +='	</div> ';
			htmlDisc +='	<div class="chat_ans"> ';
			htmlDisc +='		<div class="chat_ans_emoji_choice"> ';
			htmlDisc +='		</div> ';
			htmlDisc +='		<div class="chat_ans_text"> ';
			htmlDisc +='		</div> ';
			htmlDisc +='	</div> ';
			htmlDisc +='</div> ';

			$("#chat_window>#chat_curr_disc").append(htmlDisc);
			$("#"+this.name).css({"background":'url("images/backgrounds/'+this.background+'")'});
		}
		this.locator = $("#"+this.name);
	}


	this.addAnswerChoice = function(message){
		var currDisc = this;
		var textHtml = "";
		var charIndex = 0;
		this.typeAnswer(message,textHtml,charIndex,currDisc,function(){
			currDisc.locator.find(".chat_ans_text").text(message.content);
			currDisc.locator.find(".chat_ans_emoji_choice").text("");
			$.each(message.choices,function(emoji,nextElement){
				currDisc.add_choice(emoji,nextElement,message)
			});
		})
		
	}

	this.typeAnswer = function(message,textHtml,charIndex,currDisc, callback){
		var content = message.content
		var interval = 100;
		if (content.length < 10){
			interval = 150;
		}else if (content.length > 20){
			interval = 50;
		}

		if (charIndex< content.length){
			textHtml += content.charAt(charIndex++);
			this.locator.find(".chat_ans_text").text(textHtml);
			setTimeout( function() { 
				currDisc.typeAnswer(message,textHtml,charIndex,currDisc, callback);
				}, interval);
		} else {
			callback();
		}
	}

	this.add_choice = function(emoji,nextElement,sourceMessage){
		// Create Html of the button
		// Default value with no image swaping
		var but_html = '<button class="chat_emoji_but" id="'+nextElement+'_but">'+emoji+'</button>';
		var currDisc = this;
		var myEmojiImage = new Image();
		myEmojiImage.onload = function (){
				// If emoji is an image
				but_html = '<button class="chat_emoji_but" id="'+nextElement+'_but">';
				but_html += '<img class="chat_emoji_button_IMG" src="'+myEmojiImage.src+'">';
				but_html += '</button>';
				currDisc.add_choiceAppending(but_html,emoji,nextElement,sourceMessage);
		}

		myEmojiImage.onerror = function(){
				// If emoji is not the name of an image, no change
				currDisc.add_choiceAppending(but_html,emoji,nextElement,sourceMessage);
		}

		myEmojiImage.src = "images/emojis/"+emoji+'.png'; 


		// Get the emplacement of the button
		// var chat_ans_emoji = this.locator.find(".chat_ans_emoji_choice");
		// Append the HTML and attach the .click event to the appended element.
		// $(but_html).appendTo(chat_ans_emoji).click({"sourceMessage":sourceMessage,"nextElement":nextElement,"emoji":emoji,"gameManager":this.gameManager,"discussion":this},this.gameManager.playerChoosing);
	}

	this.add_choiceAppending = function(but_html,emoji,nextElement,sourceMessage){
		// Get the emplacement of the button
		var chat_ans_emoji = this.locator.find(".chat_ans_emoji_choice");
		// Append the HTML and attach the .click event to the appended element.
		$(but_html).appendTo(chat_ans_emoji).click({"sourceMessage":sourceMessage,"nextElement":nextElement,"emoji":emoji,"gameManager":this.gameManager,"discussion":this},this.gameManager.playerChoosing);
	}



}
