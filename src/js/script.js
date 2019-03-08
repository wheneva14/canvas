/**
 * Global variables
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
	initialDate = new Date(),

	$document = $(document),
	$window = $(window),
	$html = $("html"),

	livedemo = false,
	isDesktop = $html.hasClass("desktop"),
	isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
	isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
	isTouch = "ontouchstart" in window,
	c3ChartsArray = [],

	plugins = {
		rdNavbar: $(".rd-navbar"),
		responsiveTabs: $(".responsive-tabs"),
		
	};

	function setServiceWorker() {
		if ("serviceWorker" in navigator) {
		  console.log("Will the service worker register?");
		  navigator.serviceWorker
			.register("./sw.js")
			.then(function(reg) {
			  console.log("Yes, it did.");
			})
			.catch(function(err) {
			  console.log("No it didn't. This happened: ", err);
			});
		}
		
		// if($('#btnAdd').length){
		// 	let deferredPrompt;
		// 	window.addEventListener("beforeinstallprompt", e => {
		// 		// Prevent Chrome 67 and earlier from automatically showing the prompt
		// 		e.preventDefault();
		// 		// Stash the event so it can be triggered later.
		// 		deferredPrompt = e;
		// 		// Update UI notify the user they can add to home screen
		// 		btnAdd.style.display = "block";
		// 	});
		// 	btnAdd.addEventListener("click", e => {
		// 		// hide our user interface that shows our A2HS button
		// 		btnAdd.style.display = "none";
		// 		// Show the prompt
		// 		deferredPrompt.prompt();
		// 		// Wait for the user to respond to the prompt
		// 		deferredPrompt.userChoice.then(choiceResult => {
		// 		if (choiceResult.outcome === "accepted") {
		// 			console.log("User accepted the A2HS prompt");
		// 		} else {
		// 			console.log("User dismissed the A2HS prompt");
		// 		}
		// 		deferredPrompt = null;
		// 		});
		// 	});
		// 	window.addEventListener("appinstalled", evt => {
		// 		alert("a2hs", "installed");
		// 	});
		// }

	  }
/**
 * Initialize All Scripts
 */
$document.ready(function () {

	
	setServiceWorker();
	/**
	 * RD Navbar
	 * @description Enables RD Navbar plugin
	 */
	if (plugins.rdNavbar.length) {
		plugins.rdNavbar.RDNavbar({
			stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone")) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
			stickUpOffset: (plugins.rdNavbar.attr("data-stick-up-offset")) ? plugins.rdNavbar.attr("data-stick-up-offset") : 1,
			anchorNavOffset: -78
		});
		if (plugins.rdNavbar.attr("data-body-class")) {
			document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
		}
	}

		/**
	 * Responsive Tabs
	 * @description Enables Responsive Tabs plugin
	 */
	if (plugins.responsiveTabs.length) {
		var i = 0;
		for (i = 0; i < plugins.responsiveTabs.length; i++) {
			var $this = $(plugins.responsiveTabs[i]);
			$this.easyResponsiveTabs({
				type: $this.attr("data-type"),
				tabidentify: $this.find(".resp-tabs-list").attr("data-group") || "tab"
			});
		}
	}

});
