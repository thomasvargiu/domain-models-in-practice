export class Person {
  private name: String

  constructor(name: String) {
    this.name = name
  }

  sayHello() {
    return `Hello, I' ${this.name}`
  }
}
