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
	
	// Process the old state and move to the next
	function processState(sSelectedState) {
		$('.app_page').hide();
		$('.app_error').hide();
		switch(sSelectedState) {
			case 'sst_rnd':
				// This covers both oro as well as nor states
				log('PROCESS: round');
				break;
			default:
			log('PROCESS: default');
			loginUser();
			sSelectedState = 'sst_oro';
		}	
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

	};

// --------------------------------------------------------------------------
// generic functions 
// --------------------------------------------------------------------------

	// Debug messages
	function log(sMessage) {
		console.log(sMessage);
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