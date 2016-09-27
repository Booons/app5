// API functions 
function registerDevice(){
// TODO: get actual deviceid!
	var iDeviceId		= '01234567890123456789';
	var sMethode		= 'registerdevice';
	var sAuthkey 		= 'IDKFA';
	var sQueryString 	= 'authkey='+ sAuthkey + '&deviceid='+ iDeviceId +'&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( "http://www.booons.nl/api10/api10.asp?jsoncallback=?", {
	    authkey: sAuthkey,
	    deviceid: iDeviceId,
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
			if(typeof data.user != 'undefined'){
				log(data);
				// Set username and group to default
				setUserDefaults(data.user.username, data.user.groupname);
			} else {
				log('result of '+ sMethode +' is: undefined or null');					
			};
		}
	)
};

function setUserDefaults(sUsername, sGroupname)  {
	$("#inp_username").val(sUsername);
	$("#inp_group").val(sGroupname);
	log('I have just set the defaults');
}
				


function loginUser(){
// TODO: get actual deviceid!
	var iDeviceId		= '012345678';
	var sUsername		= $('#inp_username').val();
	var sGroupname		= $('#inp_groupname').val();
	var sMethode		= 'loginuser';
	var sAuthkey 		= 'IDKFA';
	var sQueryString 	= 'authkey='+ sAuthkey + '&deviceid='+ iDeviceId +'&username='+ sUsername +'&groupname='+ sGroupname +'&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( "http://www.booons.nl/api10/api10.asp?jsoncallback=?", {
	    authkey: sAuthkey,
	    deviceid: iDeviceId,
	    username: sUsername,
	    groupname: sGroupname,
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
			log('login done man!');
		}
	)
};

function getGroup(){
// TODO: get actual deviceid!
	var sMethode		= 'examplejson';
	var sAuthkey 		= 'IDKFA';
	var sQueryString 	= 'authkey='+ sAuthkey +'&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( "http://www.booons.nl/api10/api10.asp?jsoncallback=?", {
	    authkey: sAuthkey,
	    method: sMethode,
	    hashKey: sHashKey
	  })
	    .done(function( data ) {
			log(data);
			if(typeof data.group.round != 'undefined'){

				var iRoundTimer = parseInt(data.group.round.timer);
				log(iRoundTimer);
				var iOrderTotal = 2;
				var iUsertotal = 3;
				var iAmbushTotal = 2;
				
				setOro(iRoundTimer, iOrderTotal, iUsertotal, iAmbushTotal);
				setState('sst_oro');
			} else {
				setState('sst_nor');
			}
		}
	)
};

function setOro(iRoundTimer, iOrderTotal, iUsertotal, iAmbushTotal) {
	setRoundTimer(iRoundTimer);
	log(iOrderTotal+ ' out of '+iUsertotal+' Orders, '+ (iUsertotal-iOrderTotal) +' to go');
	log('ambushes: '+iAmbushTotal);
}

// Debug messages
function log(sMessage) {
	console.log(sMessage);
}

// Process the old state and move to the next
function processState(sSelectedState) {
	log('-----------> process some shit!');
	getGroup();
				log('this is the data:');
//			log(dataGroup);
	setState(sSelectedState);
}


// Set states of the application
function setState(sState) {
	var sTitleLabel = '';
	var sButtonLabel1 = '';
	var sButtonLabel2 = '';
	var sPagename = '';
	sButtonTargetState = '';
	log('state is: '+sState);

	switch(sState) {
		case 'sst_nor':
			sTitleLabel = '[groupname]';
			sButtonLabel1 = 'start round';
			sButtonLabel2 = '';
			sPagename = 'nor';
			sButtonTargetState = 'oro';
			break;
		case 'sst_oro':
			sTitleLabel = '[groupname]';
			sButtonLabel1 = 'order';
			sButtonLabel2 = '';
			sPagename = 'oro';
			sButtonTargetState = 'sst_pro';
			break;
		case 'sst_pro':
			sTitleLabel = 'select product';
			sButtonLabel1 = 'to options';
			sButtonLabel2 = '';
			sPagename = 'pro';
			sButtonTargetState = 'sst_opt';
			break;
		case 'sst_opt':
			sTitleLabel = 'Product options';
			sButtonLabel1 = 'order';
			sButtonLabel2 = '';
			sPagename = 'opt';
			sButtonTargetState = 'sst_oro';
			break;
		default:
			sTitleLabel = 'login';
			sButtonLabel1 = 'lets play'
			sButtonLabel2 = ''
			sPagename = 'home';
			sButtonTargetState = 'sst_oro';
	}
	$('.app_page').hide();
	$('.app_error').hide();
	$('#pag_'+sPagename).show();
	log('show page: '+sPagename);
	$('.app_titleLabel').text(sTitleLabel);
	$('.app_button1').text(sButtonLabel1);
	log('set title to: '+sTitleLabel);
	log('set statetarget to: '+sButtonTargetState);
	$(".app_button1").attr('state',sButtonTargetState);

};



// Set the timer to the right amount of seconds and start countdown
function setRoundTimer(iSecondsLeft) {
	iSecondsLeft = parseInt(iSecondsLeft);
	time=setInterval(function(){
		if (iSecondsLeft < 1) {
			clearInterval(time);
			alert('the end!');	
		} else {
			iSecondsLeft = iSecondsLeft - 1;
			log('tik:'+ iSecondsLeft);
			$('#lbl_roundtimer').text(iSecondsLeft);
		}
	},1000);				

}

// Get a GET param from the url
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
	
}