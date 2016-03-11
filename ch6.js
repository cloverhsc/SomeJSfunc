var p ={
    x:1.0,
    y:1.0,

    get r(){return Math.sqrt(this.x*this.x + this.y*this.y);},
    set r(newvalue){
        var oldvalue = Math.sqrt(this.x*this.x + this.y*this.y);
        var ratio = newvalue/oldvalue;
        this.x *= ratio;
        this.y *= ratio;
    },

    // theta : read only attrubite to getter accesssor
    get theta(){return Math.atan2(this.y, this.x);}
};

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

function keys(o){
    if(typeof 0 !== "object") throw TypeError();
    var result = [];
    for(var prop in o)
    {
        if(o.hasOwnProperty(prop))
            result.push(prop);
    }
    return result;
}

var o ={};
Object.defineProperty(o, "x",{value:1,writable:true,enumerable:false,configurable:true});

var p =Object.defineProperties({}, {
    x:{value:1, writable:true, enumerable:true, configurable:true},
    y:{value:2, writable:true, enumerable:true, configurable:true},
    r:{
        get: function(){return Math.sqrt(this.x*this.x + this.y*this.y);},
        enumerable:true,
        configurable:true
    }
});

/* 範例6.3
*  新增不可列舉的 extend() 方法至Object.prototype。
*  這個方法會擴充(extends) 他所作用的(在其呼叫的)的物件，
*  把傳入物件所有的特性複製進去。全部的特性屬性都會被複製，
*  不僅有特性值。所有引數物件的自有特性(甚至是不可列舉的)都
*  會被複製，除非在目標物件中已存在同名特性。
*/
Object.defineProperty(Object.prototype, "extend", //定義 Object.prototype.extend
    {
        writable:true,
        enumerable:false,    // 使他不可列舉
        configurable: true,
        value: function(o)  // 它的值為此函式
        {
            // 取得所有特性，就算是不可列舉的也一樣
            var names = Object.getOwnPropertyNames(o);

            // 使用迴圈逐一處理
            for(var i = 0; i < names.length; i++)
            {
                //跳過在this中已經存在的特性
                if(names[i] in this) continue;

                // 取得o的特性描述
                var desc = Object.getOwnPropertyDescriptor(o, names[i]);

                //用它在this 創建新特性
                Object.defineProperty(this, names[i], desc);
            }
        }
    });
