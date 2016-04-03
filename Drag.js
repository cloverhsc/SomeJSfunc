/**
Drag.js :拖拉絕對定位的HTML元素。

此模組定義單個drag()函式，設計給onmousedown事件處理器來呼叫。持續在後的mousemove
事件會移動指定的元素。
mouseup事件則會結束拖拉的動作。這個實作能夠在標準的及IE的事件模型下運作。
他需要本書其他部分所載的 getScrollOffsets() 函式。

引數:

elementToDrag:  接受到mousedown 事件的元素，或他的容器元素。他必須是絕對定位。
                            他的style.left與style.top值會依據使用者的拖拉而改變。

event:  mousedown事件的 Event 物件。
**/

function drag(elementToDrag, event)
{
    // 最初的滑鼠位置，轉為文件座標
    var scroll = getScrollOffsets();        // 來自他處的工具函式 15-8
    var startX = event.clientX + scroll.x;
    var StartY = event.clientY + scroll.y;

    // 要被拖拉的元素原本的位置(已文件座標表示)
    // 因為elementToDrag 是絕對定位的，我們假設他的 offsetParent為文件的主體(body)。
    var origX = elementToDrag.offsetLeft;
    var origY = elementToDrag.offsetTop;

    // 計算滑鼠mousedown 事件的位置與該元素左上角之間的距離
    // 我們會在滑鼠移動時維持這個距離
    var deltaX = startX - origX;
    var deltaY = startY - origY;

    // 註冊會回應mousemove 事件的事件處理器，以及跟在這個mousedown事件後的mouseup
    // 事件的處理器
    if(document.addEventListener)               // 標準事件模型
    {
        // 在文件上註冊捕捉事件處理器
        document.addEventListener("mousemove",moveHandler, true);
        document.addEventListener("mouseup",upHandler,true);
    }
    else if(document.attachEvent)               // IE5-8 的 IE事件模型
    {
        // 在IE 事件模型中，我們藉由呼叫元素上的setCapture() 來捕捉事件。
        elementToDrag.setCapture();
        elementToDrag.attachEvent("onmousemove", moveHandler);
        elementToDrag.attachEvent("onmouseup", upHandler);

        // 將"onlosecapture" 視為mouseup事件。
        elementToDrag.attachEvent("onlosecapture", upHandler);
    }

    // 我們已經處理了這個事件，不要讓別人看到他
    if(event.stopPropagation) event.stopPropagation();       // 標準模型
    else event.cancelBubble = true;                                     // IE

    // 現在阻止任何預設動作
    if(event.preventDefault) event.preventDefault();         // 標準模型
    else event.returnValue = false;                                     // IE


    /*
        這個處理器會在元素被拖拉時捕捉mousemove事件，他負責移動該元素。
    */
    function moveHandler(e){
        if(!e) e = window.event;                    // IE 模型

        // 將元素移至目前滑鼠所在位置，藉由捲動軸位置以及初次點擊後的位移量來調整。
        var scroll = getScrollOffsets();
        elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + "px";
        elementToDrag.style.top = (e.clientY + scroll.y -delteY) + "px";

        // 並且不要讓別人看到這個事件
        if(e.stopPropagation) e.stopPropagation();                  // 標準
        else e.cancelBubble = true;                                         // IE
    }

    /*
        這個處理器捕捉最後的mouseup 事件，發生於拖拉動作結束之時。
    */
    function upHandler(e)
    {
        if(!e) e = window.event;                    // IE 事件

        // 取消捕捉事件處理器的註冊
        if(document.removeEventListener)                    // DOM 模型
        {
            document.removeEventListener("mouseup",upHandler,true);
            document.removeEventListener("mousemove",moveHandler,true);
        }
        else if(document.detachEvent){                          // IE5+事件模型
            elementToDrag.detachEvent("onlosecapture", upHandler);
            elementToDrag.detachEvent("onmouseup", upHandler);
            elementToDrag.detachEvent("onmousemove", moveHandler);
            elementToDrag.releaseCapture();
        }

        // 並且不讓事件進一步傳播
        if(e.stopPropagation) e.stopPropagation() ;         // 標準模型
        else e.cancelBubble = true ;                                // IE
    }
}
