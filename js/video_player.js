//var hideVol = null;
var videoVolume = -1;  // 保存音量百分比
var volBarLen = -1;  // 保存音量条白底长度
var duration = 0;
var hide_control = null;

var leftX;
var rightX ;

var topY;
var downY;
/*
函数：playOrPause
描述：播放或暂停视频
 */
function playOrPause(){
    var oPlayer = document.getElementById("player");  //video
    let oPlayerBtn = document.getElementById("playerBtn");  //播放按钮

    if(oPlayer.paused==true){
        oPlayer.play();
        oPlayerBtn.src="./img/pause1.png";
    }else{
        oPlayer.pause();
        oPlayerBtn.src="./img/on1.png";
    }
}

/*
函数：clickScreen
描述：设置点击播放屏幕触发事件
 */
function clickScreen(){
    var oPlayer = document.getElementById("player");
    //alert(oPlayer);
    oPlayer.onclick = function(){
        playOrPause();
    }
}

/*
函数：clickPlayBtn
描述：设置点击播放按键触发事件
 */
function clickPlayBtn(){
    var oPlayerBtn = document.getElementById("playerBtn");
    oPlayerBtn.onclick = function(){
        playOrPause();
    }
}

/*
函数：updateProgressBar
描述：实时显示播放进度和加载进度
 */
function updateProgressBar() {
    var oPlayer = document.getElementById("player");
    var oPlayerBar = document.getElementById("playerBar");
    var oBufferBar = document.getElementById("bufferBar");
    var oBarButton = document.getElementById("barButton");
    var oShowTime = document.getElementById("showTime");

    var cTime = oPlayer.currentTime;
    var dTime = oPlayer.duration;

    var playerProgress = cTime / dTime * 100;
    oPlayerBar.style.width = playerProgress + "%";
    oBarButton.style.left = playerProgress + "%";
    if (player.buffered.length){
        var bTime = oPlayer.buffered.end(0);
        var bufferProgress = bTime / dTime * 100;
        oBufferBar.style.width = bufferProgress + "%";
    }
    // duration是一个全局变量
    if(duration == 0)
        duration = getTime(oPlayer.duration);
    var currentTime = getTime(oPlayer.currentTime);
    oShowTime.innerText = currentTime + "/" + duration;
}

/*
函数：setVolume
描述：设置跟音量有关的控制
 */
function setVolume(){
    initVol(); // 初始化音量条

    var oControlVol = document.getElementById("controlVolume");
    var oVolFrame = document.getElementById("volumeFrame");
    var oPlayer = document.getElementById("player");
    // var oVolButton = document.getElementById("volButton");
    var oVolBar = document.getElementById("volBar");
    var oVolImag = document.getElementById("volImg");

    var hideVol = null;  // 隐藏音量条事件

    // 显示音量条
    oControlVol.onmouseover = function(){
        clearTimeout(hideVol);  // 只要鼠标在音量框内就不会隐藏音量框

        // 设置的音量图标和音量条是分离的，计算音量条框位置
        var tarX = oControlVol.offsetLeft + (parseInt(getComputedStyle(oControlVol)["width"]) - parseInt(getComputedStyle(oVolFrame)["width"])) / 2;
        var tarY = oControlVol.offsetTop - parseInt(getComputedStyle(oVolFrame)["height"]) - 20;

        oVolFrame.style.left = tarX + "px";
        oVolFrame.style.top = tarY + "px";
        oVolFrame.style.display = "block";
    };

    // 隐藏音量条
    oControlVol.onmouseout = function(){
        hideVol = setTimeout(function () {
            var oVolFrame = document.getElementById("volumeFrame");
            oVolFrame.style.display = "none";
        }, 600);
    };

    // 点击音量图标，切换静音
    oVolImag.onclick = function(){
        if (volBarLen < 0){  //使静音
            videoVolume = oPlayer.volume;
            oPlayer.volume = 0;
            volBarLen = mySetVolumeBar(parseInt(getComputedStyle(oVolBar)["height"]));
        }else{  //恢复原来声音
            oPlayer.volume = videoVolume;
            mySetVolumeBar(volBarLen);
            videoVolume = -1;
            volBarLen = -1;
        }
    };

    // 拖动音量
    oVolFrame.onmousedown = function(evt){
        var e = evt || window.event;
        if(e.button == 0){
            // alert(oVolButton.offsetTop);
            topY = getOffsetY(oVolBar);
            downY = topY + parseInt(getComputedStyle(oVolBar)["height"]);
            document.addEventListener("mousemove", toDragVolume);
        }

    };

    document.addEventListener("mouseup", function(){
        document.removeEventListener("mousemove", toDragVolume);
    });
}
/*
函数：toDragVolume
描述：拖动音量条时触发的事件
 */
function toDragVolume(evt){
    var oPlayer = document.getElementById("player");
    var oVolBar = document.getElementById("volBar");
    //console.log("??");
    var e = evt || window.event;
    var buttonY = e.pageY;
    if (buttonY<topY)
        buttonY = topY;
    if(buttonY>downY)
        buttonY = downY;
    // oVolButton.style.top = buttonY - topY + "px";
    oPlayer.volume = (downY - buttonY) / parseInt(getComputedStyle(oVolBar)["height"]);
    mySetVolumeBar(buttonY - topY);
    videoVolume = -1;
    volBarLen = -1;
}
/*
函数：getOffsetY
描述：计算结点n在整个页面中的y坐标
参数：n-结点
 */
function getOffsetY(n){
    var node = n;
    var sum = node.offsetTop;
    while(node.offsetParent){
        node = node.offsetParent;
        sum += node.offsetTop;
    }
    return sum;
}

/*
函数：getOffsetX
描述：计算结点n在整个页面中的x坐标
参数：n-结点
 */
function getOffsetX(n){
    var node = n;
    var sum = node.offsetLeft;
    while(node.offsetParent){
        node = node.offsetParent;
        sum += node.offsetLeft;
    }
    return sum;
}

/*
函数：mySetVolumeBar
描述：设置音量条
参数：bgLen - 音量条灰色背景的长度
 */
function mySetVolumeBar(bgLen){
    var oVolBackground = document.getElementById("volBarBackground");
    var oVolButton = document.getElementById("volButton");
    // var oControlVolume = document.getElementById("controlVolume");
    var oPlayer = document.getElementById("player");
    var oVolImg = document.getElementById("volImg");

    var oldLen = parseInt(getComputedStyle(oVolBackground)["height"]);

    oVolBackground.style.height = bgLen + "px";
    oVolButton.style.top = bgLen - 4 + "px";

    // 根据需要变更音量图标
    if(oPlayer.volume == 0){
        oVolImg.style.backgroundImage = "url('./img/nv1.png')";
    }else{
        oVolImg.style.backgroundImage = "url(./img/v1.png)";
    }
    return oldLen;
}
/*
函数：initVol
描述：刷新页面是根据实际音量初始化音量条
 */
function initVol(){
    /* 初始化音量条 */
    var oPlayer = document.getElementById("player");
    var oVolBar = document.getElementById("volBar");

    var volProportion = 1 - oPlayer.volume;
    var maxLen = parseInt(getComputedStyle(oVolBar)["height"]);
    var bgLen = maxLen * volProportion;

    mySetVolumeBar(bgLen);
}
/*
函数：setProgress
描述：根据视频已播放比例设置进度条
参数：progress - 已播放视频时间比 [0,1]
 */
function setProgress(progress){
    var oPlayer = document.getElementById("player");
    var oBarButton = document.getElementById("barButton");
    var oAllBar = document.getElementById("allBar");
    var oPlayerBar = document.getElementById("playerBar");
    //alert(oPlayer.duration);
    // 设置视频进度
    oPlayer.currentTime = oPlayer.duration * progress;
    //alert(oPlayer.currentTime);
    // 设置进度条和按钮
    // var barLen = parseInt(getComputedStyle(oAllBar)["width"]) * progress;
    //alert(barLen);
    oPlayerBar.style.width = progress * 100 + "%";
    oBarButton.style.left = progress * 100 + "%";
    // console.log(getComputedStyle(oPlayBar)["width"], getComputedStyle(oBarButton)["left"]);
}
/*
函数：dragProgress
描述：绑定拖动进度条触发事件
 */
function dragProgress(){
    var oControlBar = document.getElementById("controlBar");

    oControlBar.onmousedown = function(evt){
        var e = evt || window.event;
        if(e.button == 0){
            leftX = getOffsetX(oControlBar);
            rightX = leftX + parseInt(getComputedStyle(oControlBar)["width"]);

            document.addEventListener("mousemove", toDragProgress);
        }
    };

    document.addEventListener("mouseup", function(){
        document.removeEventListener("mousemove", toDragProgress);
    })
}
/*
函数：toDragProgress
描述：拖动进度条触发的事件
 */
function toDragProgress(evt){

    var e = evt || window.event;
    var buttonX = e.pageX;
    if(buttonX < leftX)
        buttonX = leftX;
    if(buttonX > rightX)
        buttonX = rightX;
    var prog = (buttonX - leftX) / (rightX - leftX);
    // console.log(prog);
    setProgress(prog);
}
/*
函数：setFullScreen
描述：设置播放窗口全屏或退出全屏
 */
function setFullScreen(){
    var oFullScreen = document.getElementById("fullScreen");
    var oPlayerFrame = document.getElementById("playerFrame");
    oFullScreen.onclick = function(){
        // 要考虑浏览器兼容问题
        if(isFullScreen()){
            if(document.exitFullScreen) {
                document.exitFullScreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if(document.msExitFullscreen) {
                document.msExitFullscreen();
            }

        }else{
            if (oPlayerFrame.requestFullscreen)
                oPlayerFrame.requestFullscreen();
            else if(oPlayerFrame.webkitRequestFullscreen)
                oPlayerFrame.webkitRequestFullscreen();
            else if(oPlayerFrame.mozRequestFullScreen)
                oPlayerFrame.mozRequestFullScreen();
            else if(oPlayerFrame.msRequestFullscreen)
                oPlayerFrame.msRequestFullscreen();
            //controlInFullScreen();
        }
    };
    window.onresize = function(){
        if (isFullScreen())
            controlInFullScreen();
        else
            controlNotInFullScreen();
    }
}
/*
函数：isFullScreen
描述：判断当前页面是否全屏
返回值：true-全屏，false-非全屏
 */
function isFullScreen() {
    return document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.webkitFullScreen ||
        document.msFullScreen;
}
// function hideControl(){
//
// }
function showControl(){
    //console.log("wrong");
    var oController = document.getElementById("controller");

    clearTimeout(hide_control);

    oController.style.display = "block";

    //clearTimeout(hide_control);
    hide_control = setTimeout(function(){
        oController.style.display = "none";
        //console.log("Over");
    }, 1000);
}
/*
函数：controlInFullScreen
描述：控制栏在全屏下的状态
 */
function controlInFullScreen(){
    var oController = document.getElementById("controller");
    var oPlayerArea = document.getElementById("playerArea");

    oController.style.backgroundColor = "rgba(100, 100, 100, 0.3)";
    ///console.log("TTT");
    oController.style.display = "none";
    oPlayerArea.style.height = "100%";


    document.addEventListener("mousemove", showControl);
    oController.onmouseover = function(){
        document.removeEventListener("mousemove", showControl);
        ///console.log("H");
        clearTimeout(hide_control);
    };
    oController.onmouseout = function () {
        document.addEventListener("mousemove", showControl);
    }
}
/*
函数：controlNotInFullScreen
描述：推出全屏时恢复控制栏的状态
 */
function controlNotInFullScreen(){
    var oController = document.getElementById("controller");
    var oPlayerArea = document.getElementById("playerArea");

    oController.style.backgroundColor = "rgba(30, 30, 30, 1)";
    oController.style.display = "block";
    oPlayerArea.style.height = "calc(100% - 40px)";

    document.removeEventListener("mousemove", showControl);
    oController.onmouseover = null;
}
/*
函数：setNextVideo
描述：点击“下一集”按钮时触发事件，未完成
 */
function setNextVideo() {
    var oPlayerNext = document.getElementById("playerNext");
    oPlayerNext.onclick = function(){

    }
}
/*
函数：getTime
描述：把输入的秒数转化为“分钟:秒”
参数：t - 秒数
返回：“分钟:秒”
 */
function getTime(t){
    var min =  getNumInTwoDigit(Math.floor(t / 60));
    var sec = getNumInTwoDigit(Math.floor(t % 60));
    return min + ":" + sec;
}
/*
函数：getNumInTwoDigit
描述：把数字转化为至少两位数的字符串
返回：(string)
 */
function getNumInTwoDigit(n){
    if(n==0)
        return "00";
    else if(n <= 9)
        return "0" + n;
    else
        return "" + n;
}
/*
函数：createMyVideoControl
描述：
 */
function createMyVideoControl(){
   // var oPlayer = document.getElementById("player");


    clickScreen();
    clickPlayBtn();
    setVolume();
    setFullScreen();
    dragProgress();
    setNextVideo();

    setInterval("updateProgressBar()", 1000);
}
window.onload = function(){
    createMyVideoControl();
};