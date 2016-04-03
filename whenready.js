/*
* 傳入whenReady()的函式會在文件解析完成。
    可供操作時被調用(作為文件的方法)。註冊的函式會由第一個發生的DOMContentLoaded
    , readystatechange或load事件所觸發。一旦文件準備就緒而所有的函式皆已調用完畢，任何
    傳入whenReady()的函示會立即被調用。
*/

var  whenReady = (function(){               // 此函式回傳whenReady()
    var funcs = [];                                     // 事件發生時要執行的函式
    var ready = false;                               // 處理器被觸發後要切換為true

    //  文件就緒時要被調用的處理器
    function handler(e){
        // 如果已經跑過一次，僅回傳
        if(ready) return;

        //如果這是個readystatechange 事件，而改變後的狀態並非"complete"，那就尚未準備就緒
        if(e.type === "readystatechange" && document.readyState !== "complete")
            return;

        // 執行所有註冊的函式。
        // 注意到我們每次都會檢查 funcs.length，以防呼叫的函式會去註冊更多的函式。
        for(var i = 0 ; i < funcs.length; i++)
            funcs[i].call(document);

        // 現在將ready 旗標設為true 並清除註冊的函式
        ready = true;
        funcs = null;
    }

    // 為我們所要的事件註冊處理器
    if(document.addEventListener)
    {
        document.addEventListener("DOMContentLoaded", handler, false);
        document.addEventListener("readystatechange",handler, false);
        window.addEventListener("load",handler, false);
    }
    else if(document.attachEvent)
    {
        document.attachEvent("onreadystatechange", handler);
        window.attachEvent("onload", handler);
    }

    // 回傳 whenReady 函式
    return function whenReady(f)
    {
        if(ready) f.call(document);                 // 若已準備就緒，就執行
        else funcs.push(f);                             // 否則排入佇列等候執行
    }
}());
