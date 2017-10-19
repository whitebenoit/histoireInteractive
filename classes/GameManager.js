var MSG_TYPE_INTERLOCUTEUR 	= 0;
var MSG_TYPE_JOUEUR 		= 1;


function GameManager(){
	this.listDiscussion = [];
	this.listAllMessage = [];
	this.currentDiscussionID;
	this.nextElementName;

	/* Update the Chat Display:
	* Remove all element,
	* Re add all elements,
	* ?? Add notifications for not read elements ??
	*/
	this.updateDisplay = function(){


	}

	this.createDiscussion = function(discussionName){
		var tmp_discussion = this.createDiscussionObjectFromJSONByName(discussionName,this);
		this.listDiscussion.push(tmp_discussion);
		this.addDiscussionToHTMLList(tmp_discussion);
		tmp_discussion.addToHTML();
		return tmp_discussion;
	}

	this.createDiscussionObjectFromJSONByName = function(discussionName){
		var tmp_JSONdiscussion 		= new Discussion(discussionName,this);
		tmp_JSONdiscussion.text 	=  dataJSON[discussionName]["text"];
		tmp_JSONdiscussion.portrait	=  dataJSON[discussionName]["portrait"];
		tmp_JSONdiscussion.background= dataJSON[discussionName]["background"];
		tmp_JSONdiscussion.audioMsgInterlocuteur= dataJSON[discussionName]["audioMsgInterlocuteur"];
		tmp_JSONdiscussion.audioMsgJoueur= dataJSON[discussionName]["audioMsgJoueur"];
		tmp_JSONdiscussion.audioChoixJoueur= dataJSON[discussionName]["audioChoixJoueur"];
		return tmp_JSONdiscussion;
	}

	this.setCurrentDiscussionClickEvent = function(donnee){
		donnee.data.gameManager.setCurrentDiscussion(donnee.data.discussionName);
	}

	this.setCurrentDiscussion = function(discussionName){
		if(this.isDiscussionByNameExist(discussionName)){
			var oldDiscussion = this.currentDiscussionID;
			var newDiscussion = discussionName;

			// Remove previous if it exist
			if (oldDiscussion !=undefined) {
				// Remove the class from the previous current discussion in the list
				$("#chat_disc_list").find('#'+oldDiscussion+'_list_element').removeClass('chat_disc_list_element_current');
				// Add the hidden class
				$("#chat_window>#chat_curr_disc").find('#'+oldDiscussion).addClass('hidden');
			}	

			// Add new
				// Add the class from the new current discussion in the list
			$("#chat_disc_list").find('#'+newDiscussion+'_list_element').addClass('chat_disc_list_element_current');
				// Remove the hidden class
			$("#chat_window>#chat_curr_disc").find('#'+newDiscussion).removeClass('hidden');

			// Change the GM current Discussion
			this.currentDiscussionID = newDiscussion;
			return true;
		}else{
			console.log('setCurrentDiscussion didn\'t find the discussion '+discussionName+' in the list');
			return false;
		}
	}

	this.addDiscussionToHTMLList = function(discussion){
		var currGM = this;
		var discHTML = "";
		discHTML += '<div class="chat_disc_list_element"  id="'+discussion.name+'_list_element">';
		discHTML += '\n	<div>';

		var myPortraitImage = new Image();
		myPortraitImage.onload = function (){
				// If Portrait exist
				discHTML += '\n		<img src="'+myPortraitImage.src+'">';
				currGM.addDiscussionToHTMLLIstAppending(discHTML,discussion);
		}
		myPortraitImage.onerror = function(){
				// If the portrait fail to load
				discHTML += '\n		<img src="images/portraits/Default_Portrait.png">';
				currGM.addDiscussionToHTMLLIstAppending(discHTML,discussion);
		}
		myPortraitImage.src = 'images/portraits/'+discussion.portrait;

	}

	this.addDiscussionToHTMLLIstAppending = function(discHTML,discussion){
		
		discHTML += '\n	</div>';
		discHTML += '\n	<div class="chat_disc_list_text">';
		discHTML += '\n		'+discussion.text+'';
		discHTML += '\n	</div>';
		discHTML += '</div>';

		$("#chat_disc_list").append(discHTML);

		$('#chat_disc_list').find('#'+discussion.name+'_list_element').click({"discussionName":discussion.name,"gameManager":this},this.setCurrentDiscussionClickEvent);
	}

	this.isDiscussionByNameExist = function(discussionName){
		if( this.listDiscussion != []){
			for( var i = 0, l = this.listDiscussion.length;i<l;i++){
				if( discussionName == this.listDiscussion[i].name){
					return true;
				}
			}
		}
		return false;
	}

	this.getDiscussionByName = function(discussionName){
		var returnedDiscussion =null;
		if( this.listDiscussion != []){
			$.each( this.listDiscussion, function(index,tmp_discu){
				if( discussionName == tmp_discu.name){
					returnedDiscussion = tmp_discu;
				}
			});
		}
		return returnedDiscussion;
	}


	/*
	* Check is a message with this name exist in any discussion
	* 
	*/
	this.isMessageByNameExistInAnyDiscussion = function(name){
		var exist = false;
		if(this.listDiscussion != []){
			$.each(this.listDiscussion, function(i,discussion){
				if(this.isMessageByNameExistInThisDiscussion(name,discussion)){
					exist = true;
				}
			});
		}else{
			return false;
		}
		return exist;
	}

	/*
	* Check is a message with this name exist the discussion provided
	* 
	*/
	this.isMessageByNameExistInThisDiscussion = function(name,discussion){
		var exist = false;

		if(discussion.listMessage != []){
			$.each(this.listAllMessage, function(index,message){
				if(message.name == name){
					exist = true;
				}
			});
		}else{
			return false;
		}

		return exist;
	}

	this.getMessageByNameAnyDiscussion = function(name){
		if(this.listDiscussion != []){
			var currentGM = this;
			$.each(this.listDiscussion, function(i,discussion){
				var disc_message = currentGM.getMessageByNameInThisDiscussion(name,discussion)
				if(disc_message != null){
					return disc_message;
				}
			});
		}
		return null;
	}


	this.getMessageByNameFromList = function(name){
		if(this.listAllMessage!=[]){
			$.each(this.listAllMessage, function(i,message){
				if(message.name = name){
					return message;
				}
			})
		}
		return null;
	}


	this.getMessageByNameInThisDiscussion = function(name,discussion){
		var tmp_message= null;

		if(discussion.listMessage != []){
			$.each(this.listAllMessage, function(index,message){
				if(message.name == name){
					return message;
				}
			});
		}else{
			return null;
		}

		return tmp_message;
	}

	this.createMessageObjectFromJSONByName = function(name){
		var tmp_JSONmessage = dataJSON[name]
		tmp_JSONmessage.name = name;
		return tmp_JSONmessage;
	}


	this.addNewAnswerChoice = function(discussion,message){
		if(message.type == MSG_TYPE_JOUEUR){
			discussion.addAnswerChoice(message);
		}else{
			console.log("Inccorrect message type, should be Joueur = "+MSG_TYPE_JOUEUR);
		}
	}

	this.postMessageIntoChat = function(discussion,message){
		discussion.addMessage(message);
		// this.fireNextElement(message.nextElement);
	}

	this.fireNextElement = function(name){


		// Get the message that is next
		var message = this.getMessageByNameAnyDiscussion(name);
			// If message is not in any discution, we check the message list
		if (message == null){
			var lst_message = this.getMessageByNameFromList()
			if (lst_message != null){
				message = lst_message;
			}
		}
			// If message don't exist, we create the object Message from the JSON
		if(message == null){
			var message = this.createMessageObjectFromJSONByName(name);
			this.listAllMessage.push(message);
		}

		// Now if we have a message
		if(message !=null){
			// We check if the discussion of the message exist
			if(!this.isDiscussionByNameExist(message.discussion)){
				//If it doesn't exist, we create it
				this.createDiscussion(message.discussion);
			}


			// Depending on the type of the message, add a new answer choice 
			// or post a new message in the chat
			if(message.type == MSG_TYPE_JOUEUR){
				this.addNewAnswerChoice(this.getDiscussionByName(message.discussion),message);
			} else if (message.type == MSG_TYPE_INTERLOCUTEUR){
				this.postMessageIntoChat(this.getDiscussionByName(message.discussion),message);
				// this.fireNextElement(message.nextElement);
			}
		}else{
			console.log("ERR - fireNextElement(): message == null");
		}
	}

	this.playerChoosing = function(donnee){
		var gameManager = donnee.data.gameManager
		var message = donnee.data.sourceMessage;
		var emoji = donnee.data.emoji;
		var nextElement = donnee.data.nextElement;

		
		myAudio = new Audio("sounds/"+donnee.data.discussion.audioChoixJoueur+".mp3");
		myAudio.play();

		// Clear the choice possibilities
		var currentDiscLoc = donnee.data.discussion.locator;
		currentDiscLoc.find(".chat_ans_text").text("");
		currentDiscLoc.find(".chat_ans_emoji_choice").text("");


		var myEmojiImage = new Image();
		var currGM = this;
		myEmojiImage.onload = function (){
				// If emoji is an image
				but_html = '<img class="chat_emoji_IMG" src="'+myEmojiImage.src+'">';
				// Create new message from the content of the answer and the emoji
				var newContent = message.content + ' ' + but_html;
				// Create the name of the Answer
				var answerName = message.name +'_ANS';
				// Create the new message(answer) then post it on the discussion
				var answer = new Message(answerName,MSG_TYPE_JOUEUR,newContent,gameManager.getDiscussionByName(message.discussion));
				answer.nextElement = nextElement;
				gameManager.postMessageIntoChat(answer.discussion,answer);
		}
		myEmojiImage.onerror = function(){
				// Create new message from the content of the answer and the emoji
				var newContent = message.content + ' ' + emoji;
				// Create the name of the Answer
				var answerName = message.name +'_ANS';
				// Create the new message(answer) then post it on the discussion
				var answer = new Message(answerName,MSG_TYPE_JOUEUR,newContent,gameManager.getDiscussionByName(message.discussion));
				answer.nextElement = nextElement;
				gameManager.postMessageIntoChat(answer.discussion,answer);
		}
		myEmojiImage.src = "images/emojis/"+emoji+'.png'; 

	}


	this.Init = function(){
		var firstElementName = "start";
		this.fireNextElement(firstElementName);
		var currGM = this;
		var delayTimeOut = setTimeout( function(){
			currGM.setCurrentDiscussion("INTRO");
		}, 800);
	}
}