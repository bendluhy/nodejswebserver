var firebaseConfig = {
	apiKey: "AIzaSyDV0EfJ2DtxAKVG2Pb3ZeMzNQ0NiNpuvZQ",
	authDomain: "benji-s-webserver-database.firebaseapp.com",
	projectId: "benji-s-webserver-database",
	storageBucket: "benji-s-webserver-database.appspot.com",
	messagingSenderId: "521414194806",
	appId: "1:521414194806:web:6530d3b3b96909412f1157",
	measurementId: "G-K2BKVM8YED"
};
// Initialize Firebase
//var database = firebase.database();
//firebase.initializeApp(firebaseConfig);
//console.log(firebase.database.ref("/Users/bendluhy/username").get());

function randomNumber(start, max)
{
	return Math.floor(Math.random() * max) + start;
}
class Card
{
	constructor()
	{
		self.suit = randomNumber(1,4);
		self.number = randomNumber(1,13);
	}
	getSuit()
	{
		switch(self.suit)
		{
			case 1:
				return "Spades"
			case 2:
				return "Clubs"
			case 3:
				return "Diamonds"
			case 4:
				return "Hearts"
		}
	}
	getCardString()
	{
	var cardletter;
	switch (self.number)
	{
		case 1:
			cardletter = "Ace"
			return cardletter
		
		case 2:
			cardletter = "2"
			return cardletter;
		case 3:
			cardletter = "3"
			return cardletter;
		case 4:
			cardletter = "4"
			return cardletter;
		case 5:
			cardletter = "5"
			return cardletter;
		case 6:
			cardletter = "6"
			return cardletter;
		case 7:
			cardletter = "7"
			return cardletter;
		case 8:
			cardletter = "8"
			return cardletter;
		case 9:
			cardletter = "9"
			return cardletter;
		case 10:
			cardletter = "10"
			return cardletter;
		case 11:
			cardletter = "Jack"
			return cardletter
		case 12:
			cardletter = "Queen"
			return cardletter
		case 13:
			cardletter = "King"
			return cardletter
	}
	}
}
class Hand
{
	constructor()
	{
		self.card1 = new Card()
		self.card2 = new Card()
	}
	drawNewCard()
	{
		
	}
}

function start()
{

}
function hit()
{

}
function stand()
{

}