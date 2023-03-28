const array = [['a',1],['b',2],['c',2]];

const conversionsToObject = (arr)=>{
    return Object.fromEntries(arr)
}
const result = conversionsToObject(array);
console.log("Result: " +JSON.stringify(result));