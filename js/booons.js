// --------------------------------------------------------------------------
// main setup function 
// --------------------------------------------------------------------------


function setApp(sSelectedState, sGroupname, sUsername){
// TODO: get actual deviceid!
	var sMethode		= 'getgroup';
	var sAuthkey 		= 'IDKFA';
	var sQueryString 	= 'authkey='+ sAuthkey +'&groupname='+ sGroupname +'&method='+sMethode;
	var sHashKey 		= "";
	var sHashKey 		= CryptoJS.SHA1(sQueryString).toString();
	  
	  $.getJSON( "http://www.booons.nl/api10/api10.asp?jsoncallback=?", {
	    authkey: sAuthkey,
	    groupname: sGroupname,
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
					var iMinutesSince = (data.group.minutessince);
					var aUsers = (data.group.users);
					var iUserCount = aUsers.length;
					var iPointCount = 0;
					var iUserPoints = 0;

					//Count point total in group and determine user points
					aUsers.forEach( function (arrayItem)
					{
						if (sUsername == arrayItem.username) {
							iUserPoints = arrayItem.pointbalance;
						};
					   iPointCount = iPointCount + arrayItem.pointbalance;
					});
				
					setNor(iMinutesSince, iUserCount, iPointCount, iUserPoints);
					setState('sst_nor');
			}
		}
	)
};


// --------------------------------------------------------------------------
// interface functions 
// --------------------------------------------------------------------------

	//set the defaults on the home page
	function setUserDefaults(sUsername, sGroupname)  {
		$("#inp_username").val(sUsername);
		$("#inp_groupname").val(sGroupname);
	}

	//Set the open round page
	function setOro(iRoundTimer, iOrderTotal, iUsertotal, iAmbushTotal) {
		setRoundTimer(iRoundTimer);
		log(iOrderTotal+ ' out of '+iUsertotal+' Orders, '+ (iUsertotal-iOrderTotal) +' to go');
		log('ambushes: '+iAmbushTotal);
	}
	
	//Set no open round page
	function setNor(iMinutesSince, iUserCount, iPointCount, iUserPoints) {
		$('#lbl_minutessince').text(iMinutesSince);
		$('#lbl_groupusers').text(iUserCount);
		$('#lbl_grouppoints').text(iPointCount);
		$('#lbl_userpoints').text(iUserPoints);
		
		log('last round was '+ iMinutesSince +'min ago');
		log('Number of users in group: '+ iUserCount);
		log('user has'+ iUserPoints +' point');
}
	
	// Process the old state and move to the next
	function processState(sSelectedState, sUsername, sGroupname) {
		toggleOverlay('in', 'loader');
		$('.app_page').hide();
		$('.app_error').hide();
		switch(sSelectedState) {
			case 'sst_srd':
				startRound(sGroupname, sUsername);
				sSelectedState = 'sst_pro';
				setApp(sSelectedState, sGroupname, sUsername);
				log('PROCESS: round');
				break;
			default:
			loginUser();
			setApp(sSelectedState, sGroupname, sUsername);
//			sSelectedState = 'sst_oro';
		}	
	}
	
	// Set states of the application
	function setState(sState, sGroupname) {
		var sTitleLabel = '';
		var sButtonLabel1 = '';
		var sButtonLabel2 = '';
		var sPagename = '';
		sButtonTargetState = '';
		log('state is: '+sState);

		switch(sState) {
			case 'sst_nor':
				sTitleLabel = sGroupname;
				sButtonLabel1 = 'start round';
				sButtonLabel2 = '';
				sPagename = 'nor';
				sButtonTargetState = 'sst_srd';
				break;
			case 'sst_oro':
				sTitleLabel = sGroupname;
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
				sButtonTargetState = '';
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
		toggleOverlay('out', 'loader');
	};

// --------------------------------------------------------------------------
// generic functions 
// --------------------------------------------------------------------------

	// Debug messages
	function log(sMessage) {
		console.log(sMessage);
	}

	function toggleOverlay(sDirection, sIdName) {
		// alert('toggle');
		if (sDirection == 'in') {
			$('#'+sIdName).fadeIn(50);
		} else {
			$('#'+sIdName).fadeOut(500);
		}
	}


// --------------------------------------------------------------------------
// single purpose functions
// --------------------------------------------------------------------------

	// Set the timer to the right amount of seconds and start countdown
	function setRoundTimer(iSecondsLeft) {
		iSecondsLeft = parseInt(iSecondsLeft);
		time=setInterval(function(){
			if (iSecondsLeft < 1) {
				clearInterval(time);
				alert('the end!');	
			} else {
				iSecondsLeft = iSecondsLeft - 1;
//				log('tik:'+ iSecondsLeft);
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