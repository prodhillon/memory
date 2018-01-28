/*
Memory Game : HW 03
The code has two classes :
1. MemoryGame : It handles logic related to checking cards for match, number of clicks performed.
2. GameCard : It deals with logic related  to displaying/customizing cards based on status viz., Matched, Un-flipped.

 ***********************************************************************************************

References Taken to understand ReactJS:
1. https://reactjs.org/docs/state-and-lifecycle.html
2. https://reactjs.org/docs/lifting-state-up.html
3. https://reactjs.org/docs/conditional-rendering.html
4. https://medium.com/@hirodeath/how-do-you-implement-several-css-class-in-react-js-f50d7129684d
 */

//Importing required files
import React from 'react'
import ReactDOM from 'react-dom';
import classNames from 'classnames';

export default function memorygame_init(root) {
	ReactDOM.render(<MemoryGame />, root);
}

class MemoryGame extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
				gameCards: cardsInitialize(),// Initialize cards
				disabled: false, // For locking the game state when 1st new card is clicked
				previousCard: '', // To keep track of previous card
				clicksPerformed: 0, //To calculate scores based on number of clicks
				matchdone: 0 //To keep count of matches done			
		};
		this.checkCardMatch = this.checkCardMatch.bind(this); //for binding the state while checking cards
		this.restartGame = this.restartGame.bind(this);	// To help in resetting the current state of game
	}

	//Function for display game cards by setting up required parameters
	displayCards(gameCards) {
		return gameCards.map((gameCard, index) => {
			return (
				< GameCard key={index} name={gameCard.name} id={index} match={gameCard.match} turned={gameCard.turned} checkCardMatch={this.checkCardMatch} />
			);
		});
	}

	//Function to re-start the game. It will set all game parameters as null or void.	
	restartGame() {
		this.setState({gameCards: cardsInitialize(), previousCard: '', disabled: false, matchdone: 0, clicksPerformed: 0 });
	}

	//Function to check cards are matching or not
	checkCardMatch(id,name){
		//Check whether card is disabled or not
		let booltoprogress=this.checkDisableCards();
		//If card is currently disabled, return null. Wait for next card to select
		if(booltoprogress === false){
			return null;
		}
		//else start the card checking logic
		else{
			let gameCards = this.state.gameCards;
			this.setState({gameCards, disabled: true}); // Lock the state. to turn up other card		
			gameCards[id].turned = true;
			this.checkForPreviousCards(gameCards,id, name);
		}
	}

	//Function to check disable cards.
	checkDisableCards(){
		if(this.state.disabled){
			return false;		
		}
		else{
			return true;
		}
	}

	//Function to check current card with previously selected card
	checkForPreviousCards(gameCards,id, name){
		//If no previous card found
		if(!this.state.previousCard){
			this.setPreviousCard(id,name,gameCards);
		}
		else{
			this.checkWithPreviousCard(id,name,gameCards);		
		}
	}

	//Function to set previous card if no previous card found.
	setPreviousCard(id,name,gameCards){
		//Update the number of clicks
        let updateClicks=this.state.clicksPerformed;
		//Set current card as previous card
		this.setState({previousCard: {id, name}, disabled: false, clicksPerformed: updateClicks + 1});// For First click on every new match. No Previous card found
	}

	//Function if previous card is present and it does comparison with current card
	checkWithPreviousCard(id,name,gameCards){
		//If match found. set cards match status as true. Nullify the previous card and update matchdone, clicksPerformed
		if (this.state.previousCard.name === name) {
			this.setMatchStatus(this.state.previousCard.id,id,gameCards);
			this.updateGameStatus(gameCards, true);

		}
		//If match not found. Set timeout and after that set cards turned status as false.Nullify the previous card and update clicksperformed
		else {
			this.updateClicksPerformed();   // For updating number of clicks without delay
			setTimeout(() => {
				this.undoTurnedStatus(this.state.previousCard.id,id,gameCards);
				this.updateGameStatus(gameCards, false);
			}, 400);  

		}			
	}

	//If both cards match, set match status as true. It will help to invoke css for complete cards
	setMatchStatus(prevId,currId, cardToComplete){
		cardToComplete[prevId].match = true;
		cardToComplete[currId].match = true;
	}

	//If both cards don't match, set turned status as false. It will help to put the cards back in unturned state
	undoTurnedStatus(prevId, currId, cardToHide){
		cardToHide[prevId].turned = false;
		cardToHide[currId].turned = false;
	}

	//Function to update game status
	updateGameStatus(cardsToUpdate, boolmatch){
		if(boolmatch===true){
            		//Update count for matches done
			let updateMatch = this.state.matchdone;
            		//Update number of clicks
            		let updateClicks=this.state.clicksPerformed;
			this.setState({cardsToUpdate, previousCard: '', disabled: false, clicksPerformed: updateClicks + 1, matchdone: updateMatch + 2});// Adding 2 as matchupdate will happen for 2 cards.
		}
		else{
			this.setState({cardsToUpdate, previousCard: '', disabled: false});
		}
	}

	//Function to count the number of clicks performed
	updateClicksPerformed(){
		this.state.clicksPerformed ++;
	}

	//Function for rendering data on page
	render() {
		let strRestart = 'Restart Game';
		let msgScores;
		let numClicks=this.state.clicksPerformed;
		//Logic to set scores based on number of  clicks performed to complete the game
		if (this.state.matchdone === this.state.gameCards.length) {
			// Check for 8 clicks. As 16 cards will make 8 matches and for each match was updated  by 1
			if(this.state.clicksPerformed < 25){
				console.log("Inside Perfect score");
				msgScores = 100 + " (Excellent. Perfect Score !!)";
			}
			// Decreasing final scores as number of clicks increases
			if(this.state.clicksPerformed  > 25 && this.state.clicksPerformed  < 30){
				console.log("Inside Medium score");				
				msgScores = 80 + " (Good Job. Near Perfect !)";
			}
            		if(this.state.clicksPerformed  == 25 || this.state.clicksPerformed  == 30){
				console.log("Inside Medium score");				
				msgScores = 80 + " (Good Job. Near Perfect !)";
			}
			if(this.state.clicksPerformed > 30){
				console.log("Inside Low score");
				msgScores = 60 + " (Not Bad. You can do better !)";
			}

		}
		return (	<div className="rowMain">
				<div className="row">     		
				{this.displayCards(this.state.gameCards).map((gamecard , index) => 
				<div className="col-3" key={index}>{gamecard}</div>
				)}
				<br />
				<div className="col-12">
				Number of Clicks Performed : {numClicks}
				</div>
				<br />
				<div className="col-12">
				Complete the game in less than 25 clicks to earn THE PERFECT SCORE !!
				</div>
				<div className="col-8">
				Scores Earned : {msgScores}
				</div>
				<div className="col-4">
				<button onClick={this.restartGame}>{strRestart}</button>
				</div>
				</div>
				</div>
		);
	}
}

//Function to initialize the cards. This method generates a random number and based on it the game changes the card positions
function cardsInitialize(){
	//To change game state on every restart
	let numRandom=Math.floor(Math.random() * 5) + 1;
	console.log("numRandom --> "+numRandom);	
	let gamecards=[];;
	if(numRandom === 1){
		gamecards=["A", "C", "B", "D", "A", "B", "C", "D", "E", "F", "H", "G", "F", "E", "G", "H"];
	}
	if(numRandom === 2){ 
		gamecards=["C", "C", "D", "A", "A", "B", "B", "D", "E", "E", "G", "H", "F", "F", "G", "H"];
	}
	if(numRandom === 3){
		gamecards=["A", "B", "C", "D", "E", "F", "G", "H", "H", "G", "F", "E", "D", "C", "B", "A"];
	}
	if(numRandom === 4){
		gamecards=["H", "G", "F", "E", "D", "C", "B", "A", "A", "B", "C", "D", "E", "F", "G", "H"];
	}
	if(numRandom === 5){
		gamecards=["H", "G", "F", "H", "G", "F", "D", "D", "E", "C", "B", "A", "B", "E", "C", "A"];
	}

	let i=0;
	let initialStatus= false;	
	return [
		{ name: gamecards[i], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+1], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+2], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+3], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+4], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+5], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+6], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+7], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+8], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+9], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+10], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+11], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+12], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+13], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+14], match: initialStatus, turned: initialStatus},
		{ name: gamecards[i+15], match: initialStatus, turned: initialStatus},
		];

}

class GameCard extends React.Component {
	constructor(props) {
		super(props);
		this.flipCard = this.flipCard.bind(this);
	}

	//Function for rendering cards based on match/turned status
	render() {
		let strCardValue;
		if(this.props.turned === false){
			strCardValue = '';    	
		}
		else{
			strCardValue = this.props.name;	
		}
		//Fetching the css files based on condition of game cards		
		let classesCSS = classNames('GameCard', {'GameCardMatch': this.props.match}, {'GameCardFlip': this.props.turned});    
		return (
				<div className={classesCSS} onClick={this.flipCard}> {strCardValue} </div>
		);
	}

	//Function to call when a user clicks  on card
	flipCard() {
		//The Logic should run only when card is not unturned. by clicking on already matched cards else case will occur.
		if (this.props.turned === false) {
			this.props.checkCardMatch(this.props.id, this.props.name);
		}
		else{
			return null;
		}
	}
}

