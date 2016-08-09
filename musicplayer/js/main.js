function musicplayer(){
	var currType = 1
		audio = $('audio').get(0)
		clock = ''

	getChannel = function(type){ 
		$.ajax({
			url:'http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.billboard.billList&type='+type+'&size=10&offset=0',
			dataType: 'jsonp'
		})
		.done(function(response){
			//console.log(response)
			var num = Math.floor(Math.random()*10);
			var songId = response.song_list[num].song_id
			//console.log(songId)
			
			//getLyric(songId)
			var songStyle = response.song_list[num].style
			$('.musicStyle').text(songStyle)
							.attr('title',songStyle)
			var songName = response.song_list[num].title
			$('.songsName').text(songName)
						   .attr('title',songName)
			var songImg = response.song_list[num].pic_big
			$('.top-wrapper').css({
				'background':'url('+songImg+')',
				'background-repeat':'no-repeat',
				'background-position':'top',
				'background-size':'100%'
			})
			var singer = response.song_list[num].artist_name
			$('.singer').text(singer)
						.attr('title',singer)
			getMusic(songId)
			getLyric(songId)
		})
		.fail(function(){
			console.log("channel error")
		})
		.always(function(){
			console.log("complete")
		})


	}

 	
 	getMusic = function(songId){
 		$.ajax({
 			url:'http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.song.play&songid='+songId,
 			dataType: 'jsonp'
 		})
 		.done(function(data){
 			//console.log(data)
    		var src = data.bitrate.file_link;
    		//var songTime = data.bitrate.file_duration
    		//console.log(songTime)
    		//getLyric(songId)
   			$('audio').attr('src',src)
 		 })
 		.fail(function(){
   			console.log("play error")
 		 })
  		.always(function(){
   			console.log("complete")
  		 })
 	}

 	getLyric = function(songId){
 		$.ajax({
 			url:'http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.song.lry&songid='+songId,
 			dataType: 'jsonp'
 		})
 		.done(function(data){
 			//console.log(data)
 			var result = []
 			var lyric = data.lrcContent.split('\n')
 			var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g
 			for(var i = 0;i < lyric.length;i++){
 				var arr = []
 				var time = lyric[i].match(timeReg)
 				if(time === null){
 					break;
 				}
 				time = time[0]
 				time = time.substring(1,time.length-1)
 				
 				arr = time.split(':')
 				//console.log(arr)
 				var arrt = parseInt(arr[0],10)*60 + parseFloat(arr[1])
 				
 				//console.log(arrt)
 				var value = lyric[i].replace(timeReg,"")
 				result.push([arrt,value])
 				
 			}
 			relist = result
 			lyricList(result)
 			//setInterval(showLyric(result),100)
 			//console.log(result)
 		})
 		.fail(function(){
 			console.log("get lyric fail")
 		})
 		.always(function(){
 			console.log("complete")
 		})
 	}

 	lyricList = function(result){
 		if($('#lycul').text()){
 			$('#lycul').empty()
 		}
 		var showarr = result
 		if(!result){
 			$('#lycul').html('<li>本歌曲没有歌词</li>')
 		}else{
 			var lycLi = ""
 			for(var i = 0; i < result.length; i++){
 				lycLi += '<li data-time='+result[i][0]+'>'+result[i][1]+'</li>'
 			}
 			$('#lycul').append(lycLi)
 			setInterval(function(){showLyric(result)},100)
 		}
 	}

 	showLyric = function(result){
 		//console.log(result)
 		for(var i=0;i<result.length;i++){
 			//console.log(1)
 	
 			//console.log(h)
 			var at = audio.currentTime
 			//console.log(at)
 			var ct = $('#lycul li').eq(i).attr("data-time")
 			//console.log(ct)
 			var nt = $('#lycul li').eq(i+1).attr("data-time")
 			//console.log(nt)
 			if((at > ct)&&(at < nt)){
 				//console.log(1)
 				$('.lyric').stop(true,true).animate({"top": -21*(i-8)},500)
 				$('#lycul li').removeClass('active')
 				$('#lycul li').eq(i).addClass('active') 			}
 		}
 		//console.log(1)
 	}

 	//setInterval(showLyric(relist),100)
 	//进度条控制
 	setInterval(present,500)
 	$('.progress').mousedown(function(e){
 		//console.log(typeof(audio.currentTime))
 		audio.currentTime = audio.duration*((e.clientX-$(this).offset().left)/$(this).width())
 	})

 	function present(){
 		//console.log(2)
	var length = audio.currentTime/audio.duration*100;
	$('.curr').width(length+'%');//设置进度条长度
	//自动下一曲
	if(audio.currentTime == audio.duration){
		getChannel(currType)
	}
}


 	//事件绑定
 	$('.controlplay').on('click',function(){
 		if($('audio').get(0).paused){
 			$('audio').get(0).play()
 			$(this).removeClass('iconfont icon-play').addClass('iconfont icon-pause')
 		}else{
 			$('audio').get(0).pause()
 			$(this).removeClass('iconfont icon-pause').addClass('iconfont icon-play')
 		}
 	})

 	 $('.playnext').on('click',function(){
 		getChannel(currType)
 		if($('.controlplay').hasClass('iconfont icon-play')){
 			$('.controlplay').removeClass('iconfont icon-play').addClass('iconfont icon-pause')
 		}
 		//console.log(currType)
 	})


 	$('.randomplay').on('click',function(){
 		//console.log(1)
 		if($(this).hasClass('iconfont icon-random')){
 			$(this).removeClass('iconfont icon-random')
 				   .addClass('iconfont icon-loop')
 			  		$('audio').attr('loop','loop')
 		}else
 		if($(this).hasClass('iconfont icon-loop')){
 			$(this).removeClass('iconfont icon-loop')
 			       .addClass('iconfont icon-random')
 			$('audio').removeAttr('loop','')
 		}
 	})


 	$('.list').children().on('click',function(){
 		var type = $(this).attr('t-index')
 		getChannel(type)
 		$(this).addClass('list-style').siblings().removeClass('list-style')
 		currType = type;
 		if($('.controlplay').hasClass('iconfont icon-play')){
 			$('.controlplay').removeClass('iconfont icon-play').addClass('iconfont icon-pause')
 		}
 	})

 	$('.controlLyric').on('click',function(){
 		//console.log(1)
 		$('#lyric').toggleClass('show')
 		//$('#lycul').toggleAttr('display','none')
 	})

 	return getChannel
}

new musicplayer()(1)
