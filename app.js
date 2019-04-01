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
let compShipCount = 3
let leftToRight = true
let orientation

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
  while(compShipCount > 0){
    generateShip()
    console.log((compShipCount) + ' ship number, ' + randomNum + ' index number, '+ column + ' column number, ' + row + ' row number, ' + horizOrVert + ' 1 = horizontal / 2 = vertical')
    compShipCount--
  }
}

function randomNumber(){
  randomNum = Math.floor(Math.random() * grid2.length)

  column = randomNum % gridWidth

  row = Math.floor(randomNum/gridWidth)
}

function horizontalOrVertical(){
  horizOrVert = Math.round(Math.random() * 2)
  if(horizOrVert === 1){
    orientation = 1
  } else {
    orientation = 10
  }
}

function checkIfPlaceShip(grid, index){
  let coastIsClear = true

  // check ship fits on current row/column
  if((index % gridWidth) + shipLength > gridWidth) {
    return false
  }
  for(let i = 0; i<shipLength; i++){
    if (
      grid[index + (i * orientation)].classList.contains('ship') ||
      grid[index + (i * orientation)].classList.contains('no-go')
    ){
      coastIsClear = false
    }
  }

  return coastIsClear
}

function addNoGoZoneHorizontal() {
  let noGoLength = shipLength + 2
  if(column === 0 || (randomNum + shipLength - 1) % gridWidth === gridWidth - 1) {
    noGoLength = shipLength + 1
  }
  // top line
  for(let i = 0; i<noGoLength; i++) {
    let start = randomNum - 1 - gridWidth
    if(column === 0) start = randomNum - gridWidth
    const cell = grid2[start + (i * orientation)]
    if(cell) cell.classList.add('no-go')
  }
  // bottom line
  for(let i = 0; i<noGoLength; i++) {
    let start = randomNum - 1 + gridWidth
    if(column === 0) start = randomNum + gridWidth
    const cell = grid2[start + (i * orientation)]
    if(cell) cell.classList.add('no-go')
  }
  // left side
  if(column !== 0) grid2[randomNum - 1].classList.add('no-go')
  // right side
  if((randomNum + shipLength - 1) % gridWidth !== gridWidth -1) grid2[randomNum + shipLength].classList.add('no-go')
}

function addNoGoZoneVertical() {
  let noGoLength = shipLength + 2
  if(row === 0 || (randomNum + shipLength - 1) % gridHeight === gridHeight - 1) {
    noGoLength = shipLength + 1
  }

  // left line
  for(let i = 0; i<noGoLength; i++) {
    let start = randomNum - 1 - gridHeight
    if(column === 0) start = randomNum - gridWidth
    const cell = grid2[start + (i * orientation)]
    if(cell) cell.classList.add('no-go')
  }
}

function generateShip(){
  randomNumber()
  horizontalOrVertical()

  if(checkIfPlaceShip(grid2, randomNum)){
    // ship
    for(let i = 0; i < shipLength; i++){
      grid2[randomNum + (i * orientation)].classList.add('ship')
    }

    if(orientation === 1) addNoGoZoneHorizontal()
    else addNoGoZoneVertical()
  } else {
    generateShip()
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
  if((gameInPlay === false) || (grid2[index].classList.contains('miss')) ||
  (grid2[index].classList.contains('hit'))){
    return false
  }
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
  } else if (!grid[index].classList.contains('ship') && !grid[index].classList.contains('hit') || grid[index].classList.contains('no-go')) {
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
