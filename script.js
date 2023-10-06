var developing = false;

// const IS_PROD = false; // print console logs
var updateTimeSeconds = 1000; // Tiempo de actualización en milisegundos (1000ms = 1s)
//var plvId = window.parent.player.config.getId();
//if(developing) console.log("PLV ID: " , plvId);
var contentId = "";
var historyPage = new Array();
var fordwardPage = new Array();
var loadingPage = false;
// var plvId = 114911;

// var time_to_clear_prices_m = time_to_clear_prices * 1000;
// var api_check_interval_m = api_check_interval * 1000;
// var time_check_connection_m = time_check_connection * 1000;

var retryInitInterval = false;

var my_api = null;

var loadedLink = 0;
var linkLoaded = false;
var jsonReaded = false;
var loadToolbarPage = false;
var dataJson = "";
var loadLinkRetry = 0;
var home = "https://www.tous.com/es-es/colecciones-bolsos-omnio";
// var home = "http://127.0.0.1:8080/tous/proxy.php?url=https://tous.com/es-es/colecciones-bolsos-omnio";
var lastPage = home;
var actualPage = home;
var countTime = 0;
var userInteract = false;
var interval; // setInterval para contar segundos
var jsonUrl = "https://www.tous.com/kiosk/tous_305.json";

var timeout = 30; //tiempo de actualización en segundos (300 = 5 min)
var timeToHome = timeout;

var defaultNavigation = "es";
var navigationLanguage = defaultNavigation;
var timeAction = defaultNavigation;
var inLanguages = false;

function on_load() {
	//if(developing) console.log("on_load");

	printBase();

	var self = this; self.name = "DisplayWebElement"; // MANDATORY
	getJson();
	/*
	my_api = new admira_api_content();
	my_api.onReady = function() {
		if(developing) console.log("Ready !");
		// loadLink("0", home);
		my_api.send("api_command", {
			command: my_api.API_PLAYER_INFO,
			params: {
				'callback': "onGetInfo"
			}
		});
	};
	my_api.onStart = function() {
	//     console.log("Start !");
	};
	my_api.onEvent = function(e) {
		try {
			// console.log("HTMLContent Event : " + e.action + " Destination : " + e.destination);
			// console.log(e.msg);
		    
			if (e.action == my_api.API_READ_FILE) {
				if (typeof(e.msg.callback) !== "undefined") {
					eval(e.msg.callback)(e.msg);
				}
			}
			if (e.action == my_api.API_PLAYER_INFO) {
				if (typeof(e.msg.callback) !== "undefined") {
					eval(e.msg.callback)(e.msg.data);
				}
			}
		} catch (err) {
			console.log(err);
			if (e.msg) {
				eval(onGetInfo)(e.msg);
			}
		}
	};
	*/
}

this.onElementLoadComplete = function (event) {
	try {
		// console.log("onElementLoadComplete...", this, $(this));

		if (typeof ($(this)) !== "undefined") {
			if (typeof ($(this)[0]) !== "undefined") {
				if (typeof ($(this)[0].contentWindow) !== "undefined") {
					$(this)[0].contentWindow.addEventListener("click", onMouseEvent, false);
					$(this)[0].contentWindow.addEventListener("mousedown", onMouseEvent, false);
					$(this)[0].contentWindow.addEventListener("mouseup", onMouseEvent, false);
					$(this)[0].contentWindow.addEventListener("mouseclick", onMouseEvent, false);
					$(this)[0].contentWindow.addEventListener("mousemove", onMouseEvent, false);
					$(this)[0].contentWindow.addEventListener("touchstart", onTouchEvent, false);
					$(this)[0].contentWindow.addEventListener("touchend", onTouchEvent, false);
					$(this)[0].contentWindow.addEventListener("touchcancel", onTouchEvent, false);
					$(this)[0].contentWindow.addEventListener("touchleave", onTouchEvent, false);
					$(this)[0].contentWindow.addEventListener("touchmove", onTouchEvent, false);
					$(this)[0].contentWindow.addEventListener("focus", onMouseEvent, false);
					$(this)[0].contentWindow.addEventListener("focusin", onMouseEvent, false);
					$(this)[0].contentWindow.addEventListener("focusout", onMouseEvent, false);
					$(this)[0].contentWindow.addEventListener("blur", onMouseEvent, false);
				}
			}
		}
	} catch (err) {
		console.log("onElementLoadComplete ERROR: ", err.message);
	}
}

function checkDisclaimer() {
	try {
		clearTimeout(timer_disclaimer);

		if (typeof ($("#load_link")[0].contentWindow.document) !== null) {
			$($("#load_link")[0].contentWindow.document).find(".cookie-disclaimer").remove();
		}

		if (!loadingPage && (historyPage[historyPage.length - 1] != document.querySelector("#load_link").contentWindow.location.href)) {
			if (historyPage.length >= 7) {
				historyPage.shift();
			}
			var pageToAdd = "";
			if (document.querySelector("#load_link").contentWindow.location.href == "about:blank") {
				pageToAdd = home;
			} else {
				pageToAdd = document.querySelector("#load_link").contentWindow.location.href;
			}

			historyPage.push(pageToAdd);
			actualPage = pageToAdd;
		}

		timer_disclaimer = setTimeout(checkDisclaimer, 500);
	} catch (err) {
		clearTimeout(timer_disclaimer);
		timer_disclaimer = setTimeout(checkDisclaimer, 500);
	}
}

timer_disclaimer = setTimeout(checkDisclaimer, 500);

function loadLink(link_id, link_url) {
	try {

		// window.location.href = link_url;

		if (developing) console.log("loadLink", "width", $(document).width(), "height", $(document).height());
		loadedLink = link_id;

		$("#load_link").on("load", self.onElementLoadComplete);
		$("#load_link").attr("src", link_url);
		$("#loaded_content").css("width", $(document).width());
		$("#loaded_content").css("height", $(document).height());
		$("#loaded_content").show();
		loadLinkRetry++;

		document.querySelector("#load_link").addEventListener("load", function (e) {
			if (developing) console.log("loadLink linkLoaded", linkLoaded, jsonReaded);
			linkLoaded = true;
			if (linkLoaded && jsonReaded && !loadToolbarPage) {
				doCookies(dataJson);
			}

			// console.log($(e.target)[0].contentDocument.cookie, document.querySelector("#load_link").contentDocument.cookie);
		});

	} catch (err) {
		console.log("Error loading link: " + err.message);
	}
}

function goPage(link_url) {
	if (developing) console.log("goPage", link_url);
	loadToolbarPage = true;
	$("#load_link").attr("src", link_url);
	$("#loaded_content").css("width", $(document).width());
	$("#loaded_content").css("height", $(document).height());
	$("#loaded_content").show();
	lastPage = actualPage;
	actualPage = link_url;
}

function goHome(url) {
	if (developing) console.log("goHome", url);
	lastPage = actualPage;
	actualPage = url;
	// fordwardPage.push(historyPage[historyPage.length-1]);
	$("#load_link").attr("src", url);
	$("#loaded_content").css("width", $(document).width());
	$("#loaded_content").css("height", $(document).height());
	$("#loaded_content").show();

	userInteract = false;
}

function goBack() {
	try {

		var lastPageAux = home;

		if (historyPage.length > 0) {
			var urlArrAux = historyPage[historyPage.length - 1].split("#");
			if (typeof urlArrAux[1] != "undefined") {
				historyPage = historyPage.filter(function (a) { return a !== urlArrAux[0] })
			}

			lastPage = historyPage.pop();
			lastPageAux = historyPage[historyPage.length - 1];
			if (typeof lastPageAux == "undefined") {
				lastPageAux = home;
			}
			if (developing) console.log("DEV newArray", historyPage);
		}

		if (developing) console.log("DEV goBack: ", lastPageAux);
		loadingPage = true;

		$("#load_link").on("load", function () {
			loadingPage = false;
		});

		$("#load_link").attr("src", lastPageAux);
		$("#loaded_content").css("width", $(document).width());
		$("#loaded_content").css("height", $(document).height());
		$("#loaded_content").show();
	} catch (err) {

	}
}

function goFordward() {
	if (developing) console.log("goFordward", lastPage);

	$("#load_link").on("load", function () {
		loadingPage = false;
	});

	if (typeof lastPage != "undefined" && lastPage != "" && lastPage != document.querySelector("#load_link").contentWindow.location.href) {
		if (developing) console.log(lastPage);
		loadingPage = true;
		$("#load_link").attr("src", lastPage);
		$("#loaded_content").css("width", $(document).width());
		$("#loaded_content").css("height", $(document).height());
		$("#loaded_content").show();
	}
}

$(window).resize(function () {
	$("#loaded_content").css("width", 0);
	$("#loaded_content").css("height", 0);
	$("#loaded_content").css("width", $(document).width());
	$("#loaded_content").css("height", $(document).height());
});

function onGetInfo(data) {
	if (developing) console.log("onGetInfo");

	try {
		if (developing) console.log(data, data.PlayerController, data.PlayerController.player_id);
		if (data.PlayerController && data.PlayerController.player_id) {
			plvId = data.PlayerController.player_id;
			contentId = data.PlayerController.PlaylistController.scene.content_id;

			getJson();
		}
	} catch (e) {
		clearTimeout(retryInitInterval);
		retryInitInterval = setTimeout(function () {
			my_api.send("api_command", {
				command: my_api.API_PLAYER_INFO,
				params: {
					'callback': "onGetInfo"
				}
			});
		}, 10000);
	}
}


// Función para establecer una cookie
// cookie_name, cookie_value, cookie_domain, cookie_path, cookie_expiration
function setCookie(params) {
	try {
		if (developing) console.log("setCookie: ", params);
		if (checkCookieFormat(params)) {
			if (developing) console.log("checkCookieFormat OK", 'action' in params, params['action']);
			// var fecha = new Date();
			// fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
			// if(action == "delete"){
			// 	var expira = "expires=Thu, 01 Jan 1970 00:00:01 GMT";
			// }else{
			// 	var expira = "expires=" + fecha.toUTCString();
			// }
			if ('action' in params && typeof params['action'] != "undefined" && params['action'] == "delete") {
				if (developing) console.log("ELIMINANDO ...", params['cookie_name'] + "=delete" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT");
				document.querySelector("#load_link").contentDocument.cookie = params['cookie_name'] + "=delete" + ";domain=" + params['cookie_domain'] + ";path=" + params['cookie_path'] + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
			} else {
				var expires = params['cookie_expiration'];
				document.querySelector("#load_link").contentDocument.cookie = params['cookie_name'] + "=" + params['cookie_value'] + ";domain=" + params['cookie_domain'] + ";path=" + params['cookie_path'] + ";expires=" + expires;
			}
		} else {
			console.log("No se ha podido añadir/eliminar la cookie...", params);
		}
	} catch (err) {
		console.log("Error setting cookie: " + err, params);
	}
}

function checkCookieFormat(params) {
	if (developing) console.log("checkCookieFormat");
	var result = true;
	var cookie_values = ['cookie_name', 'cookie_value', 'cookie_domain', 'cookie_path'];
	var cookie_values_delete = ['cookie_name', 'cookie_domain', 'cookie_path'];

	if (typeof (params) == 'object') {
		if ('action' in params && typeof params['action'] != "undefined" && params['action'] == 'delete') {
			$.each(cookie_values_delete, function (index, value) {
				if (developing) console.log(value, value in params, typeof params[value]);
				if (value in params == false || typeof params[value] == "undefined" || params[value] == '') {
					result = false;
				}
			});
		} else {
			$.each(cookie_values, function (index, value) {
				if (developing) console.log(value, value in params, typeof params[value]);
				if (value in params == false || typeof params[value] == "undefined" || params[value] == '') {
					result = false;
				}
			});
		}
	} else {
		result = false;
	}

	return result;
}

// Función para obtener el valor de una cookie
function getCookie(nombre) {
	try {
		var nombreCookie = nombre + "=";
		var cookies = document.querySelector("#load_link").contentDocument.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			while (cookie.charAt(0) == ' ') {
				cookie = cookie.substring(1);
			}
			if (cookie.indexOf(nombreCookie) == 0) {
				return cookie.substring(nombreCookie.length, cookie.length);
			}
		}
		return "";
	} catch (err) {
		return "";
		console.log("Error reading cookies.: " + err, nombre);
	}
}

// Función para editar una cookie existente
function editarCookie(nombre, nuevoValor, days, action) {
	if (getCookie(nombre) !== "") {
		setCookie(nombre, nuevoValor, days, action); // Actualiza la cookie con un nuevo valor y una fecha de expiración de 365 días
		console.log("Cookie editada con éxito.");
	} else {
		console.log("La cookie no existe.");
	}
}

// // Ejemplo de uso
// setCookie("miCookie", "valorInicial", 365); // Establece una cookie inicial
// console.log(getCookie("miCookie")); // Obtiene el valor de la cookie

 //editarCookie("miCookie", "nuevoValor"); // Edita la cookie existente
 //console.log(getCookie("miCookie")); // Obtiene el nuevo valor de la cookie


function getJson() {
	if (developing) console.log("getJson");
	// my_api.send("api_command", {command:my_api.API_READ_FILE,params:{'path': "content/" + contentId,'filename':"tous.json",callback:"getFileInfo"}});

	$.ajax({
		dataType: "json",
		url: jsonUrl,
		tryCount: 0,
		retryLimit: 3,
		success: function (data) {
			if (typeof (Storage) !== "undefined") {
				localStorage.setItem("json_info", JSON.stringify(data));
			}

			console.log(data)
			getFileInfo(data);
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log(xhr, xhr.status, textStatus, errorThrown)
			this.tryCount++;
			if (this.tryCount <= this.retryLimit) {
				if (textStatus == 'timeout') {

					//try again
					console.log("Retry AJAX JSON (timeout) " + this.tryCount);
				}
				if (xhr.status == 500) {
					//handle error
					console.log("Error 500 getting json: " + errorThrown);
				} else {
					//handle error
					console.log("Error getting json: " + errorThrown);
				}

				$.ajax(this);
				return;
			} else {
				if (typeof (Storage) !== "undefined") {
					if (localStorage.getItem("json_info")) {
						config_file = JSON.parse(localStorage.getItem("json_info"));

						getFileInfo(config_file);
					}
				}
			}
		}
	});
}

function toTimestamp(year, month, day, hour, minute, second) {
	var datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
	return datum.getTime() / 1000;
}

function makeMeTwoDigits(n) {
	return (n < 10 && n.toString().length < 2 ? "0" : "") + n;
}

function getFileInfo(data) {
	try {
		// var data = JSON.parse(data.data);
		dataJson = data;

		readJson(dataJson);

		jsonReaded = true;
		if (developing) console.log("getFileInfo jsonReaded", linkLoaded, jsonReaded);
		if (linkLoaded && jsonReaded && !loadToolbarPage) {
			doCookies(dataJson);
		}

		startInterval();
	} catch (err) {
		console.log("Error reading json file " + err.message);
	}
}

function readJson(dataJson) {
	//leer toda la info, guardarla en las variables y ejecutar las funciones
	console.log(dataJson)
	if (typeof (dataJson) == 'object') {
		if (developing) console.log("readJson", dataJson);

		try {
			// Lee del json el valor del idioma por defecto del toolbar
			var valid_default_navigation = true;
			if ('default_navigation' in dataJson && typeof dataJson['default_navigation'] != "undefined" && dataJson['default_navigation'] != '') {
				if (dataJson['default_navigation'].indexOf("@toolbar:") > -1) {
					var defaultNavigationAux = dataJson['default_navigation'].split("@toolbar:");
					if ($.isArray(defaultNavigationAux) && defaultNavigationAux.length == 2) {
						if (defaultNavigationAux[1] != "") {
							navigationLanguage = defaultNavigationAux[1];
						} else {
							valid_default_navigation = false;
						}
					} else {
						valid_default_navigation = false;
					}
				} else {
					valid_default_navigation = false;
				}
			} else {
				valid_default_navigation = false;
			}

			if (!valid_default_navigation) {
				console.log("Error al leer el idioma por defecto 'default_navigation' 1:", err);
				navigationLanguage = defaultNavigation;
			}
		} catch (err) {
			console.log("Error al leer el idioma por defecto 'default_navigation' 2:", err);
			// variable defaultNavigation setteada en este mismo .js
			navigationLanguage = defaultNavigation;
		}

		try {
			// Lee del json el valor del tiempo para volver al home
			if ('timeout' in dataJson && typeof dataJson['timeout'] != "undefined" && dataJson['timeout'] != '') {
				if (dataJson['timeout'] > 0) {
					timeToHome = dataJson['timeout'];
				} else {
					console.log("Error al leer el tiempo de reset por defecto 'timeout' 1:", err);
					timeToHome = timeout;
				}
			} else {
				console.log("Error al leer el tiempo de reset por defecto 'timeout' 2:", err);
				timeToHome = timeout;
			}
		} catch (err) {
			console.log("Error al leer el tiempo de reset por defecto 'timeout' 3:", err);
			// variable defaultNavigation setteada en este mismo .js
			timeToHome = timeout;
		}

		try {
			var valid_timeout_actions = true;
			if ('timeout_actions' in dataJson && typeof dataJson['timeout_actions'] != "undefined" && dataJson['timeout_actions'].length > 0) {
				if ($.isArray(dataJson['timeout_actions'])) {
					if (dataJson['timeout_actions'][0].indexOf("@toolbar:") > -1) {
						var defaultTimeActionsAux = dataJson['timeout_actions'][0].split("@toolbar:");
						if ($.isArray(defaultTimeActionsAux) && defaultTimeActionsAux.length == 2) {
							if (defaultTimeActionsAux[1] != "") {
								timeAction = defaultTimeActionsAux[1];
							} else {
								valid_timeout_actions = false;
							}
						} else {
							valid_timeout_actions = false;
						}
					} else {
						valid_timeout_actions = false;
					}
				} else {
					valid_timeout_actions = false;
				}
			} else {
				valid_timeout_actions = false;
			}

			if (!valid_timeout_actions) {
				console.log("Error al leer el idioma del toolbar por defecto 'timeout_actions' 1:", err);
				timeAction = defaultNavigation;
			}
		} catch (err) {
			console.log("Error al leer el idioma del toolbar por defecto 'timeout_actions' 2:", err);
			// variable defaultNavigation setteada en este mismo .js
			timeAction = defaultNavigation;
		}

		if ('navigation' in dataJson && typeof dataJson['navigation'] != "undefined" && dataJson['navigation'] != '') {
			if (developing) console.log("navigation: ", dataJson['navigation']);
			if ('css' in dataJson['navigation'] && typeof dataJson['navigation']['css'] != "undefined" && dataJson['navigation']['css'] != '') {
				$.each(dataJson['navigation']['css'], function (index, css_info) {
					if ('name' in css_info && typeof css_info['name'] != "undefined" && css_info['name'] != "") {
						if (css_info['name'].indexOf(':hover') > -1) { // PINTA LOS ELEMENTOS CON HOVER
							var css_info_name_hover = css_info['name'].replace(":hover", "");
							if ($(css_info_name_hover).length > 0) {
								$(css_info_name_hover).on("mouseover", function (e) {
									var elem = this;
									if ('styles' in css_info && typeof css_info['styles'] != "undefined" && css_info['styles'].length > 0) {
										$.each(css_info['styles'], function (index, value) {
											var attribute = value.split(":");
											if (attribute.length > 1) {
												if (attribute[1][attribute[1].length - 1] == ";") {
													var attr = attribute[0];
													var val = attribute[1].slice(0, -1);
													$(elem).css(attr, val);
												}
											}
										});
									}
								});
								$(css_info_name_hover).on("mouseleave", function (e) {
									var elem = this;
									if ('styles' in css_info && typeof css_info['styles'] != "undefined" && css_info['styles'].length > 0) {
										$.each(css_info['styles'], function (index, value) {
											var attribute = value.split(":");
											if (attribute.length > 1) {
												$(elem).css(attribute[0], "");
											}
										});
									}
								});
							}
						} else { // PINTA LOS ELEMENTOS DEL CSS
							if ('styles' in css_info && typeof css_info['styles'] != "undefined" && css_info['styles'].length > 0) {
								$.each(css_info['styles'], function (index, value) {
									var attribute = value.split(":");
									if (attribute.length > 1) {
										if (attribute[1][attribute[1].length - 1] == ";") {
											var attr = attribute[0];
											var val = attribute[1].slice(0, -1);
											$(css_info['name']).css(attr, val);
										}
									}
								});
							}
						}
					}
				});
			}

			if ('toolbars' in dataJson['navigation'] && typeof dataJson['navigation']['toolbars'] != "undefined" && dataJson['navigation']['toolbars'].length > 0) {
				$.each(dataJson['navigation']['toolbars'], function (index, toolbar) {
					var newToolbar = "";
					var newToolbarLeft = "";
					var newToolbarMiddle = "";
					var newToolbarRight = "";
					if ('id' in toolbar && typeof toolbar['id'] != "undefined" && toolbar['id'] != "" && 'home' in toolbar && typeof toolbar['home'] != "undefined" && toolbar['home'] != "" && 'buttons' in toolbar && typeof toolbar['buttons'] != "undefined" && toolbar['buttons'].length > 0) {
						if (developing) console.log("DEV toolbar", index, toolbar);
						newToolbar += `<div id="toolbar_` + toolbar['id'] + `" class="container toolbar_all">`;
						newToolbar += `<div style="position: absolute;" class="container toolbar">`;
						var isLeft = true;
						var isMiddle = true;
						var isRight = true;
						$.each(toolbar['buttons'], function (index_button, button) {
							if ('classname' in button && typeof button['classname'] != "undefined" && button['classname'] != ""
								&& 'position' in button && typeof button['position'] != "undefined" && button['position'] != ""
								&& 'text' in button && typeof button['text'] != "undefined" && button['text'] != ""
								&& 'type' in button && typeof button['type'] != "undefined" && button['type'] != "") {

								if (button['position'] == "left" && isLeft) {
									isLeft = false;
									newToolbar += `<div class="left"></div>`
								}
								if (button['position'] == "middle" && isMiddle) {
									isMiddle = false;
									newToolbar += `<div class="middle"></div>`
								}
								if (button['position'] == "right" && isRight) {
									isRight = false;
									newToolbar += `<div class="right"></div>`
								}
								switch (button['type']) {
									case "link":
										if ('link' in button && typeof button['link'] != "undefined" && button['link'] != "") {
											var onClick = "";
											var classNameExtra = "";
											switch (button['link']) {
												case "@back":
													onClick = `onclick="goBack()"`;
													break;
												case "@home":
													onClick = `onclick="goHome('` + toolbar['home'] + `')"`;
													classNameExtra = "goHomeClass";
													break;
												case "@forward":
													onClick = `onclick="goFordward()"`;
													break;
												default:
													onClick = `onclick="goPage('` + button['link'] + `')"`;
											}

											var className = "";
											if (button['classname'] != "") {
												className = "class='" + button['classname'] + " " + classNameExtra + "'";
											}
											var text = "";
											if (button['text'] != "") {
												//<i style="position:relative; top: -3px;" class="material-icons">arrow_back</i>
												text = button['text'];
											}
											if (button['position'] == "left") {
												newToolbarLeft += `<div ` + onClick + ` ` + className + `>` + text + `</div>`;
											}
											if (button['position'] == "middle") {
												newToolbarMiddle += `<div ` + onClick + ` ` + className + `>` + text + `</div>`;
											}
											if (button['position'] == "right") {
												newToolbarRight += `<div ` + onClick + ` ` + className + `>` + text + `</div>`;
											}
										}
										break;
									case "modal":
										if ('links' in button && typeof button['links'] != "undefined" && button['links'].length > 0) {
											var onClick = "";

											var className = "";
											if (button['classname'] != "") {
												className = "class='language " + button['classname'] + "'";
											}

											var text = "";
											if (button['text'] != "") {
												//<i style="position:relative; top: -3px;" class="material-icons">arrow_back</i>
												text = button['text'];
											}

											if (button['position'] == "left") {
												newToolbarLeft += `<div ` + onClick + ` ` + className + `>` + text + `</div>`;
											}
											if (button['position'] == "middle") {
												newToolbarMiddle += `<div ` + onClick + ` ` + className + `>` + text + `</div>`;
											}
											if (button['position'] == "right") {
												newToolbarRight += `<div ` + onClick + ` ` + className + `>` + text + `</div>`;
											}

											newToolbarRight += `<div class="all_languages">`;
											newToolbarRight += `<div class="languages container">`;

											$.each(button['links'], function (index_links, link) {
												var languageId = "";
												if (link['link'].indexOf("@toolbar:") > -1) {
													var defaultTimeActionsAux = link['link'].split("@toolbar:");
													if ($.isArray(defaultTimeActionsAux) && defaultTimeActionsAux.length == 2) {
														if (defaultTimeActionsAux[1] != "") {
															languageId = defaultTimeActionsAux[1];
														}
													}
												}
												newToolbarRight += `<div class="middle">`;
												newToolbarRight += `<div id="` + languageId + `" class="lang">` + link['text'] + `</div>`;
												newToolbarRight += `</div>`;
											});
											newToolbarRight += `</div>`;
											newToolbarRight += `</div>`;
										}
										break;
									default:
									//TODO: Error, no se pinta
								}
							}
						});
						newToolbar += `</div>`;
						newToolbar += `</div>`;
					}
					if (newToolbar != "") {
						$("#toolbars").append(newToolbar);
						if (newToolbarLeft != "") {
							$("#toolbars > #toolbar_" + toolbar['id']).find(".left").append(newToolbarLeft);
						}
						if (newToolbarMiddle != "") {
							$("#toolbars > #toolbar_" + toolbar['id']).find(".middle").append(newToolbarMiddle);
						}
						if (newToolbarRight != "") {
							$("#toolbars > #toolbar_" + toolbar['id']).find(".right").append(newToolbarRight);
						}
					}
				});

				$(".language").on("mouseenter", handlerIn);
				$(".language").on("mouseout", handlerOut);
				$(".language").on("click", function () {
					try {
						if ($(".all_languages").is(":visible")) {
							$(".all_languages").hide();
						} else {
							$(".all_languages").show();
						}
					} catch (err) {
						console.log("Error al intentar mostrar/ocultar el elemento $('.all_languages'): ", err);
					}
				});

				$(".toolbar_all").on("mouseover", languagesIn);

				$(".all_languages").on("mouseover", languagesIn);
				$(".all_languages").on("mouseleave", languagesOut);

				$(".all_content").on("mouseover", onMouseEvent);
				$(".all_content").on("click", onMouseEvent);

				$(".lang").on("click", function (e) {
					if (developing) console.log("LANG click", e);
					if (typeof e.currentTarget.id != "undefined") {
						$(".toolbar_all").hide();
						$("#toolbar_" + e.currentTarget.id).show();
						$("#toolbar_" + e.currentTarget.id).find(".goHomeClass").click();
					}
				});
			}
		}
	} else {
		console.log("El formato tous.json no es correcto");
	}

	if (developing) console.log("HOME: ", home);
	loadLink("0", home);

	$("#toolbars > div").hide();
	$("#toolbar_" + navigationLanguage).show();
}

function handlerIn() {
	// if(developing) console.log("handlerIn");
	$(".all_languages").show();
}

function handlerOut() {
	// if(developing) console.log("handlerOut");
	if (!inLanguages) {
		$(".all_languages").hide();
	}
}

function languagesIn() {
	inLanguages = true;
}

function languagesOut() {
	inLanguages = false;
	$(".all_languages").hide();
}

function doCookies(dataJson) {
	if (developing) console.log("doCookies", dataJson);
	var anyChange = false;
	if (typeof (dataJson) == 'object') {
		if ('cookies' in dataJson && typeof dataJson['cookies'] != "undefined" && dataJson['cookies'] != '') {
			$.each(dataJson['cookies'], function (index, value) {
				if ('action' in value && typeof value['action'] != "undefined" && value['action'] == 'delete') {
					if ('name' in value && typeof value['name'] != "undefined" && value['name'] != '') {
						if (developing) console.log("ELIMINAR", index, value, getCookie(value['name']));
						// Si existe la cookie...
						if (getCookie(value['name']) != "") {
							var params_cookie = {
								'cookie_name': value['name']
								, 'cookie_value': value['value']
								, 'cookie_domain': value['domain']
								, 'cookie_path': value['path']
								, 'action': "delete"
							};

							anyChange = true;
							setCookie(params_cookie);
						}
					}
				} else {
					if (getCookie(value['name']) == "") {
						if (developing) console.log("AÑADIR", index, value);
						var params_cookie = {
							'cookie_name': value['name']
							, 'cookie_value': value['value']
							, 'cookie_domain': value['domain']
							, 'cookie_path': value['path']
							, 'cookie_expiration': value['expire']
						};

						anyChange = true;
						setCookie(params_cookie);
					}
				}

			});
		}

		if (developing) console.log("anyChange", anyChange, "loadLinkRetry", loadLinkRetry);
		if (anyChange && loadLinkRetry < 2) {
			loadLink("0", home);
		}
	} else {
		console.log("El formato tous.json no es correcto");
	}

	return anyChange;
}

function resetCount() {
	if (countTime > 0) {
		countTime = 0;
	}
}

function onMouseEvent() {
	// if(developing) console.log("onMouseEvent");
	userInteract = true;
	// console.log("on MOUSE EVENT...", userInteract);
	resetCount();
}

function onTouchEvent() {
	// if(developing) console.log("onTouchEvent");
	userInteract = true;
	// console.log("on TOUCH EVENT...", userInteract);
	resetCount();
}

function checkHour() {
	try {
		countTime++;

		if (developing) console.log("DEV countTime:", countTime, "timeToHome:", timeToHome, "userInteract:", userInteract);
		if (countTime >= timeToHome) {
			// if(userInteract == true){
			if (developing) console.log("DEV goHome()");
			if (linkLoaded && jsonReaded) {
				if (developing) console.log("DEV doCookies()");
				doCookies(dataJson);
			}

			$("#toolbars > div").hide();
			$("#toolbar_" + timeAction).show();

			goHome(home);
			// my_api.send("api_command",{command:my_api.API_CONDITION,params:{'id': 14,'filename':"push_the_button.xml",'value':1}});
			window.parent.player.playlist.jump();
			// }else{
			//     countTime = 0;
			// }
		}
	} catch (err_msg) {
		console.log("Error Checking hour: " + err_msg);
	}
}

function startInterval() {
	clearInterval(interval);
	interval = setInterval(checkHour, updateTimeSeconds);
}
