var Song = Song || {},
	percent,
    tracks = [],
            songList = [];;

function newSong(resource, location, songList){
	Song = soundManager.createSound({
     	id: 'rtmpPlayer',
      	serverURL: resource,
      	url: location,
        autoLoad: true,
        autoPlay: true,
	});


	Song.play({
	  whileplaying: function() {
	    // demo only: show sound position while playing, for context
	    //soundManager._writeDebug(Math.round(this.position/1000));
	    percent = (this.position/this.duration)*100;
	    progress(percent);
        
	  },
	  onfinish: function() {
        progress(0);
        playNext(songList);
	  }
	});	
	scrub();
};

function progress(percent) {
	if (percent > 0){
	    var angle = percent * 360 / 100;
	    $('.scrub').show();
	    $('.scrubHide').addClass('fixes');
	    $('.spin').css('-webkit-transform', 'rotate(' + angle + 'deg)');
	    if (percent > 50) {
	        $('.scrubFill').css('opacity', '1');
	        $('.scrubHide').css('opacity', '0');
	    } else {
	        $('.scrubFill').css('opacity', '0');
	        $('.scrubHide').css('opacity', '1');
	    }
	}
}

function playNext(songList) {
    console.log(songList);
            if(songList.length>0){  
                Song.destruct();
                //Choose Random Song & Cut from array
                randomSong = Math.floor(Math.random()*songList.length);
                currentSong = songList[randomSong];
                songList.splice($.inArray(songList[randomSong], songList),1);
                $.getJSON("https://partner.api.beatsmusic.com/v1/api/tracks/"
                    + currentSong
                    + "/audio?bitrate=highest&acquire=5&access_token="
                    + accesstoken,
                     function(data){
                            newSong(data.data.location, data.data.resource, songList);
                            $("#play").hide();
                            $("#pause").show();
                    }
                        
                );
            } else {
                 alert('eeee');
                Song.destruct();
                $("#mobileMenu").addClass('open');
                $("aside").addClass('open');
                $("#play").attr('data-status', 'inactive');
                $("div.spin").css('-webkit-transform','rotate(0deg)');
                $('#pause').hide();
                $("#play").show();
            }
        }

function scrub() {
    var rewindStart = false,
        center,
        a,
        b,
        deg,
        degToPer,
        position;

    $('.playerInner').mousedown(function (e) {
        e.preventDefault();
        rewindStart = true;
    });

    $('.playerInner').mousemove(function (e) {
        if (rewindStart) {
            var offset = $('.playerInner').offset();
            center = {
                top: offset.top + $('.playerInner').outerHeight() / 2,
                left: offset.left + $('.playerInner').outerWidth() / 2
            };

            a = center.left - e.pageX;
            b = center.top - e.pageY;

            deg = Math.atan2(a, b) * 180 / Math.PI;

            if (deg < 0) {
                deg = 360 + deg;
            }

            degToPer = 100 * (360 - deg) / 360;
            position = Song.duration * degToPer / 100;
            Song.setPosition(position);
        }
    });

    $(document).mouseup(function () {
        rewindStart = false;
    });
}

