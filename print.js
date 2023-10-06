let page_link = 'https://www.tous.com/es-es/';
/*
function printBase(){	
	$("#all_content").append(
        // +`<img id="base" src="base.png" alt="RBI Popeyes" />`
		`<div id="toolbars" style="height:60px; width:100%; position:fixed; background-color:white; z-index: 10">`
		+ `</div>`
        +`<div id="loaded_content">`
        	//+`<iframe id="load_link" style="width:100%; height:100%" sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation allow-popups-to-escape-sandbox" nwdisable nwfaketop ></iframe>`
            +`<iframe id="load_link" src="https://www.tous.com/es-es/" style="width:100%; height:100%" nwdisable nwfaketop ></iframe>`
        +`</div>`
    );	
}
*/

function printBase(){	
    $("#all_content").append(
        // +`<img id="base" src="base.png" alt="RBI Popeyes" />`
		`<div id="toolbars" style="height:60px; width:100%; position:fixed; background-color:white; z-index: 10">`
		+ `</div>`
        +`<div id="loaded_content">`
        	//+`<iframe id="load_link" style="width:100%; height:100%" sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation allow-popups-to-escape-sandbox" nwdisable nwfaketop ></iframe>`
            +`<iframe id="load_link" src="${page_link}" style="width:100%; height:100%" nwdisable nwfaketop ></iframe>`
        +`</div>`
    );	
}
