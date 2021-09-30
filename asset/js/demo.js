var a = [1, 2, 3];
var b = JSON.parse(JSON.stringify(a));
a = [1, 2];
console.log(b);