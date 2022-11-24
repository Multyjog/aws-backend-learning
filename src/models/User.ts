export class UserData {
    name: string 
    age: number

    constructor(name: string = 'User', age: number = 0) {
        this.name = name
        this.age = age
    }
    getInfo() {
        return `${this.name} - ${this.age} y.o.`
    }
}

export class User extends UserData {
    id: string

    constructor(id: string, name: string = 'User', age: number = 0) {
        super(name, age)
        this.id = id
        // this.name = name
        // this.age = age
    }
}