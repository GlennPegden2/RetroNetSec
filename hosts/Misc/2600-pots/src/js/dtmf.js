class tones {

  ss5 = {

    Freqs : [
      700, 900, 1100, 1300, 1500, 1700, 2400, 2600
    ],
  
    Chars : [
      ["SSX", "SS51", "SS52", "SS54", "SS57", "SS5ST3", "SS5SZ2400", "SS5SZ2600"],
      ["SS1", "SS5X", "SS53", "SS55", "SS58", "SS5ST2", "SS5SZ2400", "SS5SZ2600"],
      ["SS2", "SS53", "SS5X", "SS56", "SS59", "SS5KP", "SS5SZ2400", "SS5SZ2600"],
      ["SS4", "SS55", "SS56", "SS5X", "SS50", "SS5KP2", "SS5SZ2400", "SS5SZ2600"],
      ["SS7", "SS58", "SS59", "SS50", "SS5X", "SS5ST", "SS5SZ2400", "SS5SZ2600"],
      ["SSST3", "SS5ST2", "SS5KP", "SS5KP2", "SS5ST", "SSSTX", "SS5SZ2400", "SS5SZ2600"],
      ["SS5SZ2400", "SS5SZ2400", "SS5SZ2400", "SS5SZ2400", "SS5SZ2400", "SS5SZ2400", "SS5SZ2400", "SS5SZ2600"],
      ["SS5SZ2600", "SS5SZ2600", "SS5SZ2600", "SS5SZ2600", "SS5SZ2600", "SS5SZ2600", "SS5SZ2600", "SS5SZ2600"]
    ],

    last: "",
    counter: ""

  }
    
  dtmf = {

    Freqs: [
      [697, 770, 852, 941],
      [1209, 1336, 1477, 1633]
    ],
    
    Chars: [
      ["DTMF1", "DTMF2", "DTMF3", "DTMFA"],
      ["DTMF4", "DTMF5", "DTMF6", "DTMFB"],
      ["DTMF7", "DTMF8", "DTMF9", "DTMFC"],
      ["DTMF*", "DTMF0", "DTMF#", "DTMFD"],
    ],

    last: "",
    counter: ""
  }
  
}
    class Sender {
        constructor(options = {}) {
          var audioContext = new(window.AudioContext || window.webkitAudioContext);
          var grid = [];
          for (var i = 0; i < dtmfFreqs[0].length; i++) {
            var row = [];
            var freq1 = dtmfFreqs[0][i];
            for (var j = 0; j < dtmfFreqs[1].length; j++) {
              var freq2 = dtmfFreqs[1][j];
              var button = {};
              button.gain1 = audioContext.createGain();
              button.gain1.gain.value = 0.0;
              button.gain1.connect(audioContext.destination);
      
              button.osc1 = audioContext.createOscillator();
              button.osc1.type = "sine";
              button.osc1.frequency.value = freq1;
              button.osc1.connect(button.gain1);
      
              button.osc2 = audioContext.createOscillator();
              button.osc2.type = "sine";
              button.osc2.frequency.value = freq2;
              button.osc2.connect(button.gain1);
      
              button.osc1.start(0);
              button.osc2.start(0);
      
              row.push(button);
            }
            grid.push(row);
          }
          this.options = options;
          this.audioContext = audioContext;
          this.grid = grid;
        }
        play(str, cb) {
          if (!cb) cb = function () {};
          if (!str) return cb();
          var seq = str.split("");
          var grid = this.grid;
          var duration = this.options.duration || 100;
          var pause = this.options.pause || 40;
          var doPlay = function () {
            var char = seq.shift();
            if (!char) return cb();
            var i, j;
            loop1:
            for (i = 0; i < dtmfChars.length; i++) {
              for (j = 0; j < dtmfChars[i].length; j++) {
                if (dtmfChars[i][j] == char) break loop1;
              }
            }
            var button = grid[i][j];
            if (button) {
              button.gain1.gain.value = 1.0;
              setTimeout(function () {
                button.gain1.gain.value = 0.0;
                setTimeout(doPlay, pause);
              }, duration);
            } else {
              return cb();
            }
          };
          doPlay();
        }
        destory() {
          if (this.audioContext) {
            if (typeof this.audioContext.close === "function") {
              this.audioContext.close();
            }
            this.audioContext = null;
          }
        }
      }
      
    class Receiver  {
        constructor(options = {}) {
          this.options = options;
        }

 
        start(stream, cb) {
          if (this._timer || !cb) return;
      
          this.audioContext = new(window.AudioContext || window.webkitAudioContext);
      
          var src = this.audioContext.createMediaStreamSource(stream);
          var analyser = this.audioContext.createAnalyser();
          analyser.fftSize = 1024;
          analyser.smoothingTimeConstant = 0;
          src.connect(analyser);
      
          var freqs = new Uint8Array(analyser.frequencyBinCount);
          var binWidthInHz = this.audioContext.sampleRate / freqs.length / 2;
      
          function findDtmfIndex(data, xdtmfFreqs, binWidthInHz) {
            var max = 0;
            var index = -1;
            var imax = 0; 
            for (var i = 0; i < xdtmfFreqs.length; i++) {
              var bin = Math.round(xdtmfFreqs[i] / binWidthInHz);
//              if (i >=0 && data[bin] >= 200) { console.log(i+" "+bin+" "+data[bin]+" "+xdtmfFreqs[i])}
              if (data[bin] > max) {
                max = data[bin];
                index = i;
                imax = max;
              }
            }
              return [index,imax];
          }


          function countTones(t1,t2,toneType,cb) {

//            var step = this.options.step || 20; // was 20
            var step = 20; // was 20
            var last = "";
            var counter = 0;
            var c = "";  
            var minLen = 1;
            var maxLen = 3;  

            if ((toneType == 0) || (toneType == 1)){
              // DTMF normal || // DMF Lonf
              if (toneType == 1) {
                //DTMF Long (ABCD)
                minLen = 3;
                maxLen = 3;  
              } else {
                //DTMF Normal
                minLen = 0.4;
                maxLen = 9;  
              }
              c = tc.dtmf.Chars[t1][t2]; 
              last = tc.dtmf.last;
              tc.dtmf.counter++;
              counter = tc.dtmf.counter;
              tc.dtmf.last = c 
            } else if (toneType == 2) {
              // SS5
              minLen = 1;
              maxLen = 5;
              c = tc.ss5.Chars[t1][t2];  
              last = tc.ss5.last;
              tc.ss5.counter++;
              counter = tc.ss5.counter;
              tc.ss5.last = c 
            } else if (toneType == 3) {
              // CLEAR 
//              console.log("Clear");
              c = "";
            }

            var minCnt = (step * 0.75)*minLen
            var maxCnt = (step * 0.75)*maxLen

            if (last == c && toneType != 3) {
              console.log("Considering Tone (max) "+c+" = "+t1+","+t2+" Counter was "+counter+" type was"+toneType);
              if (counter > minCnt) {
                  console.log("KEEPING Tone (max) "+c+" = "+t1+","+t2+" Counter was "+counter+" type was"+toneType);
                  cb(c);
                  if (toneType == 2) {
                    tc.ss5.counter = 0;
                  } else {
                    tc.dtmf.counter = 0;
                  }
                    }
            } else {
              if (toneType == 2) {
                tc.ss5.counter = 0;
              } else {
                tc.dtmf.counter = 0;
              }
            }

          }

          var tc = new tones();

          var last; var last2;
          var counter = 0; var counter2;
          var duration = this.options.duration || 100; // Was 100
          var step = this.options.step || 20; // was 20
      
          this._timer = setInterval(function () {
            analyser.getByteFrequencyData(freqs);
            var max = 0;
            for (var i = 0; i < freqs.length; i++) {
              if (freqs[i] > max) max = freqs[i];
            }
            var [x,xX] = findDtmfIndex(freqs, tc.dtmf.Freqs[0], binWidthInHz);
            var [y,yX] = findDtmfIndex(freqs, tc.dtmf.Freqs[1], binWidthInHz);
            var [z,zX] = findDtmfIndex(freqs, tc.ss5.Freqs, binWidthInHz);


            if (z >= 0) {
                var sfc = tc.ss5.Freqs.slice();
                sfc[z] = -999; 
                var [z2,z2X] = findDtmfIndex(freqs, sfc, binWidthInHz);
            }  else {
              z2 = -1
            }
              
            if ((x >= 0 & xX >= 200) || (y >= 0 & yX >= 200) || (z >= 0 & zX >= 200)  || (z2 >= 0 & z2X >= 200))  {

              //              console.log("Valid Tones "+x+"("+xX+") "+y+"("+yX+") "+z+"("+zX+") "+z2+"("+z2X+") ");
            }

            // 2400 / 2600 are special single-tone cases, but present them on both side to support them as a special case
            if (((z == 6 ) && (z2 != 7))|| ((z == 7) && ( z2 != 6)))  { z2 = z; z2X = zX;}
            else if (((z2 == 6) && (z != 7)) || (z2 == 7)  && ( z != 6))  { z = z2; zX = z2X;};


            if (xX + yX >= zX +z2X) {
            // Process the loudest tone

              if ((x >= 0 & xX >= 200) && (y >= 0 & yX >= 200)) {
                if (y == 3) {
                  // Long DTMF  
                  countTones(x,y,1,cb);
                } else {
                  // Short DTMF
                 countTones(x,y,0,cb);
               }
              }  
            } else {
                if ((z >= 0 & zX >= 200)  && (z2 >= 0 & z2X >= 200)) {
                  countTones(z,z2,2,cb)
                }
            }

          }, duration / step);
        }
        stop() {
          clearInterval(this._timer);
          this._timer = null;
          if (this.audioContext) {
            if (typeof this.audioContext.close === "function") {
              this.audioContext.close();
            }
            this.audioContext = null;
          }
        }
      }
      


