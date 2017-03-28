var array = [1, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7];

var newArray = Array.from(new Set(array));

var dom = document.getElementById('array');

console.log(dom);

dom.innerHTML = newArray.join(',');