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

    function f(){};
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