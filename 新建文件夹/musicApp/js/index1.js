// JavaScript Document/**
 /* Created by Administrator on 15-10-15.
 */
$(function(){

    getSong();

    //myMusic();
    slide();
});

function myMusic(){

    var audio = document.getElementById('audio01');
    var music_list = document.getElementById('music_list');
    var music_li;
    var list_len;

    var music_del = document.getElementsByClassName('dust');

    var music_del_length = music_del.length;
    var play = document.getElementById('play');
    var pre = document.getElementById('pre');
    var next = document.getElementById('next');
    var oSinger = document.getElementById('singer');
    var singer_img = oSinger.getElementsByTagName('img')[0];

    var stop = document.getElementById('stop');
    var n = 0  ;
    var oOrder = document.getElementById('order');

    var oProcess = document.getElementById('process');
    var oRange = oProcess.getElementsByTagName('input')[0];
    var oStarttime = oProcess.getElementsByTagName('span')[0];
    var oEndtime = oProcess.getElementsByTagName('span')[1];
    var starttime;
    var endtime;

    updateSong();
    console.log(list_len);
    function _process(){
        oRange.value = audio.currentTime;

        oRange.onchange = function(){
             audio.currentTime = oRange.value;
        };
        audio.ontimeupdate = function(){
            //console.log((audio.currentTime));

            oRange.style.min = 0;

            oRange.style.max = audio.duration;
            oRange.value = audio.currentTime;

            starttime = toD(parseInt((audio.currentTime/60)))+':'+toD(th_sec(parseInt(audio.currentTime)));
            oStarttime.innerHTML = starttime;

            endtime = toD(Math.floor((audio.duration - audio.currentTime)/60))+':'+toD(parseInt((audio.duration - audio.currentTime)%60));
            oEndtime.innerHTML = endtime;
        }
    }
    //如果秒数大于60,取余;
    function th_sec(sec){
            if(sec > 60){
                return parseInt(sec%60);
            }
            else{
                return sec;
            }
    }


    _process();

     function slide_Del(){
         var $music_list = $("#music");
         var $music_li = $('#music_list li');
            $music_li.bind("swipeLeft",function(){
                console.log('fas');
                $(this).removeClass('swipeleft').addClass('swipeleft').siblings.removeClass('swipeleft');
            })
     }
    //删除
    //musicDel();
    function musicDel(){
        var k;
        for(var i = 0 ;i < list_len ; i++ ){
            music_del[i].index = i;
            music_del[i].onclick = function(){

                var k = this.parentNode;
                //k = this.index;
                //console.log($(this.parentNode));
                //$(this.parentNode).css({"-webkit-transform":"translate(-10%,0) skew(180deg,0)"});
               start(k);
                var timer = setInterval(updateSong,1);
                console.log(list_len);
                console.log(k);
            };
        }
        //自定义函数
        /*            被回调的方法
         */
        function testCallback(index,callback) {
           index.className = 'del';
            setTimeout(callback,1000);
            updateSong();
            return this;

        }
        /*
         被回调的函数
         */
        function _remove() {
           this.remove();
        }
        /*
         * 开始测试方法
         */
        function start(index) {
            testCallback(index,_remove);
        }
    }


    //删除音乐
   del_music();
    var timer = null;

    function del_music(){
        var this_song_index = null;
        var $music_del = $(".dust");
        $music_del.bind("click",function(){
                $(this).css("background","red");
                this_song_index = getIndex();
                if($(this).parent().index() == this_song_index){
                    alert('不能删除正在播放的歌曲');
                    $(this).css("display","none");
                }else{
                    $(this).parent().animate({"-webkit-transform":"translate(-100%,0)"},200,'ease-in',function(){

                        $(this).remove();
                        timer = setTimeout(updateSong,1) ;
                    });
                }
        });
        clearInterval(timer);//不起作用；

    }

    //鼠标左滑，删除图标出现；
    var $music_li = $("#music_list li");
    var $music_del = $(".dust");
    $music_li.bind('swipeLeft',function(){

        $(this).find('.dust').show().animate({"background":"rgba(9,4,2,0.4)","border-radius":"1rem","-webkit-transform":"translate(-20%,0)"},200)
    });

    //点击播放音乐
    clicik_music();

    function clicik_music(){
        for( var i = 0; i < list_len ;i ++){
            music_li[i].firstChild.nextSibling.index = i;

            music_li[i].firstChild.nextSibling.onclick = function(){

                n = this.index;

                changePlay(n);
               audio_Play();
            }
        }
    }


    //console.log(list_len);
    //更新歌曲列表
    function updateSong(){
         music_li = music_list.getElementsByTagName('li');

         list_len = music_li.length;
        for( var i = 0; i < list_len ; i++){
            music_li[i].firstChild.innerHTML = '';
            music_li[i].firstChild.innerHTML = i+1;
        }

            //console.log(n);
        //console.log(list_len);
    }


    //点击是否单曲循环;
    _loop();
    function _loop(){
        var m = 1;
        oOrder.onclick = function() {
            m++;
            if (m == 2) {
                oOrder.innerHTML = '单曲循环';
                audio.loop = true;
                m = 0;
            } else {
                oOrder.innerHTML = '顺序播放';
                audio.loop = false;
                m = 1;
            }
        };
        //console.log(audio.loop);
            if(audio.loop == false){
                audio.addEventListener('ended',function(){
                        n++;

                    console.log(list_len);
                    if( n == list_len-1){
                        n = 0;
                    }
                    console.log(n);
                    changePlay(n);
                });
            }else{
                audio.loop = true;
            }
    }

    //播放
    play.onclick = function(){
        //console.log(audio.duration);


            if(audio.paused){
                audio_Play();
            }else{
                audio_Pause();
            }



    };
    //停止
    stop.onclick = function(){
        var thisIndex = getIndex();
        console.log(thisIndex);
        var thisUrl = music_li[thisIndex].getAttribute('data-url');
            if( audio.paused){
                audioPlay(thisUrl);
            }else{
                audioPause();
            }
    };

    //上一曲
    pre.onclick = function(){
       if( n == 0){
           n = list_len;
       }
        n--;
        changePlay(n);
    };

    //下一曲
    next.onclick = function(){
        if( n == list_len-1 ){
            n = - 1;
        }
        n++;
        changePlay(n);
    };


    //改变当前播放歌曲

    function changePlay(n){

       var url = music_li[n].getAttribute('data-url');

        var img_url = music_li[n].getAttribute('data-icon');

        singer_img.src = img_url;
        for (var i = 0; i < list_len; i++) {
            music_li[i].className = '';
        }
        music_li[n].className = 'active';
        audio.src = url;
        audio.load();
        oRange.value = audio.currentTime;
        audio.autoplay = false;
        play.firstChild.nextSibling.src = 'img/icon_play.png';

    }

    //改变当前播放歌曲背景
    /*function changeBg(n) {
        for (var i = 0; i < list_len; i++) {
            music_li[i].className = '';
        }
        music_li[n].className = 'active';
    }*/

    //获取当前播放歌曲的下标
    function getIndex(){
        for ( var i = 0; i < list_len ; i++){
            //console.log(music_li[i].className);
            if(music_li[i].className == 'active')
            {
               return i;
            }
        }
    }
    //播放
   /* function audioPlay(url){
        //console.log("now:"+n);
        audio.src = url;
        //console.log(url);
        //console.log(audio.src);
        audio.load();
        oRange.value = audio.currentTime;
        audio.autoplay = true;

        changeBg(n);
        play.firstChild.nextSibling.src = 'img/icon_pause.png';
    }*/
    //暂停
    function audio_Pause(){
        audio.pause();
       play.firstChild.nextSibling.src = 'img/icon_play.png';
    }
    function audio_Play(){
        audio.play();
        play.firstChild.nextSibling.src = 'img/icon_pause.png';
    }
}

//滑动事件
function slide(){
    var $my_Music = $('#mymusic');
    var $my_Side = $('#aside');
    var $back = $("#back");

    $my_Music.bind("swipeRight",function(){
       swipe_Right();
    });
    $back.bind("click",function(){
        swipe_Right();
    });
    function swipe_Right(){
        $my_Music.animate({"left":"50%"});
        $my_Side.animate({"left":"0","width":"50%"});
    }
    $my_Side.bind("swipeLeft",function(){
        $my_Music.animate({"left":"0","width":"100%"});
        $my_Side.animate({"left":"-50%","width":"50%"});
    });
}

//解析JSON文件
function getSong(){
    $.getJSON('pbl.json',function(data){
        var $thisBox = $("#music_list");

        if(data.length){
            $thisBox.html("");
            $.each(data,function(i){

                var $oLi = $('<li data-url ="'+data[i].src+'" data-icon="'+data[i].img+'"></li>');
                if( i == 0){
                    $oLi.addClass('active');
                }
                $oLi.html('<h2>'+data[i].num+'</h2><p><span>'+data[i].musicName+'</span><span>'+data[i].name+'</span> </p> <span class="dust"> <img src="img/icon_dust.png"/> </span>')
                $thisBox.append($oLi);
            });
            myMusic();
        }

    })
}

//使时间以两位数输出，与上面的显示当前时间一起使用
function toD(obj){
    if(obj<10){
        return '0'+obj
    }
    else{
        return ''+obj
    }
}
