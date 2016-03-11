//----------
var calculator = {
    operand1:1,
    operand2:2,
    add: function(){
        this.result = this.operand1 +operand2;
    }
};

//--------
var o = {
    m: function(){
        var self = this;
        console.log(this === o);
        f();

        function f(){
            console.log(this === o);
            console.log(self === o);
        }
    }
};

//-------
function max(/* ... */)
{
    var max = Number.NEGATIVE_INFINITY;
    for(var i =0; i <arguments.length;i++)
        if(arguments[i] > max) max = arguments[i];

    return max;
}

var largest = max(1, 10, 200, 2 ,3 ,10000, 6);

//--------
function factorial(n)
{
    if(isFinite(n) && n > 0 && n ==Math.round(n))
    {
        if(!(n in factorial))
            factorial[n] = n * factorial(n-1);
        return factorial[n];
    }
    else return NaN;
}
//------
var scope="global scope";

function checkscope()
{
    var scope = "local scope";
    function f(){return scope;}
    return f;
}
checkscope()();

//--------
function addPrivateProperty(o, name, predicate)
{
    var value;

    // getter . returen value
    o["get" + name] = function(){ return value; };

    // setter. save value.
    o["set" + name] = function(v)
    {
        if(predicate && !predicate(v))
            throw Error("set" + name + ": invalid value " + v);
        else
            value = v;
    };
}

//-----
function constfunc(v){return function(){return v;};}

var funcs=[];
for(var i = 0 ; i < 10; i++) funcs[i] = constfunc(i);

funcs[5]();

//------------
function constfuncs()
{
    var funcs = [];
    for(var i=0;i<10;i++)
        funcs[i] = function(){return i;};
    return funcs;
}

var funcs = constfuncs();
console.log(funcs[5]());
//-----
function check(args)
{
    var actual = args.length;
    console.log("args: " + actual);
    var expected = args.callee.length;
    console.log("callee: " + expected);
    if(actual !== expected)
        throw Error("Expect " + expected + " args; got " + actual);
}

function f(x, y, z)
{
    check(arguments);
    return x + y + z;
}

//-----
function trace(o, m)
{
    var original = o[m];
    o[m] = function(){
        console.log(new Date(), "Entering:", m);
        var result = original.apply(this, arguments);
        console.log(new Date(), "Exiting:", m);
        return result;
    };
}

var tg= {x:1};
trace(tg, "toString");
tg.toString();

//***
function f(y){return this.x + y;}
var o = {x:1};
var g = f.bind(o);
console.log(g.x);

//-------
var scope="global";
function constructFunction(){
    var scope = "local";
    return new Function('return scope');
}
constructFunction()();

//---
var data=[1,1,3,5,5];
//求平均
var total = 0;
for(var i=0;i<data.length;i++) total +=data[i];
var mean = total/data.length;       // 平均值：3
console.log('平均值：'+mean);

//計算標準差，首先必須先計算每個元素與平均值之間的離差(deviation)平方值總和
total = 0;
for(var i = 0 ;i < data.length; i++)
{
    var deviation = data[i] - mean;
    total += deviation * deviation;
}

// 標準差
var stddev = Math.sqrt(total/(data.length-1));
console.log(stddev);


//----- function style programe
var sum = function(x,y){return x+y;};
var square = function(x){return x*x;};

var data=[1,1,3,5,5];
var mean = data.reduce(sum)/data.length;
var deviations = data.map(function(x){return x-mean;});
var stddev = Math.sqrt(deviations.map(square).reduce(sum)/(data.length-1));
console.log(stddev);

//------
function not(f){
    return function(){
        var result = f.apply(this, arguments);
        return !result;
    };
}

var even = function(x){
    return x % 2 === 0;
};

var odd = not(even);


//----
// 回傳一個計算f(g(..))的新函式
// 回傳的函式h 將它所有的引數都傳給g ，在把g 的回傳值傳給f。
// 然後回傳f的回傳值。f 與 g 兩者都是用與 h 相同的this值來調用。
function compose(f,g)
{
    return function()
    {
        // 我們對f使用call，因為我們傳入單一個值，而對 g 使用 apply，因為
        // 我們傳入一個值組成的陣列。
        return f.call(this, g.apply(this, arguments));
    };
}

var square = function(x){return x*x;};
var sum = function(x,y){return x + y;};
var squareofsum = compose(square, sum);

// -- 自己改寫compose變成將傳入的元素做平方值後再全部加總。
function scompose(f,g)
{
    return function()
    {
        return f.apply(this, g.apply(this, arguments));
    };
}

var sqr = function(x){x.map(function(num){return num*num;});};
var summ = function(sm){sm.reduce(function(a,b){return a + b;});};

var sumofsquare = scompose(summ,sqr);
sumofsquare(2,3);

//-------
// 把類陣列轉成陣列，在下面用來把arguments物件轉成真正的陣列。
function array(a, n){return Array.prototype.slice.call(a, n || 0);}

// 這個函式的引數是從左方傳入
function partialLeft(f /*...*/)
{
    var args = arguments;
    return function(){
        var a = array(args,1);
        a = a.concat(array(arguments));
        return f.apply(this, a);
    };
}

// 這個函式的引數是從右方傳入
function partialRight(f /*...*/)
{
    var args = arguments;
    return function(){
        var a = array(arguments);
        a = a.concat(array(args,1));
        return f.apply(this,a);
    };
}

// 這個函式的引數作為範本之用。引數列中的undefined值使用內層的值來填補。
function partial(f /*...*/)
{
    var args = arguments;
    return function(){
        var a = array(args, 1);     //從外層引數的陣列開始
        var i = 0 , j = 0;
        //逐一查看這些引數，使用來自內層的值填補undefined值
        for(;i < a.length; i++)
            if (a[i] === undefined) a[i] = arguments[j++];
        // 現在附加任何剩下的內層引數
        a = a.concat(array(arguments, j));
        return f.apply(this, a);
    };
}

var f = function(x,y,z){return x*(y-z);};

partialLeft(f,2)(3,4);
partialRight(f,2)(3,4);
partial(f, undefined, 2)(3,4);
