function admira_api_content(){
    // -------------------------------------------------------------------------------------------------- //
    // THIS IS THE CLIENT API TO INCLUDE ON HTML CONTENTS INSIDE PLAYER TO TALK TO ApiContentConnector.js //
    // -------------------------------------------------------------------------------------------------- //

    var self = this;
    this.ready = false;
    this.api_connector = "player.admira.com";
    this.token = "";

    // API_DURATION Gets {command:this.API_DURATION,params:{duration:15}}
    this.API_DURATION = 0;
    // API_FINISH Gets {command:this.API_FINISH}
    this.API_FINISH = 1; // Is it really useful ?
    // API_CONDITION Gets {command:this.API_CONDITION,params:{'id': 0,'filename':"lat.xml",'value':24.123}}
    this.API_CONDITION = 2;
    // API_WRITE_FILE Gets {command:this.API_WRITE_FILE,params:{'path': "./",'filename':"test.txt",'text':"hello world!"}}
    this.API_WRITE_FILE = 3;
    // API_TOUCH Gets {command:this.API_TOUCH,params:{'id': 0,'filename':"lat.xml",'value':24.123}}
    this.API_ANALYTIC = 4;
    // API_PLAY : TO-DO
    this.API_PLAY = 5;
    // API_PLAY : TO-DO
    this.API_MAIN_DURATION = 6;
    // API_READ_FILE Gets {command:this.API_READ_FILE,params:{'path': "./",'filename':"test.txt",callback:"callback_name"}}
    this.API_READ_FILE = 7;
    // API_PLAYER_INFO Gets {command:this.API_PLAYER_INFO}
    this.API_PLAYER_INFO = 8;
    // API_PRELOAD_NEXT -> Preloads next content.
    this.API_PRELOAD_NEXT = 9;
    // API_LOG send logs.
    this.API_LOG = 10;
    this.API_NOTIFY = 11;
    // API_DELETE_FILE Gets {command:this.API_DELETE_FILE,params:{'path': "./",'filename':"test.txt",recursive:false,callback:"callback_name"}}
    this.API_DELETE_FILE = 12;
    // API_DELETE_FILE Gets {command:this.API_OS_FUNCTION,params:{'function_name': "name_of_function",callback:"callback_name",'params':[]}} NOTE : Array of 3 on params MAX accepted
    this.API_OS_FUNCTION = 13;
        
    window.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    this.observer =  new MutationObserver(function(mutations) {
        var status = "";
        for(var i=0;i<mutations.length;i++){
            if(mutations[i].attributeName == "style"){
                status = mutations[i].target.style.visibility;
                break;
            }
        }
        if(status == "visible"){
            self.onStart();
        }
    });

    this.onMessage = function(event){
        var message = false;
        try{
            message = JSON.parse(event.data);
        }catch(e){
            console.log("ApiContentEvent : Not valid Message");
        }
        if(message){
            if(message.destination == self.token){
                self.onEvent(message);
            }else{
                if(self.token == ""){
                    if(message.action == "new_token" || message.action == "load_token"){
                        self.token = message.destination;
                        self.ready = true;
                        var target = window.parent.document.getElementById(message.destination);
                        var config = {
                            attributes: true,
                        };
                        self.observer.observe(target,config);
                        self.onReady();
                                                if(target.style.visibility == "visible"){
                                                    self.onStart();
                                                }
                    }else{
                                            console.log("ApiContentEvent : Action : "+message.action);
                                        }
                }else{
                                    console.log("ApiContentEvent : Token : "+self.token);
                                }
            }
        }
    };
    
    window.addEventListener("message", this.onMessage,false);   

    this.onReady = function(){
        console.log("admira_api_content - Ready");
        // OVERRIDE
    };

    this.onStart = function(){
        console.log("admira_api_content - Content Started");
        // OVERRIDE
    };

    this.onEvent = function(event){
        console.log("admira_api_content - Event : "+event.action+":"+event.msg);
        // OVERRIDE
    };

    this.send = function(action,command){
        if(typeof(command) === "undefined"){command = "";}
        var message = {
            destination: self.api_connector,
            action: action,
            api: command
        };
        window.postMessage(JSON.stringify(message),"*");
    };

    this.unload = function(){
        window.removeEventListener("message",self.onMessage);
        self.observer = null;
    };

    this.send("request_token");
    
}

window.onunload = function(){
    console.log("Unloading ...");
    var maxId = setTimeout(null, 0);
    for(var i=0; i < maxId; i+=1) { 
            clearTimeout(i);
    }
    maxId = null;
}
