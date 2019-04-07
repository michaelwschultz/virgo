//** Shapes **//

/* UserShip */
/*
        •
*/
const userShip = [
  { row: 0, column: 0, color: "bg-yellow" },
  { row: 0, column: 1, color: "bg-yellow" },
  { row: 0, column: 2, color: "bg-yellow" },
  { row: 0, column: 3, color: "bg-yellow" },
  { row: -1, column: 1, color: "bg-yellow" },
  { row: 1, column: 1, color: "bg-yellow" },
]

/* Enemies */
/*
        •••
         •••
        •••
*/
const shapeSmallEnemy = [
  {row: 0, column: 0, color: "bg-orange"},
  {row: 0, column: 1, color: "bg-orange"},
  {row: 0, column: 2, color: "bg-orange"},
  {row: 1, column: 1, color: "bg-orange"},
  {row: 1, column: 2, color: "bg-orange"},
  {row: 1, column: 3, color: "bg-orange"},
  {row: 2, column: 0, color: "bg-orange"},
  {row: 2, column: 1, color: "bg-orange"},
  {row: 2, column: 2, color: "bg-orange"}
]

/*
         •••
        ••
        ••
         •••
*/
const shapeLargeEnemy = [
  {row: 0, column: 1, color: "bg-green"},
  {row: 0, column: 2, color: "bg-green"},
  {row: 0, column: 3, color: "bg-green"},
  {row: 1, column: 0, color: "bg-green"},
  {row: 1, column: 1, color: "bg-green"},
  {row: 2, column: 0, color: "bg-green"},
  {row: 2, column: 1, color: "bg-green"},
  {row: 3, column: 1, color: "bg-green"},
  {row: 3, column: 2, color: "bg-green"},
  {row: 3, column: 3, color: "bg-green"}
]

const gameOver = [
  {row: 0, column: 0, color: "bg-green"},
  {row: 0, column: 1, color: "bg-green"},
  {row: 0, column: 2, color: "bg-green"},
  {row: 0, column: 3, color: "bg-green"},
  {row: 0, column: 6, color: "bg-green"},
  {row: 0, column: 7, color: "bg-green"},
  {row: 0, column: 8, color: "bg-green"},
  {row: 0, column: 9, color: "bg-green"},
  {row: 1, column: 0, color: "bg-green"},
  {row: 1, column: 6, color: "bg-green"},
  {row: 1, column: 9, color: "bg-green"},
  {row: 2, column: 0, color: "bg-green"},
  {row: 2, column: 6, color: "bg-green"},
  {row: 2, column: 9, color: "bg-green"},
  {row: 3, column: 0, color: "bg-green"},
  {row: 3, column: 2, color: "bg-green"},
  {row: 3, column: 3, color: "bg-green"},
  {row: 3, column: 6, color: "bg-green"},
  {row: 3, column: 9, color: "bg-green"},
  {row: 4, column: 0, color: "bg-green"},
  {row: 4, column: 3, color: "bg-green"},
  {row: 4, column: 6, color: "bg-green"},
  {row: 4, column: 9, color: "bg-green"},
  {row: 5, column: 0, color: "bg-green"},
  {row: 5, column: 1, color: "bg-green"},
  {row: 5, column: 2, color: "bg-green"},
  {row: 5, column: 3, color: "bg-green"},
  {row: 5, column: 6, color: "bg-green"},
  {row: 5, column: 7, color: "bg-green"},
  {row: 5, column: 8, color: "bg-green"},
  {row: 5, column: 9, color: "bg-green"}
]

/* Patterns */
const patternStatic = [
  {row: 0, column: 0}
]
const patternDropDown = [
  {row: 10, column: 0}
]
const pattern1 = [
  {row: 0, column: -10},
  {row: -5, column: 0},
  {row: 0, column: 10},
  {row: 5, column: 0}
]
const pattern2 = [
  {row: 4, column: 3},
  {row: -4, column: 0},
  {row: 6, column: 2},
  {row: -3, column: 6}
]

const patternScroll = [
  { row: 0, column: -1 },
]
