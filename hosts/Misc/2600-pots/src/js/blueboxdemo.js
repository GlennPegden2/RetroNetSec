class PhoneNetwork {
    constructor() {
    }

    //home, lex, rex, fpn, ppn, trun
    home  = {
        offhook: false,
        dialtone: false,
        connect: false,
        dailedNumber : "",
        number: "34893"
    };

    ppn = {
        number: "0016304852995"
    }

    fpn = {
        number: "0800890808"
    }


    updateStatus() {

        var divhook = document.getElementById("hook")
        var divdialtone = document.getElementById("dialtone")
        var divdialednumber = document.getElementById("dialednumber")


        if (this.home.offhook) {
            divhook.innerHTML = "Off Hook<br/>";
        } else {
            divhook.innerHTML = "On Hook<br/>";
        }    

        if (this.home.dialtone) {
            divdialtone.innerHTML = "Dialtone present<br/>";
        } else {
            divdialtone.innerHTML = "No dialtone<br/>";
        }    

        divdialednumber.innerHTML = this.home.dailedNumber+"<br/>";

    }

    processEvent (event) {

        var textboxt = document.getElementById("output")
        var divhook = document.getElementById("hook")
        var divdialtone = document.getElementById("dialtone")
        var divdialednumber = document.getElementById("dialednumber")

        
        if ((event.substring(0,2) == "SS") || (event.substring(0,4) == "DTMF" )){
            if ((this.home.offhook == false) ) {
                textboxt.innerHTML += "You may have tried dialing "+event+", or it may be background noise, either way the reciever is on the hook, so nothing happens<br/>";
                return;
            } else if ((this.home.dialtone == true) && (event.substring(0,4) == "DTMF" )) {
                this.home.dailedNumber += event.substring(4,5)
                textboxt.innerHTML += "The Local exchange hears "+event+", it wonders if this might be a phone number you are dialing<br/>";
                if (divdialednumber.style.display == "none") {
                    textboxt.innerHTML += "Congratulations! You have discovered the playing DTMF tones is just the sane result as pressing the number keys on your phone.<br/>";
                    divdialednumber.style.display = "block";
                }            
                
                if ((this.home.dailedNumber != this.fpn.number.substring(0,this.home.dailedNumber.length)) && (this.home.dailedNumber != this.ppn.number.substring(0,this.home.dailedNumber.length))) {
                    textboxt.innerHTML += "Warning: You have dialed "+this.home.dailedNumber+" and this demo only supports two numbers. "+this.ppn.number+" and "+this.fpn.number+", so what you are doing probably isn't going to work.<br/>";  
                }      
            } else if ((event.substring(0,2) == "SS" )) {
                if (this.home.dialtone == true) {
                    textboxt.innerHTML += "The Local exchange hears "+event+" but it knows that as the whilst there is a dialtone, it should generate signalling tones, not react to them.<br/>"; 
                } else if (this.home.connected == true) {
                    textboxt.innerHTML += "The Local exchange hears "+event+" but it knows that as the whilst a call is connected, it shouldn't react to signalling tones.<br/>";
                }       
            }
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
            
            this.home.dialtone = true;
            this.home.connect = false; 
            this.home.dailedNumber = "";
            this.home.offhook = true;

            this.updateStatus();
            break;

        case "OnHook": 
            textboxt.innerHTML += "You put the reciever back down and no longer hear anything from the phone<br/>";
            divhook.innerHTML = "On Hook<br/>";
            divdialtone.innerHTML = "No dialtone present<br/>";
            this.home.dialtone = false;
            this.home.connect = false; 
            this.home.offhook = false;
            this.home.dailedNumber = "";

            this.updateStatus();
            break;  
        }

        

        
        
    }
  }