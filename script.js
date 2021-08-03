var song
var fft 
var particles = [] //intialize empty array to keep track of all the particles


function preload(){
    song = loadSound("beat1.mp3");
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    // change angle mode from Radian to Deg
    angleMode(DEGREES)
    fft = new p5.FFT()

}

function draw(){
    background(0)
    stroke(255)

    strokeWeight(2)

    // remove fill color of vertex
    noFill()

    // place circle in center of canvas
    translate(width/2, height/2)

    // beat detection, let particle respond to low frequencies
    fft.analyze()
    amp = fft.getEnergy(200, 200)

    var wave = fft.waveform()

    // use for loop to create 2 waveform mirroring circle ie both, and need positive sin for one half, negative sin for other half 
    // no need copy paste code
    // start at -1, repeats one time, which creates our other half of circle
    for(var t=-1; t<=1;t+=2) {

        //half of mirror circle
        beginShape()
        // for loop 180 create first half of circle cuz we wanna mirror the waveform
        for(var i =0;i<=180;i++){
            var index = floor(map(i,0,180,0,wave.length-1))

            // use index to map radius of circle to the waveform 
            var r = map(wave[index],-1,1,150,350) // 150 is min, 350 is max radius of circle

            // x and y coordinates
            // in first iteration, create left side circle cuz negative sin by t=-1
            // in second iteration, generate right side circle cuz positive sin by t=1
            var x = r*sin(i)*t
            var y = r*cos(i)
            vertex(x,y)
        }
        endShape()
    }
    
    // create new particle every frame
    var p = new Particle()
    particles.push(p)

    // call methods for each particle in array 
    for(var i=0; i<particles.length;i++){
        // if particles are not out of canvas boundary, update and show
        if(!particles[i].overEdge()){
            // update position with parameter to let them respond to low frequencies
            particles[i].update(amp > 200)
            // show
            particles[i].show()
        } else {
            particles.splice[i,1] // delete 1 item at index i
        }
    }   
}

    
function mouseClicked() {
    if(song.isPlaying()) {
        song.pause();
        noLoop()
    } else {
        song.play();
        loop()
    }
}

// create particle object for particles that will be *moving* in background
class Particle {
    constructor(){
        // position of particle 
        this.pos = p5.Vector.random2D().mult(250) // average of minimum and maximum radius of waveform
        
        // since want them to move, shd have velocity and acceleration
        this.vel = createVector(0,0)
        this.acc = this.pos.copy().mult(random(0.0001,0.0001))

        // randomize width of particle
        // create var to store this value then can change this width in the show method
        this.w = random(3,5) // width is random between 3-5 pixels ie. small dots

        // color property of particle
        this.color = [random[200,255],random[200,255],random[200,255]]
    }

    // method to update position of particles
    update(cond){
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        // if song at low frequency ie. bass, add more velocity to particle
        if(cond) {
            this.pos.add(this.vel)
            this.pos.add(this.vel)
            this.pos.add(this.vel)
        }
    }

    //method to remove particles when they are no longer on canvas (otherwise array keeps growing)
    overEdge() {
        // if particle exceed boundary of canvas, return true
        if(this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height/2 || this.pos.y > height/2){
            return true;
        } else {
            return false;
        }
    }
    
    // create method for particle that will show it on the canvas
    show() {
        noStroke()
        fill(this.color) // random color
        ellipse(this.pos.x, this.pos.y, this.w) // 
    }

}

