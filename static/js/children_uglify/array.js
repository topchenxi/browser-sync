var array1 = [1, 2, 3, 4, 5, 6, 7];
// array1.find(item => item == 3);
Array.prototype.concat.call(array1, array1);
console.log(Math.max.apply(null, array1));
var arr = [1, 2, 3, 4, 5, 6, 10, 7, 9, 11, 20, 19];
console.log(Math.min.apply(null, arr));//获取数组中最小值
console.log(Math.max.apply(null, arr));//获取数组中的最大值
const a = 1;
let show = () => {
    console.log(array1)
};