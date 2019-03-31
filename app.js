console.log('JS loaded')

const section1 = document.querySelector('.grid-one')
const section2 = document.querySelector('.grid-two')
const gameMessage = document.querySelector('.game-message')
const button = document.querySelector('button')

const gridWidth = 10
const gridHeight = 10
const shipLength = 3
// const numShips = 5
const compShotArray = []

let turn = 0
let compShot
let noGoTopLeft
let noGoLeft
let noGoRight
let noGoBottomLeft
let noGoTopRight
let noGoTopMid
let noGoBottomMid
let noGoLength
let grid1Divs
let grid2Divs
let randomNum
let column
let row
let horizOrVert
let userHit = 0
let compHit = 0
let gameInPlay = true
let shipCount = 0
let compShipCount = 0
let leftToRight = true

// CREATE GRID

for(let i = 0; i<100; i++){
  grid1Divs = document.createElement('div')
  section1.appendChild(grid1Divs)

  grid2Divs = document.createElement('div')
  section2.appendChild(grid2Divs)
}

const grid1 = section1.querySelectorAll('div')
const grid2 = section2.querySelectorAll('div')

// COMPUTER FUNCTIONS

function compShotGener(){
  compShot = Math.floor(Math.random() * 100)
  compTurn()
}

function compTurn(){
  if(turn % 2 === 1){
    if(compShotArray.includes(compShot)){
      compShotGener()
    } else{
      compShotArray.push(compShot)
      turn ++
      hitOrMiss(grid1, compShot)
    }
  }
}

function placeCompShips(){
  // while(compShipCount < 3){
    randomNumber()
    horizontalOrVertical()
    console.log((randomNum + 1) + ' ship number, ' + randomNum + ' index number, '+ column + ' column number, ' + row + ' row number, ' + horizOrVert + ' 1 = horizontal / 2 = vertical')
    // compShipCount++
  // }
}

function randomNumber(){
  randomNum = 0
  // Math.floor(Math.random() * grid2.length)

  column = randomNum % gridWidth

  row = Math.floor(randomNum/gridWidth)
}

function horizontalOrVertical(){
  horizOrVert = 2
  // Math.ceil(Math.random() * 2)

  if(horizOrVert === 1){
    generateShipHorizontal()
  } else {
    generateShipVertically()
  }
}

function generateShipHorizontal(){
  while((gridWidth - column) < shipLength){
    placeCompShips()
  }
  for(let i = 0; i < shipLength; i++){
    grid2[randomNum + (i)].classList.add('ship')
    // noGoZoneHorizontal()
  }
}

function generateShipVertically(){
  while((gridHeight - row) < shipLength) {
    placeCompShips()
  }
  noGoZoneVertical()
  for(let i = 0; i < shipLength; i++){
    grid2[randomNum + (i * 10)].classList.add('ship')
  }
}

function noGoZoneHorizontal(){
  noGoLength = shipLength + 2

  noGoTopLeft = (randomNum - gridWidth - 1)
  noGoBottomLeft = (randomNum + gridWidth - 1)
  noGoLeft = randomNum - 1
  noGoRight = randomNum + shipLength

  // top left corner
  if(randomNum === 0){
    noGoLength -= 1
    noGoBottomLeft = randomNum + gridWidth

    grid2[noGoRight].classList.add('no-go')

    for(let i=0; i < noGoLength; i++){
      grid2[noGoBottomLeft + i].classList.add('no-go')
    }
    // bottom left corner
  } else if(randomNum === 90){
    noGoLength -= 1
    noGoTopLeft = (randomNum - gridWidth)

    grid2[noGoRight].classList.add('no-go')

    for(let i=0; i < noGoLength; i++){
      grid2[noGoTopLeft + i].classList.add('no-go')
    }
    // top right corner
  } else if(randomNum === 7){
    noGoLength -= 1
    noGoBottomLeft = (randomNum + gridWidth - 1)
    grid2[noGoLeft].classList.add('no-go')

    for(let i=0; i < noGoLength; i++){
      grid2[noGoBottomLeft + i].classList.add('no-go')
    }
    // bottom right corner
  } else if(randomNum === 97){
    noGoLength -= 1
    noGoTopLeft = randomNum - gridWidth - 1
    grid2[noGoLeft].classList.add('no-go')

    for(let i=0; i < noGoLength; i++){
      grid2[noGoTopLeft + i].classList.add('no-go')
    }
  // left hand side no go zone
  } else if(randomNum % gridWidth === 0){
    noGoLength--
    noGoTopLeft = randomNum - gridWidth
    noGoBottomLeft = randomNum + gridWidth
    grid2[noGoRight].classList.add('no-go')

    for(let i=0; i < noGoLength; i++){
      grid2[noGoTopLeft + i].classList.add('no-go')
      grid2[noGoBottomLeft + i].classList.add('no-go')
    }
  //   // right hand side no zone
  } else if(noGoTopLeft % gridWidth === gridWidth - (shipLength + 1)){
    noGoLength -= 1
    grid2[noGoLeft].classList.add('no-go')

    for(let i=0; i < noGoLength; i++){
      grid2[noGoTopLeft + i].classList.add('no-go')
      grid2[noGoBottomLeft + i].classList.add('no-go')
    }
    // bottom no go zone
  } else if(noGoLeft > 90) {
    grid2[noGoRight].classList.add('no-go')
    grid2[noGoLeft].classList.add('no-go')

    for(let i=0; i < noGoLength; i++){
      grid2[noGoTopLeft + i].classList.add('no-go')
    }
    // top no go zone
  } else if(noGoRight < 10) {
    grid2[noGoRight].classList.add('no-go')
    grid2[noGoLeft].classList.add('no-go')

    for(let i=0; i < noGoLength; i++){
      grid2[noGoBottomLeft + i].classList.add('no-go')
    }
  } else{
    grid2[noGoRight].classList.add('no-go')
    grid2[noGoLeft].classList.add('no-go')
    for(let i=0; i < noGoLength; i++){
      grid2[noGoTopLeft + i].classList.add('no-go')
      grid2[noGoBottomLeft + i].classList.add('no-go')
    }
  }
}

function noGoZoneVertical(){
  noGoLength = (shipLength + 2)

  noGoTopLeft = (randomNum - gridWidth - 1)
  noGoTopRight = (randomNum - gridWidth + 1)
  noGoTopMid = randomNum - gridWidth
  noGoBottomMid = (randomNum + (shipLength * 10))
  noGoRight = randomNum + shipLength

  // TOP LEFT
  if(randomNum === 0){
    noGoLength = (shipLength + 1)
    noGoTopRight = randomNum + 1

    grid2[noGoBottomMid].classList.add('no-go')

    for(let i=0; i < noGoLength; i++){
      grid2[noGoTopRight + (i * 10)].classList.add('no-go')
    }
    // bottom left corner
  }
}

// USER FUNCTIONS

function placeUserShipHorizontal(grid, index){
  if((leftToRight) && ((index % gridWidth) < 8)){
    for(let i = 0; i< shipLength; i++){
      grid1[index + i].classList.add('ship')
    }
    clearGameMessage()
    shipCount++
  } else {
    gameMessage.innerText = 'Place ship again, incorrect space.'
  }
  userShipCount(shipCount)
}

function placeUserShipVertical(grid, index){
  if(!leftToRight && (Math.floor(index/gridWidth) < 8)){
    for(let i = 0; i< shipLength; i++){
      grid1[index + (i * 10)].classList.add('ship')
    }
    clearGameMessage()
    shipCount++
  } else {
    gameMessage.innerText = 'Place ship again, incorrect space.'
  }
  userShipCount(shipCount)
}

function userShipCount(shipCount){
  if(shipCount === 3){
    userTurn()
    gameMessage.innerText = 'Take your shot'
  }
}

function clearGameMessage(){
  gameMessage.innerText = ''
}

function userShot(grid, index){
  if(gameInPlay === false || grid2[index].classList.contains('miss')) return false
  console.log('clicked', index)
  console.log('row' + Math.floor(index/gridWidth))
  hitOrMiss(grid2, index)
  turn++
  console.log(`user ${turn} number`)
  compShotGener()
}

function hitCounter(grid){
  compShipCount = 3
  shipCount = 3

  if(grid === grid1){
    compHit++
    console.log(`This is the comp hit ${compHit}`)
  } else{
    userHit++
    console.log(`This is the user hit ${userHit}`)
  }
  if((userHit === (compShipCount * shipLength)) || (compHit === (shipCount * shipLength))){
    win()
  }
}

function hitOrMiss(grid, index){
  if(grid[index].classList.contains('ship')){
    grid[index].classList.remove('ship')
    grid[index].classList.add('hit')
    hitCounter(grid)
  } else if (!grid[index].classList.contains('ship') && !grid[index].classList.contains('hit') ||     grid[index].classList.contains('no-go')) {
    grid[index].classList.remove('no-go')
    grid[index].classList.add('miss')
    grid[index].innerText = 'X'
  }
}

function win(){
  gameInPlay = false
  if(userHit === (compShipCount * shipLength)){
    gameMessage.innerText = 'You have won!!'
  } else{
    gameMessage.innerText = 'You lose'
  }
}

function gamePlay(){
  turn = 0
  gameInPlay = true
  placeCompShips()
  placeShips()
}
// grab buttons
function placeShips(){
  grid1.forEach((square1, index) => {
    square1.addEventListener('click', () => {
      console.log('clicked', index)
      if(shipCount === 3){
        return false
      } else if(leftToRight){
        placeUserShipHorizontal(grid1, index)
      } else{
        placeUserShipVertical(grid1, index)
      }
    })
  })
}

function userTurn(){
  grid2.forEach((square2, index) => {
    square2.addEventListener('click', () => {
      userShot(grid2, index)
    })
  })
}

button.addEventListener('click', () => {
  if(leftToRight){
    leftToRight = false
    button.innerText = 'Vertical'
  } else{
    leftToRight = true
    button.innerText = 'Horizontal'
  }
})

gamePlay()
