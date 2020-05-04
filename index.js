var AudioContext = window.AudioContext || window.webkitAudioContext
var audioCtx = new AudioContext()

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var w = canvas.width = window.innerWidth
var h = canvas.height = window.innerHeight

var oscillators = []
var gains = []
var gainNode = audioCtx.createGain()
var initialFreq = 1000
var minFreq = 300
var maxFreq = 2000
var num = 20
var initialVol = 0.01

for(var i = 1; i < num; i++){
  let curFreq = Math.pow(maxFreq,i/num)
  console.log(`Node ${i}:  ${Math.floor(curFreq)}`);
  let curVol = vol(curFreq)

  let gain = audioCtx.createGain()
  gain.gain.value = curVol
  gain.gain.minValue = curVol
  gain.gain.maxValue = curVol
  gain.connect(gainNode)
  gains.push(gain)

  let oscillator = audioCtx.createOscillator()
  oscillator.connect(gain)
  oscillator.frequency.value = curFreq

  oscillator.detune.value = Math.floor(Math.random()*100)
  oscillator.type = 'sine'
  oscillator.start(0)
  oscillators.push(oscillator)
  oscillator.onended = function() {
    console.log('No more sound for you')
  }
}
gainNode.connect(audioCtx.destination)




gainNode.gain.value = initialVol
gainNode.gain.minValue = initialVol
gainNode.gain.maxValue = initialVol




let t = 0
document.addEventListener('keydown',run)

function run(){
  t += 1
  for(var i in oscillators){
    oscillator = oscillators[i]
    gain = gains[i]




    oscillator.frequency.value*=1.01
    if(oscillator.frequency.value>maxFreq){
      console.log(`resetting oscillator ${i}`)
      oscillator.frequency.value = Math.pow(2000,1/(num))
    }
    let curVol = vol(oscillator.frequency.value)
    gain.gain.value = curVol
    gain.gain.minValue = curVol
    gain.gain.maxValue = curVol
    ctx.fillStyle = `hsl(${i/num*360}, 99%, ${curVol*100}%)`
    ctx.fillRect(t,oscillator.frequency.value/maxFreq*h,2,2)
  }
  requestAnimationFrame(run)
}


function vol(freq){
  return Math.max(-freq*(freq-maxFreq)/(maxFreq/2)/(maxFreq/2)-0.1,0)
}
