(function(){
    let scrollPage = document.getElementById('scrollPage');
    scrollPage.style.visibility = "visible";
    let boxes = document.querySelectorAll('.scrollBox');
    let scrollTimeout = 0;
    let scrollInterval = 0;
    let wheelDelta = 0;
    let scrollIndex = 0;
    let targetTop = 0;
    let touchStartPoint = 0;
    let touchStartTop = 0;
    /*屏幕定位函数*/
    let scrollTo = function(jump){
        if(jump!==undefined){
            if(jump===scrollIndex){return;}
            scrollIndex = jump;
        }else {
            if(scrollTimeout||scrollInterval||(wheelDelta>0&&scrollPage.scrollTop==0)||(wheelDelta<0&&scrollPage.scrollTop+scrollPage.offsetHeight==scrollPage.scrollHeight)){return;}
            scrollIndex = wheelDelta>0?scrollIndex-1:scrollIndex+1;
        }
        targetTop = scrollIndex*scrollPage.offsetHeight;
        if(!(scrollTimeout||scrollInterval)){
            scrollTimeout = window.setTimeout(function(){
                scrollInterval = window.setInterval(function(){
                    let q = (targetTop-scrollPage.scrollTop)*0.25;//缓冲动画速度
                    scrollPage.scrollTop = scrollPage.scrollTop+q;
                    if(parseInt(q)==0){
                        scrollPage.scrollTop = targetTop;
                        window.clearInterval(scrollInterval);
                        scrollTimeout = 0;
                        scrollInterval = 0;
                    }
                },50);//帧速度
            },touchStartPoint?0:250);//使用鼠标滑轮时的延时响应（避免一次滚动多屏），如果是触屏滑动事件则不延时
        }
    };

    /*鼠标滚动事件*/
    scrollPage.addEventListener('mousewheel',function(e){
        wheelDelta = e.wheelDelta;
        scrollTo();
    } );

    /*触屏滑动事件*/
    scrollPage.addEventListener('touchstart',function(e){
        touchStartPoint = e.touches[0].pageY;
        touchStartTop = scrollPage.scrollTop;
        e.preventDefault();
    });
    scrollPage.addEventListener('touchend',function(e){
        wheelDelta = e.changedTouches[0].pageY-touchStartPoint;
        if(Math.abs(wheelDelta)>75){
            scrollTo();
        }else{
            scrollPage.scrollTop = touchStartTop;
        }
    });
    scrollPage.addEventListener('touchmove',function(e){
        if(!(scrollTimeout||scrollInterval)){
            scrollPage.scrollTop = touchStartTop+(touchStartPoint-e.changedTouches[0].pageY);
        }
    });
    /*定义右侧快速导航按钮*/
    let navBar = document.createElement("div");
    navBar.setAttribute("style","display:flex;flex-flow:column;align-items:center;justify-content:center;position:fixed;right:0px;top:50%;");
    for(let i=0;i<boxes.length;i++){
        let navButton = document.createElement("a");
        navButton.setAttribute("style","display:block;width:15px;height:15px;background:rgba(0,0,0,0.5);border-radius:100%;margin:10px;");
        navButton.index = i;
        navButton.addEventListener("click",function(){
            scrollTo(this.index);
        });
        let scrollListener = function(e){
            if(navButton.index==scrollIndex){
                navButton.style.background = "rgba(255,255,255,0.5)";
            }else{
                navButton.style.background = "rgba(0,0,0,0.5)";
            }
        };
        scrollListener();
        scrollPage.addEventListener("scroll",scrollListener);
        navBar.appendChild(navButton);
    }
    scrollPage.appendChild(navBar);
    navBar.style.marginTop = (navBar.offsetHeight/-2)+"px";
    let init = function(){
        for(let i=0;i<boxes.length;i++){
            let box = boxes[i];
            box.setAttribute("style","height:"+scrollPage.offsetHeight+"px;background:#"+((i+3)*123)+";color:#fff;display:flex;justify-content:center;align-items:center;flex-flow:column;text-align:center;");
        }
    }
    init();
    //窗口尺寸改变时重置模块高度以及定位
    window.addEventListener("resize",function(){
        init();
        scrollPage.scrollTop = scrollIndex*scrollPage.offsetHeight;;
    });
})();