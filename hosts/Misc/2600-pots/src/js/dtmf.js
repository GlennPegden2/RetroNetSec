
    const dtmfFreqs = [
        [697, 770, 852, 941],
        [1209, 1336, 1477, 1633]
    ];
      
    const dtmfChars = [
        ["DTMF1", "DTMF2", "DTMF3", "DTMFA"],
        ["DTMF4", "DTMF5", "DTMF6", "DTMFB"],
        ["DTMF7", "DTMF8", "DTMF9", "DTMFC"],
        ["DTMF*", "DTMF0", "DTMF#", "DTMFD"],
    ];
      
      
    const sigFreqs = [
        700, 900, 1100, 1300, 1500, 1700, 2400, 2600
    ];
      
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
//                console.log(bin);
              if (data[bin] > max) {
                max = data[bin];
                index = i;
                imax = max;
              }
            }
//            console.log(imax);
//            if (imax > 200) {
              return [index,imax];
//            }  
//            else { 
//              return -1;
//            }    
          }

          function ss5mfChars(f1,f2) {
            switch (f1) {
              case 0:
                if (f2 == 1) { return "SS5/R 1" }
                if (f2 == 2) { return "SS5/R 2" }
                if (f2 == 3) { return "SS5/R 4" }
                if (f2 == 4) { return "SS5/R 7" }
                if (f2 == 5) { return "SS5/R ST3" }
              case 1:  
                if (f2 == 0) { return "SS5/R 1" }
                if (f2 == 2) { return "SS5/R 3" }
                if (f2 == 3) { return "SS5/R 5" }
                if (f2 == 4) { return "SS5/R 8" }
                if (f2 == 5) { return "SS5/R ST2" }
              case 2:  
                if (f2 == 0) { return "SS5/R 2" }
                if (f2 == 1) { return "SS5/R 3" }
                if (f2 == 3) { return "SS5/R 6" }
                if (f2 == 4) { return "SS5/R 9" }
                if (f2 == 5) { return "SS5/R KP" }
              case 3:  
                if (f2 == 0) { return "SS5/R 4" }
                if (f2 == 1) { return "SS5/R 5" }
                if (f2 == 2) { return "SS5/R 6" }
                if (f2 == 4) { return "SS5/R 0" }
                if (f2 == 5) { return "SS5/R KP2" }
              case 4:  
                if (f2 == 0) { return "SS5/R 7" }
                if (f2 == 1) { return "SS5/R 8" }
                if (f2 == 2) { return "SS5/R 9" }
                if (f2 == 3) { return "SS5/R 0" }
                if (f2 == 5) { return "SS5/R ST" }
              case 5:
                if (f2 == 0) { return "SS5/R ST3" }
                if (f2 == 1) { return "SS5/R ST2" }
                if (f2 == 2) { return "SS5/R KP" }
                if (f2 == 3) { return "SS5/R KP2" }
                if (f2 == 4) { return "SS5/R ST" }

                default:
                return "Unknown MF combo : "+f1+" "+f2
              }

          }
      
          var last; var last2;
          var counter = 0; var counter2;
          var duration = this.options.duration || 100;
          var step = this.options.step || 10;
      
          this._timer = setInterval(function () {
            analyser.getByteFrequencyData(freqs);
            var max = 0;
            for (var i = 0; i < freqs.length; i++) {
              if (freqs[i] > max) max = freqs[i];
            }
            var [x,xX] = findDtmfIndex(freqs, dtmfFreqs[0], binWidthInHz);
            var [y,yX] = findDtmfIndex(freqs, dtmfFreqs[1], binWidthInHz);
            var [z,zX] = findDtmfIndex(freqs, sigFreqs, binWidthInHz);
      //TODO: Refactor this mess
            if (z >= 0) {
                var sfc = sigFreqs.slice();
                sfc[z] = -999; 
                var [z2,z2X] = findDtmfIndex(freqs, sfc, binWidthInHz);
            }  else {
              z2 = -1
            }
//            if ((z >= 0 && z2 >= 0) || (x >= 0 && y >= 0)) {
//              if ((zX*z2X) > [xX*yX])  {
//                var c = ss5mfChars(z,z2);
//              } else {
//                var c = dtmfChars[x][y];
//              }  
            
              if (z >= 0 && z2 >= 0) {
                var c = ss5mfChars(z,z2);
                if (last == c) {
                  counter++;
                  if (counter > step * 0.75) {
                    cb(c);
                    counter = 0;
                  }
                } else {
                  counter = 0;
                }
                last = c;              
              }
              
              if (x >= 0 && y >= 0) {

                var c2 = dtmfChars[x][y];
                if (last2 == c2) {
                  counter2++;
                  if (counter2 > step * 0.75) {
                    cb(c2);
                    counter2 = 0;
                  }
                } else {
                  counter2 = 0;
                }
                last2 = c2;              
              }    

//              console.log("Vars"+x+" "+y+" "+z+" "+z2)

//            }
      
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
      


