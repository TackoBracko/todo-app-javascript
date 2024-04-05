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

let a
let b

function multiplyTwoNum (a,b) {
   return a*b
}

console.log(multiplyTwoNum(2,5))

const result = multiplyTwoNum(1,10)

console.log(result)
