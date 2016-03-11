function inherit(p){
    if(p == null) throw TypeError();
    if(Object.create)
        return Object.create(p);

    var t = typeof p;
    if(t !=="object" && t !== "function") throw TypeError();

    function f(){}
    f.prototype = p;
    return new f();
}

function range(from, to)
{
    // 使用inherit()函式來創建一個物件，他繼承字下面所定義的prototype物件。
    // 這個prototype物件被存為這個函式的一個特性，並且定義了共用的方法(行為)
    // 給所有的range物件。
    var r = inherit(range.methods);

    // 儲存這個新range物件的範圍起點與終點(狀態)。
    // 這些並非繼承特性，他們為這個物件所獨有。
    r.from = from;
    r.to = to;

    // 最後回傳這個新物件
    return r;
}

// 這個prototype物鑑定億了要由所有range物件繼承的方法。
range.methods ={
    // 如果X在範圍中就回傳true，否則回傳false。這個方法可用在文字(textual)
    // 與日期的範圍，也能用在數值範圍。
    includes: function(x){return this.from <= x && x <= this.to;},

    // 對範圍中的每個整數調用一次f。 這個方法僅限於數值(numeric)範圍。
    foreach: function(f){
        for(var x = Math.ceil(this.form); x <= this.to; x++)
            f(x);
    },

    // 回傳範圍的字串表示值(string representation)
    toString: function(){return "(" + this.form + " ... " + this.to + ")";}
};

// 這裡是幾個range 物件的使用範例
var r = range(1,3);     // 創建一個range物件
r.includes(2);          // => true: 2 在範圍中
r.foreach(console.log); // 印出 1 2 3
console.log(r);         // 印出(1...3)

//---------
// 使用建構式的Range類別
// range2.js ：另外一個代表一個範圍值的類別。
// 這是個建構函式，用來初始化新的Range物件。請注意他並沒有創建或回傳這個物件
// ，他只是為這個物建設定初值。
function Range(from, to)
{
    // 儲存這個新Range 物件的範圍起點與終點(狀態)。他們是非繼承特性，為這個
    // 物件獨有。
    this.from = from;
    this.to = to;
}

// 所有的Range 物件都繼承自這個物件。請注意特性名稱必須是"prototype" 才行。
Range.prototype = {
    // 如果x 在範圍中就回傳true，否則false。這個方法可以用在文字與日期的範圍
    // ，也能用在數值範圍。
    includes: function(x){ return this.from <= x && x <= this.to;},
    // 對範圍中的每個整數調用一次 f。這個方法僅能用於數值範圍。
    foreach: function(f){
        for(var x = Math.ceil(this.from); x <= this.to; x++)
            f(x);
    },
    toString: function(){return "(" + this.from + "..." + this.to + ")";},
    constructor:Range
};

// 這裡是幾個Range物件的使用範例
var r = new Range(1,3);     // 創建一個Range物件
r.includes(2);              // => true: 2 在範圍內
r.foreach(console.log);     // 印出 1 2 3
console.log(r);             // 印出(1...3)

//--------
// 集合
function Set()
{
    this.values = {};       // this 物件用來存放集合的特性
    this.n = 0;             // 集合中有幾個值
    this.add.apply(this, arguments);    // 所有的引數都是要加入集合的值
}

// 把每個引數加到集合中。
Set.prototype.add = function(){
    for(var i = 0; i < arguments.length; i++)       // 對每一個引數
    {
        var val = arguments[i];                     // 要加到集合中的值
        var str = Set._v2s(val);                    // 將之轉為字串
        console.log(str);
        if(!this.values.hasOwnProperty(str))        // 如果原本不在集合中
        {
            this.values[str] = val;                 // 將字串對映至值
            this.n++;
        }
    }

    return this;
};

// 從集合中移除每個引數。
Set.prototype.remove = function()
{
    for(var i = 0; i <arguments.length; i++)
    {
        var str = Set._v2s(arguments[i]);
        if(this.values.hasOwnProperty(str))     // 如果他在集合中
        {
            delete this.values[str];            // 刪除他
            this.n--;                           // 遞減集合大小
        }
    }
};

// 如果集合包含該值就回傳true,否則回傳false。
Set.prototype.contains = function(value)
{
    return this.values.hasOwnProperty(Set._v2s(value));
};

// 回傳集合大小
Set.prototype.size = function(){return this.n;};

// 在指定context下對每個集合元素呼叫函式f
Set.prototype.foreach = function(f, context)
{
    for(var s in this.values)                   //對集合中的每個字串
        if(this.values.hasOwnProperty(s))       // 忽略繼承而來的特性
            f.call(context, this.values[s]);    // 在值上呼叫f
};

// 這個內部用的函式把任何Javascript 值對映至一個唯一的字串
Set._v2s = function(val)
{
    switch(val)
    {
        case undefined: return 'u';
        case null: return 'n';
        case true: return 't';
        case false: return 'f';
        default: switch(typeof val)
        {
            case 'number': return '#' + val;
            case 'string': return '"' + val;
            default: return '@' + objectId(val);
        }
    }

    function objectId(o){
        var prop = "|**objectid**|";        // 私有的特性名稱用來儲存id
        if(!o.hasOwnProperty(prop))         // 如果物件沒有id
        {
            o[prop] = Set._v2s.next++;      //指定下一個可用id給他
        }
        return o[prop];
    }
};
Set._v2s.next =100;
