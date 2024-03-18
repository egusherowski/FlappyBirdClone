const {createApp} = Vue

// console.log(createApp)

createApp({
    created() {
        // Attach an event listener to the window on component creation
        window.addEventListener('keyup', this.birdjump,);
        window.addEventListener('click', this.birdjump);


    },
    data() {
        return{
            //Bird Attributes
            birdheight: 279,
            birdmiddle: window.outerWidth/2,
            birdcolor: "red",
            birdflaporientation: "down",
            birdimg: "Assets/sprites/redbird-downflap.png",
            birdrotation: "0",
            birdfallspeed: 1.5,

            interval: false,
            pipes: [],
            pastpipes: [],
            pipespeed: 2,
            time: 4000,
            multiplier: 1.5,
            score: 0,
            moveable: "true",

            //Intervals
            freefallInterval: null,
            pipesInterval: null,
            speedInterval: null,
            movementInterval: null,
            flapInterval: null,
            flipInterval: null,
        };
    }, methods: {
        birdjump: function(event){
            if((event.key === "ArrowUp" || event.key === " " || event.type === "click") && this.moveable === "true"){
            if(this.interval === false){
                this.GameDriver();
            }
            this.birdrotation = 0;
            if(this.flapInterval == null){
                this.flapInterval = setInterval(()=>{
                 if(this.birdflaporientation === "mid")
                     this.birdflaporientation = "down";
                 else if(this.birdflaporientation === "down")
                     this.birdflaporientation = "up";
                 else if(this.birdflaporientation === "up")
                     this.birdflaporientation = "mid";
                 this.birdimg = "Assets/sprites/" + this.birdcolor + "bird-" + this.birdflaporientation + "flap.png";
                }, 100);
            }
            this.birdheight -= 65;
            this.birdfallspeed= 1.5;
            this.birdmiddle = outerWidth/2;
            clearInterval(this.freefallInterval);
            this.freefallInterval = window.setInterval(() =>{
                clearInterval(this.flapInterval);
                this.flapInterval = null;
                this.birdfallspeed += 1.5;
                if(this.birdrotation !== 90)
                    this.birdrotation += 45;
            }, 1000);}
        },
        CreatePipe: function(){
            const pipetop = Math.floor(Math.random() * (300 - 85 + 1)) + 85;
            const pipebottom = pipetop + 150;
            let pipe1 = document.createElement('img');
            pipe1.src = "Assets/sprites/pipe-top.png";
            pipe1.style.position = "absolute";
            pipe1.style.top = pipetop + 'px';
            pipe1.style.right = "0px";
            pipe1.style.transform = "scaleY(-1)";
            pipe1.dataset.uncounted = "true";
            let app = document.getElementById("app");
            app.appendChild(pipe1);
            let pipe2 = document.createElement('img');
            pipe2.src = "Assets/sprites/pipe-top.png";
            pipe2.style.position = "absolute";
            pipe2.style.top = pipebottom + 'px';
            pipe2.style.right = "0px";
            pipe2.dataset.uncounted = "true";
            app.appendChild(pipe2);

                let pipe3 = document.createElement('img');
                pipe3.src = "Assets/sprites/pipepiece.png";
                pipe3.style.position = "absolute";
                pipe3.style.top = "0px";
                pipe3.style.right = "2px";
                pipe3.style.width = "48px";
                pipe3.style.height = pipetop  + 'px';
                pipe3.style.transform = "scaleY(-1)";
                pipe3.dataset.uncounted = "true";
                app.appendChild(pipe3);
            let pipe4 = document.createElement('img');
            pipe4.src = "Assets/sprites/pipepiece.png";
            pipe4.style.position = "absolute";
            pipe4.style.top = pipebottom + 28 + 'px';
            pipe4.style.right = "2px";
            pipe4.style.width = "48px";
            pipe4.style.height = 500 - pipebottom + 'px';
            pipe4.dataset.uncounted = "true";
            app.appendChild(pipe4);
            this.pipes.push(pipe1, pipe2, pipe3, pipe4);
        },
        updatePipePosition() {
            for (let i = this.pipes.length - 1; i >= 0; i--) {
                let pipe = this.pipes[i];
                pipe.style.right = parseFloat(pipe.style.right) + this.pipespeed + 'px';

                // Check if the pipe is out of the visible area
                if (parseFloat(pipe.style.right) > window.innerWidth) {
                    pipe.parentNode.removeChild(pipe); // Remove from the DOM
                    this.pipes.splice(i, 1); // Remove from array
                    i--; // Adjust index since the array is modified
                }

                const pipe1 = pipe.getBoundingClientRect();
                const bird = document.getElementById("bird").getBoundingClientRect();

                if (!(bird.right < pipe1.left ||
                    bird.left > pipe1.right ||
                    bird.bottom < pipe1.top ||
                    bird.top > pipe1.bottom) ||
                    (bird.top < 0 && bird.right > pipe1.left && bird.left < pipe1.right)) {
                    this.GameOver();
                }
                if(bird.left > pipe1.right && pipe.dataset.uncounted === "true" && pipe.style.top === "0px"){
                    pipe.dataset.uncounted = "false";

                    if(this.birdcolor === "red")
                        this.birdcolor = "yellow";
                    else if(this.birdcolor === "yellow")
                        this.birdcolor = "blue";
                    else
                        this.birdcolor = "red";

                    this.birdimg = "Assets/sprites/" + this.birdcolor + "bird-" + this.birdflaporientation + "flap.png";
                    this.score += 1;
                    let s = this.score.toString();
                    let nums = document.getElementById("score")
                    while (nums.firstChild) {
                        nums.removeChild(nums.firstChild);
                    }
                    for(let i = 0; i < s.length; i++){
                        let scores = document.createElement("img");
                        scores.src = "Assets/sprites/" + s[i] + ".png";
                        nums.appendChild(scores);
                    }
                }

            }
        },

        GameDriver: function(){
                this.interval = true;
                document.getElementById("startscreen").style.visibility = "hidden";
                let s = document.createElement("img");
                s.src = "Assets/sprites/" + this.score + ".png";
                document.getElementById("score").appendChild(s);
                this.CreatePipe();
             this.movementInterval = window.setInterval(() => {
                this.birdheight += this.birdfallspeed;
                this.updatePipePosition();

               if(this.birdheight > 512){
                    this.GameOver();
                }
            }, 20);
                this.pipesInterval = window.setInterval(() =>{
                this.CreatePipe();
            } ,4000);
                this.speedInterval = window.setInterval(()=>{
                clearInterval(this.pipesInterval);
                if(this.pipespeed > 5){
                    this.multiplier = 1.1;
                }
                    this.time /= this.multiplier;
                this.pipesInterval = window.setInterval(() =>{
                    this.CreatePipe();
                } , this.time);
                this.pipespeed *= this.multiplier;
                console.log(this.pipespeed);
            }, 20000);

        },
        GameOver: function(){
            this.moveable = "false";
            clearInterval(this.freefallInterval);
            clearInterval(this.movementInterval);
            clearInterval(this.speedInterval);
            clearInterval(this.pipesInterval);
            clearInterval(this.flapInterval);

            this.flapInterval = null;
            this.birdrotation = 360;
            this.flipInterval = setInterval(()=>{

                this.birdheight += 0.5;
                this.birdmiddle -= 0.5;
                this.birdrotation -= 1;
                if(this.birdrotation < 205 || this.birdheight < 0){
                    clearInterval(this.flipInterval);
                    this.flipInterval = setInterval(()=>{
                        this.birdheight += 1;

                        if(this.birdheight > 520 || this.birdheight < 0) {
                            clearInterval(this.flipInterval);
                        }
                    }, 1);
                }
            }, 1);
            let gameover = document.createElement('img');
            let message = document.createElement('div')
            let app = document.getElementById("app");
            setTimeout(()=>{
                for(let i = 0; i < this.pipes.length; i++){
                    this.pipes[i].parentNode.removeChild(this.pipes[i]);
                }
                while(this.pipes.length !== 0){
                    this.pipes.pop();
                }

                let score = document.getElementById("score");
                while (score.firstChild) {
                    score.removeChild(score.firstChild);
                }

                gameover.src = "Assets/sprites/gameover.png"
                gameover.style.position = "absolute";
                gameover.style.top = "100px";
                gameover.style.left = "calc(50vw - 60px)";
                gameover.id = "gameover";
                app.appendChild(gameover);

                let m1 = document.createElement('p');
                let m2 = document.createElement('p');
                m1.innerHTML = "Score:";
                m1.style.fontSize = "20pt";
                m1.style.color = "black";
                m1.style.display = "inline-block";
                m1.style.marginRight = "28.8833px";
                m1.style.marginLeft = "90px";
                message.appendChild(m1);

                let s = this.score.toString();
                for(let i = 0; i < s.length; i++){
                    let scores = document.createElement("img");
                    scores.src = "Assets/sprites/" + s[i] + ".png";
                    message.appendChild(scores);
                }

                message.style.position = "absolute";
                message.style.top = "170px";
                message.style.left = "calc(50vw - 120px)";

                app.appendChild(message);

            },3000);

            setTimeout(()=>{
                app.removeChild(gameover);
                app.removeChild(message);
                this.interval = false;
                this.score = 0;
                this.birdheight = 279;
                this.birdrotation = 0;
                this.birdcolor = "red";
                this.birdflaporientation = "down";
                this.birdimg = "Assets/sprites/" + this.birdcolor + "bird-" + this.birdflaporientation + "flap.png";
                this.birdmiddle = window.outerWidth/2;
                document.getElementById("startscreen").style.visibility = "visible";
                document.getElementById("bird").style.visibility = "visible";
                this.moveable = "true";
                this.pipespeed = 2;
                this.time = 4000;
                this.multiplier = 1.5;
            }, 8000);
        }
    }
}).mount("#app");





/*
GameOver: function(){
    this.moveable = "false";
    clearInterval(this.freefallInterval);
    clearInterval(this.movementInterval);
    clearInterval(this.speedInterval);
    clearInterval(this.pipesInterval);
    clearInterval(this.flapInterval);

    this.flapInterval = null;
    this.birdrotation = 360;
    this.flipInterval = setInterval(()=>{

        this.birdheight += 0.5;
        this.birdmiddle -= 0.5;
        this.birdrotation -= 1;
        if(this.birdrotation < 205 || this.birdheight < 0){
            clearInterval(this.flipInterval);
            this.flipInterval = setInterval(()=>{
                this.birdheight += 1;

                if(this.birdheight > 520 || this.birdheight < 0) {
                    clearInterval(this.flipInterval);
                }
            }, 1);
        }
    }, 1);
    let gameover = document.createElement('img');
    let message = document.createElement('div')
    let app = document.getElementById("app");
    setTimeout(()=>{
        for(let i = 0; i < this.pipes.length; i++){
            this.pipes[i].parentNode.removeChild(this.pipes[i]);
        }
        while(this.pipes.length !== 0){
            this.pipes.pop();
        }

        let score = document.getElementById("score");
        while (score.firstChild) {
            score.removeChild(score.firstChild);
        }

        gameover.src = "Assets/sprites/gameover.png"
        gameover.style.position = "absolute";
        gameover.style.top = "100px";
        gameover.style.left = "calc(50vw - 60px)";
        gameover.id = "gameover";
        app.appendChild(gameover);

        let m1 = document.createElement('p');
        let m2 = document.createElement('p');
        m1.innerHTML = "Score:";
        m1.style.fontSize = "20pt";
        m1.style.color = "black";
        m1.style.display = "inline-block";
        m1.style.marginRight = "28.8833px";
        m1.style.marginLeft = "90px";
        message.appendChild(m1);

        let s = this.score.toString();
for(let i = 0; i < s.length; i++){
    let scores = document.createElement("img");
    scores.src = "Assets/sprites/" + s[i] + ".png";
    message.appendChild(scores);
}

m2.innerHTML = "Record:";
m2.style.fontSize = "20pt";
m2.style.color = "black";
m2.style.display = "inline-block";
m2.style.marginRight = "10px";
m2.style.marginLeft = "90px";
message.appendChild(document.createElement("br"));
message.appendChild(m2);

let h = this.highscore.toString();
for(let i = 0; i < h.length; i++){
    let scores = document.createElement("img");
    scores.src = "Assets/sprites/" + h[i] + ".png";
    message.appendChild(scores);
}

let submit = document.createElement("img");
submit.src = "Assets/sprites/highscore.png";
submit.addEventListener("click", ()=>{
    db.collection("Scores").add({Score: this.score});
    message.removeChild(submit);
});

message.appendChild(document.createElement("br"));
message.appendChild(submit);

message.style.position = "absolute";
message.style.top = "170px";
message.style.left = "calc(50vw - 120px)";

app.appendChild(message);

},3000);

setTimeout(()=>{
    app.removeChild(gameover);
    app.removeChild(message);
    this.interval = false;
    this.score = 0;
    this.birdheight = 279;
    this.birdrotation = 0;
    this.birdcolor = "red";
    this.birdflaporientation = "down";
    this.birdimg = "Assets/sprites/" + this.birdcolor + "bird-" + this.birdflaporientation + "flap.png";
    this.birdmiddle = window.outerWidth/2;
    document.getElementById("startscreen").style.visibility = "visible";
    document.getElementById("bird").style.visibility = "visible";
    this.moveable = "true";
    this.pipespeed = 2;
    this.time = 4000;
    this.multiplier = 1.5;
}, 8000);
}
}
}).mount("#app");*/