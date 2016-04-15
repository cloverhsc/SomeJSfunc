// 將元素e 轉為相對定位並左右搖動它，第一個引數可以是元素物件或元素id
// 如果函式被當作第二引數傳入，它會被調用，以e為引數，在動畫完成之時。
// 第三個引數指定搖動e的幅度。預設 5 像素，第四個引數指定要搖多久。預設
// 500 ms

function shake(e, oncomplete, distance, time)
{
    // 處理引數
    if(typeof e === "string") e = document.getElementById(e);
    if(!time) time = 500;
    if(!distance) distance = 5;

    console.log(typeof e);
    var originalStyle = e.style.cssText;        //儲存e原本的樣式
    e.style.position = "relative";              // 讓e使用相對定位
    var start = (new Date()).getTime();         // 動畫開始時間
    animate();

    // 這個函式檢查經過的時間，並更新e的位置。如果動畫完成，恢復e原本的狀態。
    // 否則，更新e的位置並排定他的下次執行。
    function animate()
    {
        var now = (new Date()).getTime();       // 取得目前經過時間
        var elapsed = now-start;                // 開始後經過多少時間
        var fraction = elapsed/time;            // 佔總時間的多少比例

        if(fraction < 1)
        {
            // 如果動畫尚未結束以動畫完成的比例來計算e的x位置，我們用到正弦
            // 函數，並將完成比例乘以40pi，所以它會來回搖動兩次。
            var x = distance * Math.sin(fraction * 4 * Math.PI);
            e.style.left = x + "px";

            // 25 ms後或是總時間結束時試著在跑一次。目標是達到每秒40 frame
            // 流暢動畫。
            setTimeout(animate, Math.min(25, time - elapsed));
        }
        else
        {
            // 否則，動畫完成
            e.style.cssText = originalStyle;     //回覆原本樣式
            if(oncomplete) oncomplete(e);        // 調用完成時的呼叫
        }
    }
}

// 在time 毫秒內將e從完全不透明淡化為完全透明，假設調用這個函式時e是完全
// 不透明。oncomplete 是非必須的引數，會在動畫結束時以e為其引數被調用。
// 如果time被省略，就用500毫秒。此寒是在IE中無法運作，但可改為使用IE非標準
// 的filter 特性來製作動畫效果。
function fadeOut(e, oncomplete, time)
{
    if(typeof e === "string") e = document.getElementById(e);
    if(!time) time = 500;

    //我們用Math.sqrt作為簡單的『easing 函式』使動畫具有微妙的非線性行為：
    // 它一開始會快速地淡出，隨後見見緩慢下來。
    var ease = Math.sqrt;
    var start = (new Date()).getTime();     //動畫開始時間
    animate();                              // 開始產生動畫效果

    function animate()
    {
        var elapsed = (new Date()).getTime() - start;       //經過的時間
        var fraction = elapsed / time;                      //佔總時間的比例
        if(fraction < 1)                                    //如果動畫尚未完成
        {
            var opacity = 1 - ease(fraction);               //計算元素的不透明度
            e.style.opacity = String(opacity);              //在e上設定
            setTimeout(animate, Math.min(25,                //排定下個畫框
                time-elapsed));
        }
        else                // 否則就完成了
        {
            e.style.opacity = "0";                          //讓e完全透明
            if(oncomplete) oncomplete(e);               //調用完成時的callback
        }
    }
}
