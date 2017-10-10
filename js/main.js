let myAudio = $("audio")[0];

// play or pause
$(".btn1").click(function () {
  if (myAudio.paused) {
    play()
  } else {
    pause()
  }
});


function play() {
  myAudio.play();
  $('.btn1').removeClass('glyphicon-play').addClass('glyphicon-pause');
}

function pause() {
  $("audio")[0].pause();
  $('.btn1').removeClass('glyphicon-pause').addClass('glyphicon-play');

}

// next song

$(".btn3").click(function () {
  getmusic();
})


function getmusic() {
  $.ajax({
    url: 'http://api.jirengu.com/fm/getSong.php?channel=1',
    dataType: 'json',
    Method: 'get',
    success: function (res) {
      var resource = res.song[0],
        url = resource.url,
        cdPic = resource.picture,
        sid = resource.sid, // lylics 
        ssid = resource.ssid,
        title = resource.title,
        author = resource.artist;
      $('audio').attr('src', url);
      $('audio').attr('sid', sid);
      $('audio').attr('ssid', ssid);
      $('.musicname').text(title);
      $('.musicname').attr('title', title)
      $('.musicer').text(author);
      $('.musicer').attr('title', author);
      $(".cdImage").css({
        'background': 'url(' + cdPic + ')',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-size': 'cover'
      });
      play();
      getlyric();
    }

  })
}

function getlyric() {
  var Sid = $('audio').attr('sid');
  var Ssid = $('audio').attr('ssid');
  $.post('http://api.jirengu.com/fm/getLyric.php', {
      ssid: Ssid,
      sid: Sid
    })
    .done(function (lyr) {
      var lyr = JSON.parse(lyr);;
      if (!!lyr.lyric) {
        $('.music-lyric .lyric').empty();
        var line = lyr.lyric.split('\n');
        var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;
        var result = [];
        if (line != "") {
          for (var i in line) {
            var time = line[i].match(timeReg);
            if (!time) continue;
            var value = line[i].replace(timeReg, "");
            for (j in time) {
              var t = time[j].slice(1, -1).split(':');
              var timeArr = parseInt(t[0], 10) * 60 + parseFloat(t[1]);
              result.push([timeArr, value]);
            }
          }
        }
        //时间排序
        result.sort(function (a, b) {
          return a[0] - b[0];
        });
        lyricArr = result;
        // delete lyricArr[0];  //这样就会出现undefined
        lyricArr.shift()
        console.log(lyricArr);
        renderLyric();
      }
    }).fail(function () {
      $('.music-lyric .lyric').html("<li>歌词没有请求到，我的错，不如换首歌？？</li>");
    })
}

function renderLyric() { //添加出歌词li
  var lyrLi = "";
  for (let i = 0; i < lyricArr.length; i++) {
    lyrLi += "<li data-time='" + lyricArr[i][0] + "'>" + lyricArr[i][1] + "</li>";
  }
  $('.music-lyric .lyric').append(lyrLi);
  // append() 方法在被选元素的结尾插入指定内容。
  setInterval(showLyric, 100);
}

function showLyric() {
  // 得到li下 index = 5 的高度
  var liH = $(".lyric li").eq(5).outerHeight() - 3;
  for (var i = 0; i < lyricArr.length; i++) {
    //当前歌词和下一行歌词
    var curT = $(".lyric li").eq(i).attr("data-time");
    var nexT = $(".lyric li").eq(i + 1).attr("data-time");
    var curTime = myAudio.currentTime; //时间
    if ((curTime > curT) && (curT < nexT)) { //当前时间在下一句时间和歌曲当前时间之间的时候 就渲染 并滚动
      $(".lyric li").removeClass("active");
      $(".lyric li").eq(i).addClass("active");
      $('.music-lyric .lyric').css('top', -liH * (i - 2));
    }
  }

}


setInterval(present, 500)

function present() {
  let length = myAudio.currentTime / myAudio.duration * 100;
  $('.progressbar').width(length + '%')

  if (myAudio.currentTime == myAudio.duration) {
    getmusic() //自动播放
  }
}

$('.basebar').mousedown(function (event) {
  let x = event.clientX;
  console.log(x);
  console.log($(this).offset().left);
  let leftDistance = $(this).offset().left;
  let disPercetage = (x - leftDistance) / 4; //长度400除以100
  myAudio.currentTime = myAudio.duration * disPercetage / 100
})



$('.test1').click(function () {
  $('.test2').removeClass('active')
  $('.test1').addClass('active')
  $('.lyricPanel').addClass('nothing')
  $('.music-lyric').removeClass('hidden')
  $('.wrapper').addClass('hidden')
})
$('.test2').click(function () {
  $('.test1').removeClass('active')
  $('.test2').addClass('active')
  $('.lyricPanel').removeClass('nothing')
  $('.music-lyric').addClass('hidden');
  $('.wrapper').removeClass('hidden')
})



$(document).ready(getmusic())