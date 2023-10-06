function firstLoad(){
    //loadAdmiraApiContent();
    loadJqueryJS();
}

/*
function loadAdmiraApiContent(){
    loadScript("admiraApiContentJs", "admira_api_content.js", function(){
        console.log("admira_api_content.js ...");
        loadJqueryJS();
    }); 
}
*/
function loadJqueryJS(){
    loadScript("jqueryJs", "jquery.js", function(){
        console.log("jquery.js loaded...");
        loadPrintJS();
    }); 
}

function loadSocketIOMin(){
    loadScript("socketJs", "socket_io_min.js", function(){
        console.log("socket_io_min.js loaded...");
        loadPopeyesJS();
    }); 
}

function loadScriptJS(){
    loadScript("scriptJs", "script.js", function(){
        console.log("script.js loaded...");
        loadStylesCSS();
    });
}

function loadPrintJS(){
    loadScript("printJs", "print.js", function(){
        console.log("print.js loaded...");
        loadScriptJS();
    });
}

function loadStylesCSS(){
	loadCSS("stylesCss", "styles.css", function(){
        console.log("styles.css ...");
        on_load();
    });
}

function loadScript(id, url, callback){

    console.log("loadScript ...");

    var script = document.createElement("script")
    script.id = id;
    // script.type = "text/javascript";

    var startInterval = "";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };

        script.onerror = function () {
            console.log("Error on loadScript ...",url);
            if(url == "socket_io_min.js"){
                clearTimeout(startInterval);
                console.log("retry load socket_io_min.js");
                startInterval = setTimeout(loadSocketIOMin, 10000);
            }else if(url == "popeyes.js"){
                clearTimeout(startInterval);
                console.log("retry load popeyes.js");
                startInterval = setTimeout(loadPopeyesJS, 10000);
            }else if(url == "jquery.js"){
                clearTimeout(startInterval);
                console.log("retry load jquery.js");
                startInterval = setTimeout(loadJqueryJS, 10000);
            }/*else if(url == "admira_api_content.js"){
                clearTimeout(startInterval);
                console.log("retry load admira_api_content.js");
                startInterval = setTimeout(loadAdmiraApiContent, 10000);
            }*/else if(url == "print.js"){
                clearTimeout(startInterval);
                console.log("retry load print.js");
                startInterval = setTimeout(loadPrintJS, 10000);
            }else if(url == "popeyes.css"){
                clearTimeout(startInterval);
                console.log("retry load popeyes.css");
                startInterval = setTimeout(loadPopeyesCSS, 10000);
            }
        };
    }

    script.src = url;
    if(url == "start.js"){
        try{
            if (document.getElementById(id)){
                var element = document.getElementById(id);
                element.parentNode.removeChild(element);
            }
            document.getElementsByTagName("body")[0].appendChild(script);
        }catch(err_msg){
            console.log("El fichero: " + url + " no se ha descargado");
        } 
    }else{
        try{
            if (document.getElementById(id)){
                var element = document.getElementById(id);
                element.parentNode.removeChild(element);
            }
            document.getElementsByTagName("head")[0].appendChild(script);
        }catch(err_msg){
            console.log("El fichero: " + url + " no se ha descargado");
        } 
    }
}

function loadCSS(id, url, callback){
    var cssId = id;
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.media = 'all';
    if (document.getElementById(cssId)){
        var element = document.getElementById(cssId);
        element.parentNode.removeChild(element);
    }
    head.appendChild(link);

    if (link.readyState){  //IE
        link.onreadystatechange = function(){
            if (link.readyState == "loaded" ||
                    link.readyState == "complete"){
                link.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        link.onload = function(){
            callback();
        };

        link.onerror = function () {
            console.log("Error on loadScript ...",url);
            if(url == "stylesheet.css"){
                clearTimeout(startInterval);
                console.log("retry load styles.css");
                startInterval = setTimeout(loadStylesCSS, 10000);
            }
        };
    }
}