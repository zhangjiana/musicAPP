/**
 * Created by Administrator on 15-10-15.
 */
$(function(){

    getSong();

    //myMusic();
    slide();
});

function myMusic(){

    var audio = document.getElementById('audio01');
    var music_list = document.getElementById('music_list');


    var music_del = document.getElementsByClassName('dust');

    var music_del_length = music_del.length;
    var play = document.getElementById('play');
    var pre = document.getElementById('pre');
    var next = document.getElementById('next');
    var singer = document.getElementById('singer');
    var stop = document.getElementById('stop');
    var n = 0  ;
    var oOrder = document.getElementById('order');

    var oProcess = document.getElementById('process');
    var oRange = oProcess.getElementsByTagName('input')[0];
    var oStarttime = oProcess.getElementsByTagName('span')[0];
    var oEndtime = oProcess.getElementsByTagName('span')[1];
    var starttime;
    var endtime;
    function _process(){
        oRange.value = audio.currentTime;
        oRange.onchange = function(){
             audio.currentTime = oRange.value;
        };
        audio.ontimeupdate = function(){
            //console.log((audio.currentTime));

            starttime = toD(parseInt((audio.currentTime/60)))+':'+toD(th_sec(parseInt(audio.currentTime)));
            oStarttime.innerHTML = starttime;
            oRange.value = audio.currentTime;
            endtime = toD(Math.floor((audio.duration - audio.currentTime)/60))+':'+toD(parseInt((audio.duration - audio.currentTime)%60));
            oEndtime.innerHTML = endtime;
        }
    }
    //�����������60,ȡ��;
    function th_sec(sec){
            if(sec > 60){
                return parseInt(sec%60);
            }
            else{
                return sec;
            }
    }


    _process();


    //ɾ��
    musicDel();
    function musicDel(){
        for(var i = 0 ;i <  music_del_length ; i++ ){
            music_del[i].index = i;
            music_del[i].onclick = function(){
                this.parentNode.remove();
                console.log(list_len);
            }
        }
    }



    var music_li = music_list.getElementsByTagName('li');

    var list_len = music_li.length;
    //console.log(list_len);
    //�������ѭ��;
    _loop();

    function _loop(){

        oOrder.onclick = function(){
            /*m++;
            if(m == 0){
                m = 1;
            }else{
                m = 0;
            }
            if(m == 0){
                audio.loop = true;
                oOrder.innerHTML = '����ѭ��';
            }else {
                oOrder.innerHTML = '˳��ѭ��';
                audio.addEventListener('ended',function(){
                    n++;
                    changePlay(n);
                })
            }*/
            alert('fe');
            if(audio.loop){
                audio.loop = true;
                oOrder.innerHTML = '����ѭ��';

            }else{
                oOrder.innerHTML = '˳��ѭ��';
                no_loop();
                }


        };
    }


    //����
    play.onclick = function(){

        //console.log(audio.duration);

        if(audio.paused){
            audio.play();

            play.firstChild.nextSibling.src = 'img/icon_pause.png';
        }else{
            audio.pause();
            play.firstChild.nextSibling.src = 'img/icon_play.png';
        }


    };
    //ֹͣ
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

    //��һ��
    pre.onclick = function(){
       if( n == 0){
           n = list_len;
       }
        n--;
        changePlay(n);

    };

    //��һ��
    next.onclick = function(){
        if( n == list_len-1 ){
            n = - 1;
        }
        n++;
        changePlay(n);
    };



    var oSinger = document.getElementById('singer');
    var singer_img = oSinger.getElementsByTagName('img')[0];
    function changePlay(n){
       var url = music_li[n].getAttribute('data-url');
        var img_url = music_li[n].getAttribute('data-icon');
        singer_img.src = img_url;
        changeBg(n);
        audioPlay(url);

    }

    //�ı䵱ǰ���Ÿ�������
    function changeBg(n) {

        for (var i = 0; i < list_len; i++) {
            //console.log(music_li[i]);
            //console.log(list_len);
            music_li[i].className = '';
        }
        music_li[n].className = 'active';
    }

    //��ȡ��ǰ���Ÿ������±�
    function getIndex(){

        for ( var i = 0; i < list_len ; i++){
            console.log(music_li[i].className);
            if(music_li[i].className == 'active')
            {
               return i;
            }

        }

    }


    //����
    function audioPlay(url){
        //console.log("now:"+n);
        audio.src = url;
        //console.log(url);
        //console.log(audio.src);
        audio.load();
        oRange.value = audio.currentTime;
        audio.autoplay = true;
        console.log(audio.currentTime);
        changeBg(n);
        play.firstChild.nextSibling.src = 'img/icon_pause.png';
    }
    //��ͣ
    function audioPause(){
        audio.pause();
       play.firstChild.nextSibling.src = 'img/icon_play.png';
    }




}

//�����¼�
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

    $my_Music.bind("swipeLeft",function(){
        $my_Music.animate({"left":"0","width":"100%"});
        $my_Side.animate({"left":"-50%","width":"50%"});
    });
}

//����JSON�ļ�
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


//ʹʱ������λ����������������ʾ��ǰʱ��һ��ʹ��
function toD(obj){
    if(obj<10){
        return '0'+obj
    }

    else{
        return ''+obj
    }
}
