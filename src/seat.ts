enum Row {
  A,
  B,
  C,
  D,
}

enum Col {
  ONE,
  TWO,
  THREE,
  FOUR,
}

export class Seat {
  private readonly row: Row
  private readonly col: Col

  constructor(row: Row, col: Col) {
    this.row = row
    this.col = col
  }

  toString() {
    return `${this.row}-${this.col}`
  }
}
