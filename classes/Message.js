// Object Message
var MSG_TYPE_INTERLOCUTEUR 	= 0;
var MSG_TYPE_JOUEUR 		= 1;

function Message(name,type,content,discussion){
	this.name		= name;
	this.type 		= type;
	this.content 	= content;
	this.discussion = discussion;
	this.wasRead	= false;
	

	// For Interlocuteur message ONLY
	this.nextElement = null;
	this.delay = 0;

	// For User Answer only
	this.choices = {};

}

