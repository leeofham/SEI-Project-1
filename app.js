console.log('JS loaded')

// GAME SETTINGS VARIABLES
const section1 = document.querySelector('.grid-one')
const section2 = document.querySelector('.grid-two')
const gameMessage = document.querySelector('.game-message')
const button = document.querySelector('.orientation-button')
const shipButton = document.querySelectorAll('.ship-button')
const selectedShip = document.querySelector('.selected-ship')
const width = 10

const grid1 = []
const grid2 = []

const shipLocations = []
const compShipLength = [5, 4, 3, 3, 2]
const userShipLength = [5, 4, 3, 3, 2]
const computerShotArray = []

let gameInPlay
let userShipHorizontal = true
let turn = 0
let length
let userOrientation
let userHit = 0
let computerHit = 0

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
  const shipIndexes = []
  for(let i = 0; i < length; i++){
    shipIndexes.push(index + (i * orientation))
  }
  shipLocations.push(shipIndexes)
  return shipIndexes
}

function checkIfCanLayShip(index, length, orientation, grid){
  if(orientation === 1 && width - (index % width) < length) return false
  if(orientation === 10 && width - Math.floor(index/width) < length){
    console.log('this is failing')
    return false
  }

  // loop through and check that all the squares do not contain ship or no-go
  for(let i = 0; i<length; i++) {
    if(grid[index + (i * orientation)].classList.contains('ship') ||
    grid[index + (i * orientation)].classList.contains('no-go')) return false
  }
  console.log('check if can lay ship = true')
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
compShipLength.forEach((length) => {
  layShip(Math.floor(Math.random() * width ** 2), length, getShipOrientation(), grid2)
})

// lay player ships
function userPlaceShip(index){
  if(!userShipLength.includes(length)) return false
  if(!userShipHorizontal) userOrientation = 10
  else userOrientation = 1
  layShip(index, length, userOrientation, grid1)
}

function removeFromArray(length){
  const indexOf = userShipLength.indexOf(length)
  userShipLength.splice(indexOf, 1)
  length = 0
  if(userShipLength.length === 0){
    gameInPlay = true
  }
}

// HIT OR MISS FUNCTIONS

function hitCounter(grid){
  const total = 17
  if(grid === grid1){
    computerHit = computerHit + 1
  } else{
    userHit = userHit + 1
  }
  if(userHit === total) win(userHit)
  else if(computerHit === total) lose()
}

//
function hitOrMiss(grid, index){
  if(grid[index].classList.contains('ship')){
    grid[index].classList.remove('ship')
    grid[index].classList.add('hit')
    checkIfDestroyed(grid, index)
    hitCounter(grid)
  } else if (!grid[index].classList.contains('ship') && !grid[index].classList.contains('hit') || grid[index].classList.contains('no-go')) {
    grid[index].classList.remove('no-go')
    grid[index].classList.add('miss')
    grid[index].innerText = 'X'
  }
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
  for (row; row < length ; row ++) {
    for (let col = 0; col< shipLocations[row].length; col++) {
      if (shipLocations[row][col] === index) {
        shipLocations[row].splice(col, 1)
        console.log(shipLocations)
        updateIfDestroyed(row)
      }
    }
  }
}

function updateIfDestroyed(row){
  if(shipLocations[row].length === 0){
    gameMessage.innerText = 'Ship Destroyed!'
  } else {
    gameMessage.innerText = ''
  }
}


// USER SHOT
function userShot(grid, index){
  if((gameInPlay === false) || (grid2[index].classList.contains('miss')) ||
  (grid2[index].classList.contains('hit'))){
    return false
  }
  hitOrMiss(grid2, index)
  turn++
  computerShotIndex()
}

// COMPUTER FUNCTIONS
// Computer shot functions
function computerShotIndex(){
  const compShotIndex = Math.floor(Math.random() * 100)
  compTurn(compShotIndex)
}

function compTurn(compShotIndex){
  if(turn % 2 === 1){
    if(computerShotArray.includes(compShotIndex)){
      computerShotIndex()
    } else{
      computerShotArray.push(compShotIndex)
      turn ++
      hitOrMiss(grid1, compShotIndex)
    }
  }
}

// win or lose

function win(){
  gameInPlay = false
  gameMessage.innerText = 'You have won!!'
}

function lose(){
  gameInPlay = false
  gameMessage.innerText = 'You have lost!!'
}

// grab buttons

grid1.forEach((square1, index) => {
  square1.addEventListener('click', () => {
    userPlaceShip(index)
  })
})

grid2.forEach((square2, index) => {
  square2.addEventListener('click', () => {
    if(gameInPlay)userShot(grid2, index)
  })
})

button.addEventListener('click', () => {
  if(userShipHorizontal){
    userShipHorizontal = false
    button.innerText = 'Vertical'
  } else{
    userShipHorizontal = true
    button.innerText = 'Horizontal'
  }
})

shipButton.forEach(shipButton => {
  shipButton.addEventListener('click', (e) => {
    length = parseInt(e.target.value)
    console.log(length)
    selectedShip.innerText = shipButton.innerText
  })
})
