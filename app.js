console.log('JS loaded')

const section1 = document.querySelector('.grid-one')
const section2 = document.querySelector('.grid-two')
const gridWidth = 10
const gridHeight = 10
const shipLength = 3
// const numShips = 5
let noGoTopLeft
let noGoLeft
let noGoRight
let noGoBottomLeft
let noGoLength
let grid1Divs
let grid2Divs
let randomNum
let column
let row
let horizOrVert
let turn
let compShot
const compShotArray = []

for(let i = 0; i<100; i++){
  grid1Divs = document.createElement('div')
  section1.appendChild(grid1Divs)

  grid2Divs = document.createElement('div')
  section2.appendChild(grid2Divs)
}

const grid1 = section1.querySelectorAll('div')
const grid2 = section2.querySelectorAll('div')

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
      console.log(`comp ${turn} number`)
      console.log(`comp shot = ${compShot} and the array = ${compShotArray}`)
      hitOrMiss(grid1, compShot)
    }
  }
}

function placeCompShips(){
  randomNumber()
  horizontalOrVertical()
  console.log((randomNum + 1) + ' ship number, ' + randomNum + ' index number, '+ column + ' column number, ' + row + ' row number, ' + horizOrVert + ' 1 = horizontal / 2 = vertical')
}

function randomNumber(){
  randomNum = Math.floor(Math.random() * grid2.length)

  column = randomNum % gridWidth

  row = Math.floor(randomNum/gridWidth)
}

function horizontalOrVertical(){
  horizOrVert = 1
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
}

function generateShipVertically(){
  while((gridHeight - row) < shipLength) {
    placeCompShips()
  }

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

grid1[8].classList.add('ship')
grid1[18].classList.add('ship')
grid1[28].classList.add('ship')

function hitOrMiss(grid, index){
  if(grid[index].classList.contains('ship')){
    grid[index].classList.remove('ship')
    grid[index].classList.add('hit')
  } else if (!grid[index].classList.contains('ship') && !grid[index].classList.contains('hit') ||     grid[index].classList.contains('no-go')) {
    grid[index].classList.remove('no-go')
    grid[index].classList.add('miss')
  }
}

function gamePlay(){
  turn = 0
  console.log(turn)
  placeCompShips()
  placeCompShips()
  userTurn()

  // grab buttons
  grid1.forEach((square1, index) => {
    square1.addEventListener('click', () => {
      console.log('clicked', index)
    })
  })
}

function userTurn(){
  grid2.forEach((square2, index) => {
    square2.addEventListener('click', () => {
      console.log('clicked', index)
      hitOrMiss(grid2, index)
      turn++
      console.log(`user ${turn} number`)
      compShotGener()
    })
  })
}

gamePlay()
