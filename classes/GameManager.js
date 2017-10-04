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
		var tmp_discussion = new Discussion(discussionName,this);
		this.listDiscussion.push(tmp_discussion);
		tmp_discussion.addToHTML();
		return tmp_discussion;
	}

	this.isDiscussionByNameExist = function(discussionName){
		if( this.listDiscussion != []){
			$.each( this.listDiscussion, function(index,tmp_discu){
				if( discussionName == tmp_discu.name){
					return true;
				}
			});
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


	/*
	this.getMessageByNameByJSON = function(name){
		var tmp_message = dataJSON[name];
		if (!this.isDiscussionByNameExist(name)){
			this.createDiscussion(name,)
		}
		return tmp_message;
	}

	this.getDiscussionByNameByJSON = function(name){

	}
	*/

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

		// Clear the choice possibilities
		var currentDiscLoc = donnee.data.discussion.locator;
		currentDiscLoc.find(".chat_ans_text").text("");
		currentDiscLoc.find(".chat_ans_emoji_choice").text("");



		// Create new message from the content of the answer and the emoji
		var newContent = message.content + ' ' + emoji;
		// Create the name of the Answer
		var answerName = message.name +'_ANS';
		// Create the new message(answer) then post it on the discussion
		var answer = new Message(answerName,MSG_TYPE_JOUEUR,newContent,gameManager.getDiscussionByName(message.discussion));
		answer.nextElement = nextElement;
		gameManager.postMessageIntoChat(answer.discussion,answer);



	}


	this.Init = function(){
		this.fireNextElement("start");
	}
}