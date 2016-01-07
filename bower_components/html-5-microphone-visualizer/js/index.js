$(function () {
    "use strict";
    var path;
    var report = 0;

    var soundAllowed = function (stream) {
        //Audio stops listening in FF without // window.persistAudioStream = stream;
        //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
        //https://support.mozilla.org/en-US/questions/984179
        window.persistAudioStream = stream;


        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource( stream );
        var analyser = audioContent.createAnalyser();
        console.log(analyser);
        audioStream.connect(analyser);
        analyser.fftSize = 1024;
        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        // visualizer.setAttribute('viewBox', '0 0 255 255');


        var humanArr = [
          "#leftHuman01",
          "#leftHuman02",
          "#leftHuman03",
          "#rightHuman01",
          "#rightHuman02",
          "#rightHuman03"
        ] ;


        function u (){
          requestAnimationFrame(function update(){
            analyser.getByteFrequencyData(frequencyArray);
            TweenMax.to( "#mic", 0.1,{
              scale : .8 + frequencyArray[40] / 400 ,
              transformOrigin :(234/2) + " " + 234/2
            });
            u() ;
          });
        }
        u();



        var doDraw = function () {

            console.log ("--");
            for (var i = 0 , count = 0 ; i < 240; i+=40)
              TweenMax.to(humanArr[count++],.5,{y:-frequencyArray[i]});

            setTimeout (doDraw,500) ;
        }
        doDraw();
    }

    var soundNotAllowed = function (error) {
        // h.innerHTML = "You must allow your microphone.";
        console.log(error);
    }

    window.navigator = window.navigator || {};
    navigator.getUserMedia =  navigator.getUserMedia       ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia    ||
                              null;
    navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);

});
