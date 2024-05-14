class PhoneNetwork {
    constructor() {
    }

    //home, lex, rex, fpn, ppn, trun
    home  = {
        offhook: false,
        dialtone: false,
        connected: false,
        dailedNumber: "",
        number: "34893"
    };

    lex = {
        lineup: false,
        linesiezed: false
    }

    ppn = {
        number: "0016304852995"
    }

    fpn = {
        number: "0800890808"
    }

    eventcount = 0;

    updateStatus() {

        var divhook = document.getElementById("hook")
        var divdialtone = document.getElementById("dialtone")
        var divdialednumber = document.getElementById("dialednumber")
        var divconnected = document.getElementById("connected")


        if (this.home.offhook) {
            divhook.innerHTML = "Phone Reciever (Handset): Off Hook";
        } else {
            divhook.innerHTML = "Phone Reciever (Handset): On Hook";
        }    

        if (this.home.dialtone) {
            divdialtone.innerHTML = "Phone Audio: Dialtone present (buuuuuuurb)";
        } else {
            divdialtone.innerHTML = "Phone Audio: No dialtone (silent)";
        }    

        divdialednumber.innerHTML = "Dailed Number: "+this.home.dailedNumber+"";

        if (this.home.connected) {
            divconnected.innerHTML = "Connected to :"+this.home.dailedNumber;
        } else {
            divconnected.innerHTML = "Not connected";
        }    


    }

    processEvent (event) {

        var textboxt = document.getElementById("output")
        var divhook = document.getElementById("hook")
        var divdialtone = document.getElementById("dialtone")
        var divdialednumber = document.getElementById("dialednumber")
        var divconnected = document.getElementById("connected")
        var diveventlog = document.getElementById("eventlog")

        this.eventcount += 1;    
        
        console.log("New Event: "+this.eventcount+" "+event);

        if ((event.substring(0,2) == "SS") || (event.substring(0,4) == "DTMF" ) || (event.substring(0,2) == "R1")){
            // It's a tone!

            if ((this.home.offhook == false) ) {
                textboxt.innerHTML += "You may have tried dialing "+event+", or it may be background noise, either way the reciever is on the hook, so nothing happens<br/>";
                diveventlog.innerHTML += this.eventcount+" local phone heard "+event+" (ignored, onhook)<br/>";
                return;
            } else if (event.substring(0,4) == "DTMF" ) {
                    if (this.home.dialtone == true) {

                        this.home.dailedNumber += event.substring(4,5)
  //                      textboxt.innerHTML += "The Local exchange hears "+event+", it wonders if this might be a phone number you are dialing<br/>";
                        diveventlog.innerHTML += this.eventcount+" local phone heard "+event+" (forwarded to localexchange)<br/>";
                        diveventlog.innerHTML += this.eventcount+" local exchange heard "+event+ " (waiting for complete number)<br/>";
                        if (divdialednumber.style.display == "none") {
                            textboxt.innerHTML += "Congratulations! You have discovered the playing DTMF tones is just the sane result as pressing the number keys on your phone.<br/>";
                            divdialednumber.style.display = "block";
                        }            
                    } else {
//                        textboxt.innerHTML += "The Local exchange hears "+event+" but it as there is no dialtone, it should should not react to them.<br/>";      
                        if (this.home.connected) {
                            diveventlog.innerHTML += this.eventcount+" local phone heard "+event+" (ignored as no dialtone, forwarded to remote exchange)<br/>";
                        } else {
                            diveventlog.innerHTML += this.eventcount+" local phone heard "+event+" (ignored as no dialtone, not forwarded as no connection<br/>)";
                        }
                    }    

                    if ((this.home.dailedNumber != this.fpn.number.substring(0,this.home.dailedNumber.length)) && (this.home.dailedNumber != this.ppn.number.substring(0,this.home.dailedNumber.length))) {
                        textboxt.innerHTML += "Warning: You have dialed "+this.home.dailedNumber+" and this demo only supports two numbers. "+this.ppn.number+" and "+this.fpn.number+", so what you are doing probably isn't going to work.<br/>";  
                    }      

                } else if ((event.substring(0,2) == "SS" || event.substring(0,2) == "R1" )) {

                    if (this.home.connected) {
//                        textboxt.innerHTML += "The Local exchange hears "+event+" but it knows that as the whilst a call is connected, it shouldn't react to signalling tones.<br/>";
                        diveventlog.innerHTML += this.eventcount+" local phone heard "+event+" (ignored, forwarded to localexchange)<br/>";
                        diveventlog.innerHTML += this.eventcount+" local exchange heard "+event+ " (ignored as line is already connected to remote exchange)<br/>";


                    } else if (this.lex.lineup) {
                        if (this.lex.linesiezed) {

                        } else {
                            diveventlog.innerHTML += this.eventcount+" heard "+event+ "(ignored)<br/>";

                        }

                    }

                    if (this.home.dialtone == true) {
    //                    textboxt.innerHTML += "The Local exchange hears "+event+" but it knows that as the whilst there is a dialtone, it should generate signalling tones, not react to them.<br/>";  
                    } else if (this.home.connected == true) {
                    }       
                }

//            this.updateStatus();

                if ((this.home.dailedNumber == this.ppn.number) || (this.home.dailedNumber == this.fpn.number)) {

                    this.processEvent("Connected");

            }

            if (event == "Connected") {
                this.home.connected = true;
                this.home.dialtone = false;
                diveventlog.innerHTML += this.eventcount+" Local Phone <-> Local Exchange: "+event+".<br/>";

                if (divconnected.style.display == "none") {
                    textboxt.innerHTML += "Congratulations! You have dialed a number. Notice how unlike digital systems, there is no send button, the exchange decided when you had completed the number, not you.<br/>";
                    divconnected.style.display = "block";
                }

                if (this.home.dailedNumber == this.ppn.number) { 
                    textboxt.innerHTML += "You have connected to a paid number, I hope you have deep pockets, these used to cost a fortune!<br/>";
                }

                if (this.home.dailedNumber == this.fpn.number) { 
                    textboxt.innerHTML += "You have connected to a freephone number, these used to be dull (well, apart from 0800 60000006 which was BTs daily office news update!)<br/>";
                }

            }

            this.updateStatus();

        }

        if ((this.home.offhook == false) && ((event.substring(0,2) == "SS") || (event.substring(0,4) == "DTMF" ))) {
            textboxt.innerHTML += "You try dialing "+event+", but the reciever is on the hook, so nothing happens<br/>";
            return;

        }

        switch (event) {
            case "OffHook": 
            if (divhook.style.display == "none") {
                textboxt.innerHTML += "Congratulations! You have discovered how the reciever (handset) on a pre-digital phone works, if it is on the hook, nothing works, you need to lift if off the hook for anything useful to happen. You have also learnt that when you take a phone off the hook, you should be greeted with a dialtone.<br/>";
                divhook.style.display = "block";
                divdialtone.style.display = "block";
            } else {
                textboxt.innerHTML += "You lift the reciever and hear a dialtone<br/>";
            }    

            diveventlog.innerHTML += this.eventcount+" Local Phone: "+event+" <br/>";
            
            this.home.dialtone = true;
            this.home.connected = false; 
            this.home.dailedNumber = "";
            this.home.offhook = true;

            this.updateStatus();
            break;

        case "OnHook": 
            textboxt.innerHTML += "You put the reciever back down and no longer hear anything from the phone<br/>";
            divhook.innerHTML = "On Hook<br/>";
            divdialtone.innerHTML = "No dialtone present<br/>";
            this.home.dialtone = false;
            this.home.connected = false; 
            this.home.offhook = false;
            this.home.dailedNumber = "";

            diveventlog.innerHTML += this.eventcount+" Local Phone: "+event+" <br/>";


            this.updateStatus();
            break;  
        }

        

        
        
    }
  }