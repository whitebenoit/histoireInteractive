list = []

list.push({
	message: getMessage(),
	answer: "ok",
	emoji: getEmoji()
})

function Book(title, authors) { 
  this.title = title;
  this.author = authors;
  this.f = function(){
  	console.log('ok')
  }
}

var myBook = new Book("titre", "auteur");
console.log(myBook)