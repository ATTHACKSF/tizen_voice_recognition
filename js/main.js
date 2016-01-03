window.onload = function () {
    // TODO:: Do your initialization job

	var AUDIO_DESTINATION_DIRECTORY = '/opt/usr/media/Sounds';
	var fileName = 'audio.amr';
	var fileFormat = 'amr';
    var busy = false;
    var audioControl = null;
	
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
    
    // TODO 度々失敗するので、再起動すれば治る
    navigator.webkitGetUserMedia({audio:true}, registerStream, function(error){
    	console.log('error user media:' + error.message);
    });

    // test用ボタンイベント
    var textbox = document.querySelector('.contents');
    textbox.addEventListener("click", function(){
    	box = document.querySelector('#textbox');
    	box.innerHTML = box.innerHTML == "Basic" ? "Sample" : "Basic";
    	
        //    
    	startRecording();
    });

    console.log('request media');
    
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
        var settings = {};

        if (busy) {
            return false;
        }

        var stopRequested = false;
        busy = true;
        
        audioPath = AUDIO_DESTINATION_DIRECTORY + '/' + fileName;

        settings.fileName = fileName;
        settings.recordingFormat = fileFormat;

        audioControl.recorder.applySettings(
            settings,
            onAudioSettingsApplied,
            onAudioSettingsError
        );
      
        audioControl.recorder.start(function(){
        	console.log('recording success start');
        }, function(){
        	console.log('failed to start recording');
        });
        
        setTimeout(
        	function(){
               stopRecording();
               uploadAudioFile();
            }, 5000
        );
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
    
    
    function uploadAudioFile(){
    	  var url = "http://attdevtest.mybluemix.net/voice";
    	  ur = "http://localhost:6001/voice";
    	  var xhr = new XMLHttpRequest();
    	  
          var audioPath = AUDIO_DESTINATION_DIRECTORY + '/' + fileName;
          
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
        		                    console.log(typeof(bt));
        		        
        		          //          var array = $.map(bt, function(value, index) {  return [value + "\n"];  });
        		                    var array = [];
        		                    for(var i=0; i< bt.length; i++) {
        		                    	array[i] = [bt[i] +  "\n"]   
        		                    }
        		                    var blob = new Blob(array, {type : 'audio/mpeg'});
        		                    
        		                    xhr.open('POST', url, true);
        		                    xhr.onload = function(e) {
        		                    	console.log('onload:' + e);
        		                    };
        		                    xhr.onreadystatechange = function() {
        		            		    if (xhr.readyState == 4 && xhr.status == 200) {
        		            		    	console.log('true:' + xhr.responseText);
        		            		    }
        		            		    console.log( 'scode:' + xhr.status + ', ready state' + xhr.readyState);
        		            		    console.log('true:' + xhr.responseText);
        		            		};
        		                    var formData = new FormData();
        		                
        		                    formData.append("FileUploadControl", blob, "mmm.wav");
        		               //   formData.append("__VIEWSTATE", "jjj=");
        		               //    formData.append("UploadButton", "Upload");

        		            		xhr.setRequestHeader('Content-Type','audio/AMR');
        		            	  
        		            		xhr.send(formData);  //
        		                    fs.close();
        		                },
        		                function(e) {
        		                    console.log("Error:" + e.message);
        		                }
        		            );
        		        }

        		    },
        		    function(e) {
        		        console.log("Error" + e.message);
        		    }, "rw"
        		);
    }
};
