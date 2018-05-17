// Global variables
/*
 * A initial list that holds all cards
 */
let listOfAllCards = [
    'fa fa-anchor',
    'fa fa-anchor',
    'fa fa-bicycle',
    'fa fa-bicycle',
    'fa fa-bolt',
    'fa fa-bolt',
    'fa fa-bomb',
    'fa fa-bomb',
    'fa fa-cube',
    'fa fa-cube',
    'fa fa-diamond',
    'fa fa-diamond',
    'fa fa-leaf',
    'fa fa-leaf',
    'fa fa-paper-plane-o',
    'fa fa-paper-plane-o'
];

// variable to count player's moves
let numberOfMoves = 0;
// variable to keep number of stars
let numberOfStars = 3;
// stars variable to identify the HTML element that holds stars
const starsElement = document.querySelector('.stars');
// moves variable to identify the moves HTML element
const movesElement = document.querySelector('.moves');
// minutes variable to identify minutes HTML element
const minutesElement = document.querySelector('.minutes');
// minutes variable to identify seconds HTML element
const secondsElement = document.querySelector('.seconds');
// restartButton variable to identify restart button
const restartButton = document.querySelector('.restart'); 
 //variable to kepp add all card elements 
 const deckElements = document.querySelector('.deck'); 
// timer
let timer;
// current used time in seconds
let usedTime = 0;
// list of shuffled cards
let shuffledListOfCards = []
// list of matched cards
let matchedCards = [];
// list of currently compared cards
let currentlyComparedCards = [];
// flag to determine first move
let firstMove = true;

// Event listeners
// set event linstener on restart button
restartButton.addEventListener('click', resetBoard);
// set evenet listener to the cards
deckElements.addEventListener('click', reactToPlayersMove);

//start the game 
start();

function start() {
    resetBoard();
}

// Reset functionality
/*
 * Displays the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 */
// Function to reset the board
function resetBoard() {
    // Clear the board already exist >> createHTMLForCards(shuffledListOfCards), so no new function needed
    shuffledListOfCards = shuffle(listOfAllCards);
    createHTMLForCards(shuffledListOfCards);
    // reset results
    resetMoves();
    resetStars();
    resetTimeInHTML()
    usedTime = 0;
    // stop counting time
    stopTime();
    // reset first move flag
    firstMove = true;
}

// Resets the number of moves
function resetMoves() {
    numberOfMoves = 0;
    movesElement.textContent = numberOfMoves;
}
// Resets the number of stars
function resetStars(){
    let starsListHTMLItems = ` <li><i class="fa fa-star"></i></li>
                               <li><i class="fa fa-star"></i></li>
                               <li><i class="fa fa-star"></i></li> `;
    starsElement.innerHTML = starsListHTMLItems;
    numberOfStars = 3;
}

// Function to find deck list element and populate it with cards using shuffled array of cards
function createHTMLForCards(array){
    let cardListHTMLItems = '';
    
    array.forEach(element => {
                cardListHTMLItems += ' <li class="card"><i class="' + element + '"></i></li> '
    });

    deckElements.innerHTML = cardListHTMLItems;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
// End of reset functionality block

// Gameplay functionality

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// main gameplay function that reacts to a click to a card
function reactToPlayersMove(evt) {
    // display card
    displayCardsSymbol(evt);
    // check if the move is the first one
    if (firstMove) {
        // start timing
        setTime();
        // mark card as open
        markCardAsOpen(evt)
        // mark that first move were done       
        firstMove = false;
    }
     if (currentlyComparedCards.length > 0) {
        // if the cards match
        if (doCardsMatch(currentlyComparedCards[0],evt)) {
            // mark the cards as matched
            markCardsAsMatched(currentlyComparedCards[0],evt);
            updateMovesList();
            updateStarRating();
        } else {
            // hide cards from the board
            hideCardsSymbol(currentlyComparedCards[0],evt);
            // remove card from the compared cards list
            removeFromComparedCards();
            updateMovesList();
            updateStarRating();
        }
    }
};

// dispalys card by adding "show" class to a card element and "disabled" to avoid mutliple comparison of the same card
function displayCardsSymbol(newOpenCard){
    newOpenCard.target.classList.add("show");
    newOpenCard.target.classList.add("disabled");
    
}

// marks card as open by addign "open" class to a card element and adding it to list of compare cards
function markCardAsOpen(newOpenCard) {
    newOpenCard.target.classList.add("open");
    currentlyComparedCards.push(newOpenCard.target);
}

// function marks two cards as matched and persist this fact on the matchedCards list
function markCardsAsMatched(alreadyOpenCard,newOpenCard) {
    alreadyOpenCard.classList.add("match");
    newOpenCard.target.classList.add("match");
    matchedCards.push(alreadyOpenCard,newOpenCard.target);
}

//hides card and remove "open" mark 
function hideCardsSymbol(alreadyOpenCard,newOpenCard) {
    alreadyOpenCard.classList.remove("show");
    newOpenCard.target.classList.remove("show");
    alreadyOpenCard.classList.remove("open");
    newOpenCard.target.classList.remove("open");
    alreadyOpenCard.classList.remove("disabled");
    newOpenCard.target.classList.remove("disabled");
}

// removes card from the list of comapred cards)
function removeFromComparedCards(){
    currentlyComparedCards = [];
}

function doCardsMatch(alreadyOpenCard,newOpenCard) {
    return (alreadyOpenCard.innerHTML == newOpenCard.target.innerHTML) ? true : false;
    isGameOver();
}

function isGameOver() {
    if (listOfAllCards.length === matchedCards.length) {
        // stop counting time
        stopTime();
        // present results
        presentWinPopUp();
    }
}
// End of gameplay functionality

// Utilities functionality
// prepare and present results message
function presentWinPopUp() {
    if (confirm(` You won! Congratulations! 
                  You've managed to do it in: TODO time!
                  You've got ${numberOfStars} stars!
                  Do You like to play again?`)) {
        resetBoard();
    } else {
        //do nothing
    }    
}

// measure and display time
function setTime() {
    // increase time by second every second
    timer = setInterval(function() {
        usedTime += 1;
        // calculate minutes and update html
        minutesElement.textContent = Math.floor(usedTime / 60);
        // calculate seconds and update html
        secondsElement.textContent = usedTime % 60;
    },1000);
}

// stop time
function stopTime() {
    clearInterval(timer);
}

function resetTimeInHTML(){
    minutesElement.innerHTML = 0;
    secondsElement.innerHTML = 0;
}

// updates the moves list
function updateMovesList(){
    numberOfMoves += 1;
    movesElement.innerHTML = numberOfMoves;
}

// updates the star rating
function updateStarRating(){
    if (numberOfMoves > 20 && numberOfMoves < 30 ) {
        starsElement.innerHTML =  ` <li><i class="fa fa-star"></i></li>
                                    <li><i class="fa fa-star"></i></li>`;
        numberOfStars = 2;
    } else if (numberOfMoves > 30) {
        starsElement.innerHTML =  ` <li><i class="fa fa-star"></i></li>`;
        numberOfStars = 1;
    }
}
// End of utilities functionality