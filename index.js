// VARIABLE DECLARATION
const gameInstructionIcon = document.querySelector('.info');
const gameInstructionContainer = document.querySelector('.instruction-container');
const instruction = document.querySelector('.instruction');
const targetBox = document.querySelector('.target-box');
const guessColors = document.querySelectorAll('.color');
const colorGuessContainer = document.querySelector('.color-grid');
const winMessage = document.querySelector('.win');
const loseMessage = document.querySelector('.lose');
const scoreCounter = document.querySelector('.counter');
const resetScore = document.querySelector('.reset');
const colorContainer = document.querySelector('.color-container');
const chances = document.querySelector('.chance');
const newGame = document.querySelector('.restart');
const gameOverContainer = document.querySelector('.game-over');

let TabOpen = false;


// EVENT LISTENERS

// load instruction
window.addEventListener('load',(e)=>{
  gameInstructionContainer.classList.add('display-instruction');
  instruction.classList.add('open');
  instruction.classList.remove('close');
  TabOpen = true;
});
// Displaying the game instructions
gameInstructionIcon.addEventListener('click', () => {
  gameInstructionContainer.classList.add('display-instruction');
  instruction.classList.add('open');
  instruction.classList.remove('close');
  TabOpen = true;
});


// Hiding the game instructions
gameInstructionContainer.addEventListener('click', (e) => {
  const { target } = e;
  if (target.classList.contains('remove')) {
    if (TabOpen) {
      instruction.classList.remove('open');
      instruction.classList.add('close');
      instruction.addEventListener('animationend', () => {
        gameInstructionContainer.classList.remove('display-instruction');
      }, { once: true });
      TabOpen = false;
    }
  }
});

// Function for Target color generation
let randomTargetColor;
const targetColorGeneration = () => {
  targetBox.classList.remove(`${randomTargetColor}-bg`);
  guessColors.forEach((btn, index) => {
    btn.classList.remove(`${randomTargetColor}-shade-${index + 1}`);
  });

  const targetColorArray = ['target1', 'target2', 'target3', 'target4', 'target5', 'target6'];
  randomTargetColor = targetColorArray[Math.floor(Math.random() * targetColorArray.length)];

  // Set the background color for the target box
  targetBox.classList.add(`${randomTargetColor}-bg`); // target3-bg

  // Set the shades for the guess buttons
  guessColors.forEach((btn, index) => {
    btn.classList.add(`${randomTargetColor}-shade-${index + 1}`); 
    btn.classList.add('color-change');
    btn.addEventListener('animationend', ()=>{
      btn.classList.remove('color-change');
    });
    // target3-shade-1 | target3-shade-2
  });
  targetBox.classList.add('color-change');
  targetBox.addEventListener('animationend', ()=>{
    targetBox.classList.remove('color-change');
  });
};

let score = Number(localStorage.getItem('score')) || 0;
scoreCounter.innerText = score;
let life = JSON.parse(localStorage.getItem('life')) ||['💎','💎','💎','💎','💎'];
chances.innerHTML = `Energy: ${life.join('')}`;
// User color guess function
let animationRunning = false;
let isAnimationInProgress = false;
function guess() {
   targetColorGeneration();
  colorGuessContainer.addEventListener('click', (e) => {
    const { target } = e;
    if (isAnimationInProgress) return;
    if(window.getComputedStyle(target).backgroundColor  === window.getComputedStyle(targetBox).backgroundColor){
      score = Number(scoreCounter.textContent);
      scoreCounter.innerText = `${score += 1}`;
      if (!animationRunning) {
        animationRunning = true;
        isAnimationInProgress = true; 
        winMessage.classList.add('win-active');
        winMessage.classList.add('notification-in');
        setTimeout(() => {
          winMessage.classList.add('notification-out');
          winMessage.addEventListener('animationend', () => {
            winMessage.classList.remove('win-active');
            winMessage.classList.remove('notification-in');
            winMessage.classList.remove('notification-out');
            
            animationRunning = false;
            isAnimationInProgress = false;
          }, { once: true });
        }, 1500);
      }
      
      setTimeout (()=>{
        targetColorGeneration();
      },1500);
    }else{
      if (life.length > 0 && !animationRunning) {
        animationRunning = true;
        isAnimationInProgress = true; 
        loseMessage.classList.add('lose-active');
        loseMessage.classList.add('notification-in');
        setTimeout(() => {
          loseMessage.classList.add('notification-out');
          loseMessage.addEventListener('animationend', () => {
            loseMessage.classList.remove('lose-active');
            loseMessage.classList.remove('notification-in');
            loseMessage.classList.remove('notification-out');
            animationRunning = false;
            isAnimationInProgress = false;
            if(life.length === 0){
              gameOver();
              console.log('game over');
            }
          }, { once: true });
        }, 1500);
      }
      life.splice(life.indexOf('💎'),1);
      chances.innerHTML = `Energy: ${life.join('')}`;
      saveRemainingLife();
    
    }
    
    saveScore();
  });

}
targetColorGeneration();
guess();
saveScore();
saveRemainingLife();

// Local storage
function saveScore() {
  localStorage.setItem('score', score);
}



function saveRemainingLife() {
  localStorage.setItem('life', JSON.stringify(life));
}


// reseting the game
resetScore.addEventListener('click', ()=>{
  localStorage.clear();
  score = 0;
  scoreCounter.textContent = score;
  life = ['💎','💎','💎','💎','💎'];
  chances.innerHTML = `Energy: ${life.join('')}`;
  saveRemainingLife();
});
  
// gameOver
function gameOver() {
  gameOverContainer.classList.add('open');
  gameOverContainer.classList.add('game-over-active');
}

// New game

newGame.addEventListener('click', ()=>{
  gameOverContainer.classList.remove('open');
  gameOverContainer.classList.add('close');
  gameOverContainer.addEventListener('animationend', ()=>{
    gameOverContainer.classList.remove('game-over-active');
  });
  score = 0;
  scoreCounter.textContent = score;
  life = ['💎','💎','💎','💎','💎'];
  chances.innerHTML = `Energy: ${life.join('')}`;
  saveRemainingLife();
});

