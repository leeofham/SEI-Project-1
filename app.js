console.log('JS loaded')

// GAME SETTINGS VARIABLES
const section1 = document.querySelector('.grid-one')
const section2 = document.querySelector('.grid-two')
const gameMessage = document.querySelector('.game-message')
const button = document.querySelector('.orientation-button')
const shipButton = document.querySelectorAll('.ship-button')
const selectedShip = document.querySelector('.selected-ship')
const shipList = document.querySelector('.ship-list')
const winLoseMessage = document.querySelector('.win-lose-message')
const winLoseButton = document.querySelector('.win-lose-reset')
const width = 10

// Audio
const oof = new Audio('sounds/Roblox-death-sound.mp3')
const bang = new Audio('sounds/Explosion.mp3')
const winAudio = new Audio('sounds/Oh-yeah-sound-effect.mp3')
const giggity = new Audio('sounds/giggity.mp3')
const loseAudio = new Audio('sounds/Sad-trombone.mp3')

// Grids
const grid1 = []
const grid2 = []

let shipLocations = []
const computerShotArray = []

const compShipLength = [5, 4, 3, 3, 2]
let userShipLength = [5, 4, 3, 3, 2]
let shipIndexes
let computerHitArray = []
let possibleLocations = [-width, -1, 1, width]
let gameInPlay
let userShipHorizontal = true
let length
let userOrientation = 1
let userHit = 0
let computerHit = 0
let lastCompShotHit = false
let compShotIndex
let lastHit

// CREATE GRID
for(let i = 0; i<width ** 2; i++){
  const grid1Div = document.createElement('div')
  section1.appendChild(grid1Div)
  grid1.push(grid1Div)

  const grid2Div = document.createElement('div')
  section2.appendChild(grid2Div)
  grid2.push(grid2Div)
}

function getShipOrientation(){
  return Math.floor(Math.random() * 2) ? 1 : 10
}

function getShipArray(index, length, orientation){
  shipIndexes = []
  for(let i = 0; i < length; i++){
    shipIndexes.push(index + (i * orientation))
  }
  shipLocations.push(shipIndexes)
  return shipIndexes
}

function checkIfCanLayShip(index, length, orientation, grid){
  if(orientation === 1 && width - (index % width) < length) return false
  if(orientation === 10 && width - Math.floor(index/width) < length)return false

  // loop through and check that all the squares do not contain ship or no-go
  for(let i = 0; i<length; i++) {
    if(grid[index + (i * orientation)].classList.contains('ship') ||
    grid[index + (i * orientation)].classList.contains('no-go')) return false
  }
  return true
}

// get the no go zone indexes
function getNoGoIndexes(shipIndexes, grid) {
  const noGoZoneIndexes = []
  shipIndexes.forEach(shipIndex => {
    // left
    if(shipIndex % width > 0 && !shipIndexes.includes(shipIndex - 1)) noGoZoneIndexes.push(shipIndex - 1)
    // right
    if(shipIndex % width < width - 1 && !shipIndexes.includes(shipIndex + 1)) noGoZoneIndexes.push(shipIndex + 1)
    // top
    if(Math.floor(shipIndex/width) > 0 && !shipIndexes.includes(shipIndex - width)) noGoZoneIndexes.push(shipIndex - width)
    // bottom
    if(Math.floor(shipIndex/width) < width - 1 && !shipIndexes.includes(shipIndex + width)) noGoZoneIndexes.push(shipIndex + width)

    // top left
    if(
      shipIndex % width > 0 && Math.floor(shipIndex/width) > 0 &&
      !noGoZoneIndexes.includes(shipIndex - width - 1)
    ) {
      noGoZoneIndexes.push(shipIndex - width - 1)
    }
    // top right
    if(
      shipIndex % width < width - 1 && Math.floor(shipIndex/width) > 0 &&
      !noGoZoneIndexes.includes(shipIndex - width + 1)
    ) {
      noGoZoneIndexes.push(shipIndex - width + 1)
    }
    // bottom left
    if(
      shipIndex % width > 0 && Math.floor(shipIndex/width) < width - 1 &&
      !noGoZoneIndexes.includes(shipIndex + width - 1)
    ) {
      noGoZoneIndexes.push(shipIndex + width - 1)
    }
    // bottom right
    if(
      shipIndex % width < width - 1 && Math.floor(shipIndex/width) < width - 1&&
      !noGoZoneIndexes.includes(shipIndex + width + 1)
    ) {
      noGoZoneIndexes.push(shipIndex + width + 1)
    }
  })

  noGoZoneIndexes.forEach(index => grid[index].classList.add('no-go'))

  return noGoZoneIndexes
}

function layShip(index, length, orientation, grid){
  if(checkIfCanLayShip(index, length, orientation, grid)){
    const shipIndexes = getShipArray(index, length, orientation)
    getNoGoIndexes(shipIndexes, grid)
    shipIndexes.forEach((ship) => {
      grid[ship].classList.add('ship')
    })
    if(grid === grid1){
      removeFromArray(length)
    }
  } else if (grid === grid2){
    layShip(Math.floor(Math.random() * width ** 2), length, getShipOrientation(), grid)
  } else{
    gameMessage.innerText = 'Please select a correct position or ship you haven\'t used!'
    return false
  }
}
// Lay computer ships
gameMessage.innerText = 'Place your ships to begin!'

function generateComputerShips(){
  compShipLength.forEach((length) => {
    layShip(Math.floor(Math.random() * width ** 2), length, getShipOrientation(), grid2)
  })
}

function hideThingsOnStart(){
  section2.classList.toggle('hide')
  shipList.classList.toggle('hide')
  button.classList.toggle('hide')
}
// lay player ships
function userPlaceShip(index){
  if(!userShipLength.includes(length)){
    gameMessage.innerText = 'Select a valid ship or space to continue!'
    return false
  }
  gameMessage.innerText = 'Place your ships to begin!'
  layShip(index, length, userOrientation, grid1)
}

function removeFromArray(length){
  const indexOf = userShipLength.indexOf(length)
  userShipLength.splice(indexOf, 1)
  length = 0
  if(userShipLength.length === 0){
    hideThingsOnStart()
    gameMessage.innerText = 'Take a shot!'
    gameInPlay = true
  }
}
// HIT OR MISS FUNCTIONS
function hitCounter(grid){
  const total = 17
  if(grid === grid1) computerHit = computerHit + 1
  else userHit = userHit + 1

  if(userHit === total) win(userHit)
  else if(computerHit === total) lose()
}

function hitOrMiss(grid, index){
  if(grid[index].classList.contains('ship')){
    hit(grid, index)
    hitSounds()
    checkIfDestroyed(grid, index)
    hitCounter(grid)
  } else if (!grid[index].classList.contains('ship') && !grid[index].classList.contains('hit') || grid[index].classList.contains('no-go')) {
    miss(grid, index)
  }
}

function hitSounds(){
  bang.pause()
  bang.currentTime = 0
  bang.play()
}

function hit(grid, index){
  grid[index].classList.remove('ship')
  grid[index].classList.add('hit')
  if(grid === grid1) {
    lastCompShotHit = true
    lastHit = index
    computerHitArray.push(index)
    console.log(computerHitArray)
    resetPossibleLocations()
  }
}

function miss(grid, index){
  grid[index].classList.remove('no-go')
  grid[index].classList.add('miss')
  grid[index].innerText = 'X'
}

function checkIfDestroyed(grid, index){
  let row = 0
  let length = 0
  if(grid === grid1){
    row = 5
    length = 10
  } else{
    row = 0
    length = 5
  }
  searchShipArrays(grid, index, row, length)
}

function searchShipArrays(grid, index, row, length){
  for (row; row < length ; row ++) {
    for (let col = 0; col< shipLocations[row].length; col++) {
      if (shipLocations[row][col] === index) {
        shipLocations[row].splice(col, 1)
        updateIfDestroyed(row)
      }
    }
  }
}

function updateIfDestroyed(row){
  if(shipLocations[row].length === 0){
    gameMessage.innerText = 'Ship Destroyed!'
    lastCompShotHit = false
    computerHitArray = []
    bang.pause()
    oof.play()
  } else {
    gameMessage.innerText = ''
  }
}

function shipHover(grid1, index){
  let shipHover
  for(let i = 0; i<length; i++){
    shipHover = grid1[index + (i*userOrientation)]
    if(checkIfCanLayShip(index, length, userOrientation, grid1)){
      shipHover.classList.add('hover')
    }
  }
}

function shipMouseLeave(grid1, index){
  let shipHover
  for(let i = 0; i<length; i++){
    shipHover = grid1[index + (i*userOrientation)]
    if(checkIfCanLayShip(index, length, userOrientation, grid1)){
      shipHover.classList.remove('hover')
    }
  }
}

// USER SHOT
function userShot(grid, index){
  if((gameInPlay === false) || (grid2[index].classList.contains('miss')) ||
  (grid2[index].classList.contains('hit'))){
    return false
  }
  hitOrMiss(grid2, index)
  computerShotIndex()
}

// COMPUTER FUNCTIONS
// Computer shot functions

function computerShotIndex(){
  if(lastCompShotHit) estimatedGuess()
  else{
    compShotIndex = Math.floor(Math.random() * 100)
    compTurn(compShotIndex)
  }
}

function compTurn(compShotIndex){
  if(computerShotArray.includes(compShotIndex)){
    computerShotIndex()
  } else{
    computerShotArray.push(compShotIndex)
    hitOrMiss(grid1, compShotIndex)
  }
}

function estimatedGuess(){
  if(lastHit === 0) possibleLocations = [1, width]
  else if(lastHit === 9) possibleLocations = [-1, width]
  else if(lastHit === 90) possibleLocations = [-width, 1]
  else if(lastHit === 99) possibleLocations = [-width, -1]
  else if(lastHit > 90 && lastHit < 99) possibleLocations = [-width, -1, 1]
  else if(lastHit > 0 && lastHit < 9) possibleLocations = [-1, 1, width]

  const possibleLocationsIndex = Math.floor(Math.random() * possibleLocations.length)
  const nextShot = lastHit + possibleLocations[possibleLocationsIndex]

  if(possibleLocations.length === 0 || computerShotArray.includes(nextShot)){
    lastCompShotHit = false
    computerHitArray = []
    computerShotIndex()
  } else{
    possibleLocations.splice(possibleLocationsIndex, 1)
    compTurn(nextShot)
  }
}

function resetPossibleLocations(){
  possibleLocations = [-width, -1, 1, width]
}

function hideThingsOnWin(){
  section1.classList.toggle('hide')
  section2.classList.toggle('hide')
  gameMessage.classList.toggle('hide')
  winLoseButton.classList.toggle('hide')
  winLoseMessage.classList.toggle('hide')
}

function winSpecialEffects(){
  setTimeout(() => {
    giggity.play()
  }, 500)
  setTimeout(() => {
    winAudio.play()
  }, 1400)

}

function win(){
  gameInPlay = false
  hideThingsOnWin()
  winSpecialEffects()
  winLoseMessage.innerText = 'You have won!!'
}

function lose(){
  gameInPlay = false
  hideThingsOnWin()
  winLoseMessage.innerText = 'You have lost!!'
  loseAudio.play()
}

// grab buttons
grid1.forEach((square1, index) => {
  square1.addEventListener('click', () => {
    userPlaceShip(index)
  })
  square1.addEventListener('mouseover', () =>{
    if(!gameInPlay) shipHover(grid1, index)
  })
  square1.addEventListener('mouseout', () =>{
    if(!gameInPlay) shipMouseLeave(grid1, index)
  })
})

grid2.forEach((square2, index) => {
  square2.addEventListener('click', () => {
    if(gameInPlay)userShot(grid2, index)
  })
})

function clearGrid(){
  for(let i = 0; i < 100; i++){
    grid1[i].classList.remove('ship')
    grid2[i].classList.remove('ship')
    grid1[i].classList.remove('hit')
    grid2[i].classList.remove('hit')
    grid1[i].classList.remove('miss')
    grid2[i].classList.remove('miss')
    grid1[i].classList.remove('no-go')
    grid2[i].classList.remove('no-go')
    grid1[i].classList.remove('hover')
    grid1[i].innerText = ''
    grid2[i].innerText = ''
  }
}

function reset(){
  gameInPlay = false
  clearGrid()
  hideThingsOnWin()
  hideThingsOnStart()
  winLoseMessage.classList.add('hide')
  shipIndexes = []
  shipLocations = []
  userShipLength = [5, 4, 3, 3, 2]
  userHit = 0
  computerHit = 0
  generateComputerShips()
}

button.addEventListener('click', () => {
  if(userShipHorizontal){
    userShipHorizontal = false
    userOrientation = 10
    button.innerHTML = '<i class="fas fa-arrows-alt-v"></i> <br> Vertical'
  } else{
    userShipHorizontal = true
    userOrientation = 1
    button.innerHTML= '<i class="fas fa-arrows-alt-h"></i> <br> Horizontal'
  }
})

function placedShipButton(shipButton){
  const placedShipButton = parseInt(shipButton.value)
  if(!userShipLength.includes(placedShipButton)){
    shipButton.innerText = 'Already picked!'
    shipButton.style.color = '#ffe400'
    shipButton.disabled = 'true'
  }
}

shipButton.forEach(shipButton => {
  shipButton.addEventListener('click', (e) => {
    placedShipButton(shipButton)
    length = parseInt(e.target.value)
    selectedShip.innerText = shipButton.innerText
  })
})

winLoseButton.addEventListener('click', () => {
  reset()
})
generateComputerShips()
