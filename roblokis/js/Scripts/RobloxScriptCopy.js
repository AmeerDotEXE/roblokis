//this is an official Roblox script
//Modified by Ameer!(Ameer_Khalid)
//Modified to fix a bug where you keep open the desktop app even then join normally

(function() {
	function openDesktopUniversalApp() {
		const DUALaunchParams = {};
		const protocol = Roblox.ProtocolHandlerClientInterface.protocolNameForClient;
		DUALaunchParams.protocolName = protocol;
		DUALaunchParams.launchTime = new Date().getTime();
		DUALaunchParams.launchMode = 'app';
		DUALaunchParams.otherParams = {};
		DUALaunchParams.otherParams.browsertrackerid = Roblox.Cookies.getBrowserTrackerId();
		DUALaunchParams.otherParams.robloxLocale = Roblox.ProtocolHandlerClientInterface.robloxLocale;
		DUALaunchParams.otherParams.gameLocale = Roblox.ProtocolHandlerClientInterface.gameLocale;
		DUALaunchParams.otherParams.LaunchExp = '';

		// fire startClientAttempted
		$(Roblox.GameLauncher).trigger(Roblox.GameLauncher.startClientAttemptedEvent, {
			launchMethod: 'Protocol',
			params: DUALaunchParams
		});
		Roblox.GameLauncher.gameLaunchInterface.showDialog(() => {}, DUALaunchParams);
		// return the deferred object so we can continue chaining, if desired.
		return startGameFlow(DUALaunchParams);
	}
	function startGameFlow(gameLaunchParams) {
		return $.when(getAuthTicket(gameLaunchParams), resetClientStatus())
			.then(launchProtocolUrl, Roblox.GameLauncher.gameLaunchInterface.showLaunchFailureDialog)
			.then(waitForStatus)
			//.then(cleanUpAndLogSuccess, cleanUpAndLogFailure);
	}
	function getAuthTicket(gameLaunchDefaultParams) {
		let deferred = new $.Deferred();
		let gameLaunchParams = { ...gameLaunchDefaultParams };

		if (!Roblox.CurrentUser.isAuthenticated) {
			deferred.resolve(gameLaunchParams);
			return deferred;
		}

		return Roblox.ProtocolHandlerClientInterface.doAuthTicketRequest().then(function(data, textStatus, xhr) {
			const authenticationTicket = xhr.getResponseHeader('RBX-Authentication-Ticket');
			if (authenticationTicket && authenticationTicket.length > 0) {
				gameLaunchParams.gameInfo = authenticationTicket;
				deferred.resolve(gameLaunchParams);
			} else {
				deferred.reject();
			}

			return deferred;
		});
	}
	function resetClientStatus() {
		const url = Roblox.Endpoints.getAbsoluteUrl('/client-status/set?status=Unknown');

		return $.ajax({
			method: 'POST',
			url
		});
	}
	function launchProtocolUrl(gameLaunchParams) {
		const deferred = new $.Deferred();

		const urlSeparator = Roblox.ProtocolHandlerClientInterface.protocolUrlSeparator;
		let gameLaunchUrl = `${gameLaunchParams.protocolName}:`;
		const urlComponents = [];

		urlComponents.push(1); // protocol version parameter - used if we wish to significantly change the structure of the protocol url
		urlComponents.push(`launchmode:${gameLaunchParams.launchMode}`);

		// Studio will freeze at log-in if passed a guest ticket
		if (
			gameLaunchParams.gameInfo &&
			(gameLaunchParams.protocolName !== Roblox.ProtocolHandlerClientInterface.protocolNameForStudio ||
				gameLaunchParams.gameInfo.indexOf('Guest:') !== 0)
		) {
			urlComponents.push(`gameinfo:${encodeURIComponent(gameLaunchParams.gameInfo)}`);
		}

		if (Roblox.ProtocolHandlerClientInterface.protocolUrlIncludesLaunchTime) {
			urlComponents.push(`launchtime:${gameLaunchParams.launchTime}`);
		}

		if (Roblox.PlaceLauncher.Resources.IsProtocolHandlerBaseUrlParamEnabled === 'True') {
			const baseUrl = Roblox.EnvironmentUrls.websiteUrl || `https://${window.location.host}`;
			urlComponents.push(`baseUrl:${encodeURIComponent(baseUrl)}`);
		}

		$.each(gameLaunchParams.otherParams, (name, value) => {
			if (name === value) {
				// assume if name === value, just add name
				urlComponents.push(name);
			} else {
				urlComponents.push(`${name}:${encodeURIComponent(value)}`);
			}
		});

		gameLaunchUrl += urlComponents.join(urlSeparator);
		if (Roblox.GameLauncher.gameLaunchLogger) {
			Roblox.GameLauncher.gameLaunchLogger.logToConsole(
				`launchProtocolUrl: ${JSON.stringify({
					url: gameLaunchUrl,
					params: gameLaunchParams
				})}`
			);
		}
		// setLocationHref is used so that automated tests can intercept the protocol handler URL for verification.	Do not refactor without checking the tests.
		setLocationHref(gameLaunchUrl);

		deferred.resolve(gameLaunchParams);
		return deferred;
	}
	function setLocationHref(href) {
		if (
			Roblox.ProtocolHandlerClientInterface.protocolDetectionEnabled &&
			typeof navigator.msLaunchUri !== 'undefined'
		) {
			navigator.msLaunchUri(
				href,
				() => {},
				() => {}
			); // swallow errors
		} else {
			let iframe = $('iframe#gamelaunch');
			if (iframe.length > 0) {
				iframe.remove();
			}

			iframe = $("<iframe id='gamelaunch' class='hidden'></iframe>").attr('src', href);
			$('body').append(iframe);
			// for selenium
			const seleniumEvent = new Event('ProtocolLaunchStartSelenium');
			window.dispatchEvent(seleniumEvent);
		}
	}

	//this line allows me to open the desktop app whenever i want
	document.addEventListener("rk-desktopapp", openDesktopUniversalApp);
})();