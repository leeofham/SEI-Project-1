console.log('JS loaded')

// GAME SETTINGS VARIABLES
const section1 = document.querySelector('.grid-one')
const section2 = document.querySelector('.grid-two')
const gameMessage = document.querySelector('.game-message')
const button = document.querySelector('button')
const shipDropDown = document.querySelector('#ship-selection')
const width = 10

const grid1 = []
const grid2 = []

const compShipLength = [5, 4, 3, 3, 2]
const userShipLength = [5, 4, 3, 3, 2]
const computerShotArray = []

let gameInPlay = true
let userShipHorizontal = true
let turn = 0

// column = index % width
// row = Math.floor(index/width)

// CREATE GRID
for(let i = 0; i<width ** 2; i++){
  const grid1Div = document.createElement('div')
  section1.appendChild(grid1Div)
  grid1.push(grid1Div)

  const grid2Div = document.createElement('div')
  section2.appendChild(grid2Div)
  grid2.push(grid2Div)
}

// Clears the game Message
// function clearGameMessage(){
//   gameMessage.innerText = ''
// }
//

// get random orientation;
// gather ship indices into an array
// add no go zone
// check if can lay ship
// lay ship indices onto board

function getShipOrientation(){
  return Math.floor(Math.random() * 2) ? 1 : 10
}

function getShipArray(index, length, orientation){
  const shipIndexes = []
  for(let i = 0; i < length; i++){
    shipIndexes.push(index + (i * orientation))
  }
  return shipIndexes
}

function checkIfCanLayShip(index, length, orientation, grid){
  if(orientation === 1 && width - (index % width) < length) return false
  if(orientation === 10 && width - Math.floor(index/width) <= (width - length)) return false

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
      shipDropDown.value = 10
    })
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

function userPlaceShip(index){
  const length =  userShipLength[shipDropDown.value]
  console.log(userShipLength)
  if(userShipHorizontal){
    layShip(index, length, 1, grid1)
    changeDropDown()
  }else if(!userShipHorizontal){
    layShip(index, length, 10, grid1)
    changeDropDown()
  }
}


function changeDropDown(){
  shipDropDown.options[shipDropDown.selectedIndex].text = 'Already Placed'
}

// HIT OR MISS FUNCTIONS

function hitTotal(userHit){
  let winTotal
  computerShotArray.forEach((number) =>{
    winTotal = winTotal + number
  })
  if(userHit === winTotal) win(userHit)
  else win()
}

function hitCounter(grid){
  let computerHit = 0
  let userHit = 0

  if(grid === grid1){
    computerHit++
    console.log(`This is the comp hit ${computerHit}`)
  } else{
    userHit++
    console.log(`This is the user hit ${userHit}`)
  }
  hitTotal(userHit, computerHit)
}

//
function hitOrMiss(grid, index){
  if(grid[index].classList.contains('ship')){
    grid[index].classList.remove('ship')
    grid[index].classList.add('hit')
    hitCounter(grid)
  } else if (!grid[index].classList.contains('ship') && !grid[index].classList.contains('hit') || grid[index].classList.contains('no-go')) {
    grid[index].classList.remove('no-go')
    grid[index].classList.add('miss')
    grid[index].innerText = 'X'
  }
}

// USER SHOT
//
function userShot(grid, index){
  if((gameInPlay === false) || (grid2[index].classList.contains('miss')) ||
  (grid2[index].classList.contains('hit'))){
    return false
  }
  hitOrMiss(grid2, index)
  turn++
  console.log(`user ${turn} number`)
  computerShotIndex()
}

// COMPUTER FUNCTIONS

// Computer shot functions
function computerShotIndex(){
  const computerShotIndex = Math.floor(Math.random() * 100)
  compTurn(computerShotIndex)
}

function compTurn(computerShotIndex){
  if(turn % 2 === 1){
    if(computerShotArray.includes(computerShotIndex)){
      computerShotIndex()
    } else{
      computerShotArray.push(computerShotIndex)
      turn ++
      console.log(`comp ${turn} number`)
      hitOrMiss(grid1, computerShotIndex)
    }
  }
}

function win(userHit){
  gameInPlay = false
  if(userHit){
    gameMessage.innerText = 'You have won!!'
  } else{
    gameMessage.innerText = 'You lose'
  }
}
//
// function gamePlay(){
//   turn = 0
//   gameInPlay = true
//   placeCompShips()
//   placeShips()
// }
// grab buttons

grid1.forEach((square1, index) => {
  square1.addEventListener('click', () => {
    console.log('clicked')
    userPlaceShip(index)
  })
})

grid2.forEach((square2, index) => {
  square2.addEventListener('click', () => {
    userShot(grid2, index)
  })
})

button.addEventListener('click', () => {
  if(userShipHorizontal){
    userShipHorizontal = false
    button.innerText = 'Vertical'
    console.log(userShipHorizontal)
  } else{
    userShipHorizontal = true
    button.innerText = 'Horizontal'
    console.log(userShipHorizontal)

  }
})
