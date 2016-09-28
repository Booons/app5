// --------------------------------------------------------------------------
// API functions 
// --------------------------------------------------------------------------
function registerDevice(){
// TODO: get actual deviceid!
	var iDeviceId		= '012345678';
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
			log(data);
// -------- Set the defaults if there is a device in json response
			if(typeof data.device != 'undefined'){
				setUserDefaults(data.device.defaultuser, data.device.defaultgroup);
			}
// ---------
//other checks...



		}
	)
};

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
