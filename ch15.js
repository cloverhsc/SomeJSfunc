/*
* 這個函式預期任意數目的字串引數，它將每個引數視為一個元素id 並逐個為他們
* 呼叫 document.getElementById()。它回傳一個物件將id對映至他們的Element物件。
* 如果有任何 id 為定義，就丟出Error物件
*/
function getElments(/* ids ... */)
{
  var elements ={};
  for(var i = 0 ; i < arguments.length; i++)
    {
        var id = arguments[i];
        var elt = document.getElementById(id);
        if(elt == null)
            throw new Error("No element with id: " + id);
        elements[id] = elt;
    }
    return elements;
}

//--------------
var sparklines = document.getElementsByClassName('sparkline');

for(var i = 0; i < sparklines.length; i++)
{
    var dataset = sparklines[i].dataset;
    var ymin = parseFloat(dataset.ymin);
    var ymax = parseFloat(dataset.ymax);
    var data = sparklines[i].textContent.split(' ').map(parseFloat);
    drawSparkline(sparklines[i], yminx, ymax, data);
}

// -------------
// 定義一組簡單的串流 api 來設定元素的innerHTML
function ElementStrem(elt)
{
    if(typeof elt === "string") elt = document.getElementById(elt);
    this.elt = elt;
    this.buffer = "";
}

// 串接所有的引數並附加至緩衝區
ElementStream.prototype.write = function(){
    this.buffer += Array.prototype.join.call(arguments, "") + "\n";
};

// 就像write()，但加上一個newline
ElementStream.prototype.writeln = function(){
    this.buffer += Array.prototype.join.call(arguments, "") + "\n";
};

// 使用緩衝區來設定元素內容，並清空緩衝區。
ElementStream.prototype.close = function(){
    this.elt.innerHTML = this.buffer;
    this.buffer = "";
};
