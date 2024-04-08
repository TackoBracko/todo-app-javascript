const myArr = [1,2,3,4,5,6,7,8];

//1. Novi array tako da svaki item dobije + 1;

const newPlusOneArr = myArr.map(num => {
    return num + 1
})

console.log(newPlusOneArr)

//2. Novi array sa brojevima manjim od 4;

const lessThanFour = myArr.filter(num => {
    return num < 4
})

console.log(lessThanFour)

//3. Novi array sa brojem 7;

const justNumSeven = myArr.find(num => {
    return num === 7
})

const seven = myArr.includes(7)

const justSeven = myArr.filter(num => {
    return num === 7
})

console.log(justNumSeven)
console.log(seven)
console.log(justSeven)

//4. Novi array sa brojevima vecim od 5;

const greaterThanFive = myArr.filter(num => {
    return num > 5
})

console.log(greaterThanFive)

//5. Novi array sa parnim brojevima (Modulo operator in Javascript); 

const isEven = myArr.filter(num => {
    return num % 2 === 0
})

console.log(isEven)

//1. Napravi funkciju (multiply) koja prima dva broja (KOJA JA HOCU!!!!) i vraca pomnozeno ta dva broja
//NPR => const result = multiply(2,5); // 10

function multiplyTwoNum (a,b) {
   return a*b
}

console.log(multiplyTwoNum(2,5))

const result = multiplyTwoNum(1,10)

console.log(result)


const people =[
    {name: "John Doe", salary: 1000, age: 30},
    {name: "Jane Doe", salary: 1200, age: 25},
    {name: "Jack Doe", salary: 1300, age: 31},
    {name: "Doug Doe", salary: 1400, age: 32}
];

//1. Return a new array with people equal or under the age of 30.

const ageUnder30 = people.filter(person => {
    return person.age <= 30
})

console.log(ageUnder30)

//2. Find me a person called "Doug Doe".

const personNameDD = people.find(person => {
    return person.name === 'Doug Doe'
})

console.log(personNameDD)

//3. Check if there is a person called "Jane Doe" with salary higher then 1000.

const checkJDPrson = people.find(person => {
    return person.name === 'Jane Doe' && person.salary > 1000
})

if(checkJDPrson) {
    console.log('true')
} else {
    console.log('false')
}

console.log(checkJDPrson)

//4. Increase a salary by 100 for every person younger then 31 but make sure not to mutate salary of those people in original array.

const salaryIncrease100 = people.map(person => {
    if (person.age < 31) {
        return {...person, salary: person.salary + 100}
    } else {
        return person
    }
})

console.log(salaryIncrease100)

//5. Do the same like in task 4 but i want you to mutate the original array.

const salaryIncrease = people.forEach(person => {
    if (person.age < 31) {
        person.salary += 100
    }
})

console.log(salaryIncrease)

//6. Create a function called updatePeople that will recieve people parameter, iterate through people array and add "isActive" prop with value of "true".
//E.G.result

function updatePeople(people) {
    people.map(person => {
        return {...person, isActive: true}
    })
}

const peopleResult = updatePeople(people);
console.log(peopleResult) // [{name: "John Doe", salary: 1000, age: 30, isActive:true},...];
