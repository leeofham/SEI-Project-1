console.log('JS loaded')

const section1 = document.querySelector('.grid-one')
const section2 = document.querySelector('.grid-two')
const gridWidth = 10
const gridHeight = 10
const shipLength = 3
const numShips = 5
let noGoStart
let noGoLeft
let noGoRight
let noGoEnd
let noGoLength
let grid1Divs
let grid2Divs
let randomNum
let column
let row
let horizOrVert

for(let i = 0; i<100; i++){
  grid1Divs = document.createElement('div')
  section1.appendChild(grid1Divs)

  grid2Divs = document.createElement('div')
  section2.appendChild(grid2Divs)
}

const grid1 = section1.querySelectorAll('div')
const grid2 = section2.querySelectorAll('div')

function placeCompShips(){
  // for(let i = 0; i<numShips; i++) {
    randomNumber()
    horizontalOrVertical()
    console.log((randomNum + 1) + ' ship number, ' + randomNum + ' index number, '+ column + ' column number, ' + row + ' row number, ' + horizOrVert + ' 1 = horizontal / 2 = vertical')
  // }
}

function randomNumber(){
  randomNum = Math.floor(Math.random() * grid2.length)
  // console.log('index = ' + randomNum)

  column = randomNum % gridWidth
  // console.log('column = ' + (column + 1))

  row = Math.floor(randomNum/gridWidth)
  // console.log('row = ' + (row + 1))
}

function horizontalOrVertical(){
  horizOrVert = 1
  // Math.ceil(Math.random() * 2)
  // console.log(horizOrVert + ' 1 = horizontal / 2 = vertical')

  if(horizOrVert === 1){
    // console.log('horizontal', horizOrVert)
    generateShipHorizontal()
  } else {
    // console.log('vertical', horizOrVert)
    generateShipVertically()
  }
}

function generateShipHorizontal(){
  while((gridWidth - column) < shipLength){
    randomNumber()
  }
  // checkIfShipHorizontal()
  for(let i = 0; i < shipLength; i++){
    noGoZoneHorizontal()
    grid2[randomNum + i].classList.add('ship')
  }
}


function generateShipVertically(){
  while((gridHeight - row) < shipLength) {
    randomNumber()
  }
  for(let i = 0; i < shipLength; i++){
    grid2[randomNum + (i * 10)].classList.add('ship')
  }
}

function noGoZoneHorizontal(){
  noGoStart = (randomNum - gridWidth - 1)
  noGoEnd = (randomNum + gridWidth - 1)
  noGoLeft = randomNum -1
  noGoRight = randomNum + shipLength
  noGoLength = shipLength + 2

  grid2[noGoStart].classList.add('no-go')
  grid2[noGoLeft].classList.add('no-go')
  grid2[noGoRight].classList.add('no-go')
  grid2[noGoEnd].classList.add('no-go')

  grid2[randomNum + shipLength].classList.add('no-go')
  if(noGoStart % gridWidth === gridWidth - 1){
    noGoStart = 0
    noGoLength --
  }
}

// length of no go = shiplength + 2
// start of no go point will be index - width - 1
//
//if(start of no go % width === width - 1)
// start = 0
// length --
//
// start + length + index+10+ index+10 - length - index-10
//
//
//
//
//
//
//
//
//

grid1[8].classList.add('ship')
grid1[18].classList.add('ship')
grid1[28].classList.add('ship')

function hitOrMiss(square){
  if(square.classList.contains('ship')){
    square.classList.remove('ship')
    square.classList.add('hit')
  } else if (!square.classList.contains('ship') && !square.classList.contains('hit')){
    square.classList.add('miss')
  } else {
    return false
  }
}

function gamePlay(){
  placeCompShips()

  // grab buttons
  grid1.forEach((square1, index) => {
    square1.addEventListener('click', () => {
      console.log('clicked', index)
      hitOrMiss(square1)
    })
  })

  grid2.forEach((square2, index) => {
    square2.addEventListener('click', () => {
      console.log('clicked', index)
      hitOrMiss(square2)
    })
  })
}

gamePlay()
