import { expect } from "chai"
import { Person } from "../../src/examples/person"

describe("Person", () => {
  describe("sayHello", () => {
    it("should return Hello", async () => {
      const person = new Person("Bob")

      const res = person.sayHello()

      expect(res).eq("Hello, I' Bob")
    })
  })
})
