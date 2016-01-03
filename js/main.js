window.onload = function () {
    // TODO:: Do your initialization job

	var AUDIO_DESTINATION_DIRECTORY = '/opt/usr/media/Sounds';
	
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
    
   // document.addEventListener('models.stream.ready', onStreamReady);

    // Sample code
    var textbox = document.querySelector('.contents');
    textbox.addEventListener("click", function(){
    	box = document.querySelector('#textbox');
    	box.innerHTML = box.innerHTML == "Basic" ? "Sample" : "Basic";
    	
        //    
    	startRecording();
        
    });
    
    var busy = false;
    var audioControl = null;
    
    console.log('request media');
    navigator.webkitGetUserMedia({audio:true}, registerStream, function(error){
    	console.log('error user media:' + error.message);
    });
    
    function registerStream(mediaStream) {
    	console.log('register stream');
        navigator.tizCamera.createCameraControl(
            mediaStream,
            onAudioControlCreated,
            onAudioControlError
        );
    }
    
    function onAudioControlCreated(control) {
        audioControl = control;
        console.log('ready');
    }

    function onAudioControlError(error) {
        console.log(error);
    }
    
    function startRecording() {
    	console.log("start recording");
        var settings = {},
            fileName = '';

        if (busy) {
            return false;
        }

        
        
        var stopRequested = false;
        busy = true;
        fileName = 'audio.amr';
        audioPath = AUDIO_DESTINATION_DIRECTORY + '/' + fileName;

        settings.fileName = fileName;
        settings.recordingFormat = 'amr';

        audioControl.recorder.applySettings(
            settings,
            onAudioSettingsApplied,
            onAudioSettingsError
        );
        
        setTimeout(
        	function(){
               stopRecording();
               testPost();
            }, 5000
        );

 
    }
    
    function postVoice(){
    
    }
    
    function onAudioSettingsApplied() {

    }
    
    function onAudioSettingsError(error) {
        console.error('settings.error');
        busy = false;
    }
    
    function stopRecording() {
    	console.log("stop recording");
        audioControl.recorder.stop(
            onAudioRecordingStopSuccess,
            onAudioRecordingStopError
        );
    }

    function onAudioRecordingStopSuccess() {
        busy = false;
    }
    
    function onAudioRecordingStopError() {
        busy = false;
    }
    
    
    function testPost(){
    	var url = "http://attdevtest.mybluemix.net/voice";
    	  var xhr = new XMLHttpRequest();
    	  
    	  var fileName = 'audio.amr';
          var audioPath = AUDIO_DESTINATION_DIRECTORY + '/' + fileName;
          
          console.log('file open');
          tizen.filesystem.resolve(
        		    'file://' + audioPath,
        		    function(dir) {
        		        var documentsDir = dir;

        		        if (dir != null) {
        		            dir.openStream(
        		                "rw",
        		                function(fs) {
        		                    var bt = fs.readBytes(dir.fileSize);
        		                    console.log(bt);
        		        
        		                    fs.close();
        		                },
        		                function(e) {
        		                    console.log("Error " + e.message);
        		                }
        		            );
        		        }

        		    },
        		    function(e) {
        		        console.log("Error" + e.message);
        		    }, "rw"
        		);
          
          
          
          
          /*
    	
    	  xhr.open('POST', url, true);
    	  xhr.onload = function(e) {
    	    console.log('onload:' + e);
    	  };
    	  xhr.onreadystatechange = function() {
    		    if (xhr.readyState == 4 && xhr.status == 200) {
    		    	console.log('true:' + xhr.responseText);
    		    }
    		    console.log( 'scode:' + xhr.status + ', ready state' + xhr.readyState);
    		};

    	  xhr.setRequestHeader('Content-Type','audio/wav');
    	  
    	  xhr.send(null);  //
    	  */
    	
    }
    
    function testHhr() {
    	var url = "http://attdevtest.mybluemix.net/";
  	  var xhr = new XMLHttpRequest();
  	
  	  xhr.open('GET', url, true);
  	  xhr.onload = function(e) {
  	    console.log('onload:' + e);
  	  };
  	  xhr.onreadystatechange = function() {
  		    if (xhr.readyState == 4 && xhr.status == 200) {
  		    	console.log('true:' + xhr.responseText);
  		    }
  		    console.log( 'scode:' + xhr.status + ', ready state' + xhr.readyState);
  		};

  	 // xhr.setRequestHeader('Content-Type','audio/wav');
  	 // xhr.setRequestHeader('Access-Control-Allow-Origin','*');
  	  xhr.send(null);  //
    	
    }  
};
