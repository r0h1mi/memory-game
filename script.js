// Global Constants
const clueHoldTime = 333; //how long to each clue's light /sound
const cluePauseTime = 222; //how long to pause in between clues
const nextClueWaitTime = 500; //how long to wait before starting playback of the clue sequence

// Global Variables
  //keeps track of the secret pattern of button presses
var pattern = [2, 2, 4, 3, 2, 1 , 2, 4]; 
  //an int that rep how far along the player is in guessing the pattern
var progress = 0;
  // a bool to keep track if game is active -> start button active? true:false
var gamePlaying = false;
  //keep track of whether there is a tone is playing or not
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
  //keeps track of where the user is in the clue sequence
var guessCounter = 0;


function startGame(){
  //initialize the game variables
  progress = 0;
  gamePlaying = true;
  
  // swap hidden Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");

  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  // Game Logic
  //if guess correct then check if turn over then check if last turn then win game 
  //if guess correct ELSE game over, if yes, but turn not over, increment guessCounter, if turn over, but not last turn, increment progress, play next clue
  if(pattern[guessCounter] == btn){
    //Guess was correct! --> check if turn is over
    if(guessCounter == progress){
      //check if it's last turn
      if(progress == pattern.length - 1){
        //WIN!!!
        winGame();
      }else{
        //play next clue, increment progress
        progress++;
        playClueSequence();
      }
    }else{
      //increment guesscounter
      guessCounter++;
    }
  }else{
    //Guess was incorrect AKA LOSE!!
    loseGame();
  }
} 

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Yay! You won :)");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)


