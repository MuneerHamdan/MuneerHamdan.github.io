const canvas = document.getElementById("table");
const ctx = canvas.getContext("2d");

let balls = [];

const radius = 12;

function Ball(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.color = color;
}

function createBalls() {

    // cue ball
    balls.push(new Ball(200,250,"white"));

    let colors = [
        "yellow",
        "blue",
        "red",
        "purple",
        "orange",
        "green",
        "brown",
        "black"
    ];

    let i = 0;

    for(let row=0; row<3; row++){
        for(let col=0; col<=row; col++){

            balls.push(
                new Ball(
                    650 + row*25,
                    250 + col*25 - row*12,
                    colors[i++ % colors.length]
                )
            );
        }
    }
}

createBalls();


let mouseX = 0;
let mouseY = 0;


canvas.addEventListener("mousemove", e=>{
    let rect = canvas.getBoundingClientRect();

    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});


canvas.addEventListener("click", ()=>{

    let cue = balls[0];

    let dx = cue.x - mouseX;
    let dy = cue.y - mouseY;

    cue.vx = dx * 0.08;
    cue.vy = dy * 0.08;

});


function update(){

    balls.forEach(ball=>{

        ball.x += ball.vx;
        ball.y += ball.vy;

        ball.vx *= 0.985;
        ball.vy *= 0.985;


        if(ball.x < radius || ball.x > canvas.width-radius)
            ball.vx *= -1;

        if(ball.y < radius || ball.y > canvas.height-radius)
            ball.vy *= -1;

    });


    checkCollisions();

}



function checkCollisions() {

    for (let i = 0; i < balls.length; i++) {

        for (let j = i + 1; j < balls.length; j++) {

            let a = balls[i];
            let b = balls[j];

            let dx = b.x - a.x;
            let dy = b.y - a.y;

            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius * 2) {

                // prevent zero distance
                if (dist === 0) {
                    dx = radius * 2;
                    dy = 0;
                    dist = radius * 2;
                }

                // collision normal
                let nx = dx / dist;
                let ny = dy / dist;


                // push balls apart
                let overlap = radius * 2 - dist;

                a.x -= nx * overlap / 2;
                a.y -= ny * overlap / 2;

                b.x += nx * overlap / 2;
                b.y += ny * overlap / 2;


                // relative velocity
                let rvx = b.vx - a.vx;
                let rvy = b.vy - a.vy;


                // velocity along collision normal
                let velocityAlongNormal =
                    rvx * nx + rvy * ny;


                // balls are separating
                if (velocityAlongNormal > 0) {
                    continue;
                }


                // perfectly elastic collision
                let restitution = 1.0; // 1 = no energy loss

                let impulse =
                    -(1 + restitution) * velocityAlongNormal / 2;


                let ix = impulse * nx;
                let iy = impulse * ny;


                // apply impulse
                a.vx -= ix;
                a.vy -= iy;

                b.vx += ix;
                b.vy += iy;

            }
        }
    }
}


function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // pockets

    ctx.fillStyle="black";

    [
        [0,0],
        [450,0],
        [900,0],
        [0,500],
        [450,500],
        [900,500]
    ].forEach(p=>{
        ctx.beginPath();
        ctx.arc(p[0],p[1],25,0,Math.PI*2);
        ctx.fill();
    });



    balls.forEach(ball=>{

        ctx.beginPath();

        ctx.fillStyle=ball.color;

        ctx.arc(
            ball.x,
            ball.y,
            radius,
            0,
            Math.PI*2
        );

        ctx.fill();

    });


    // aim line

    let cue=balls[0];

    if(
        Math.abs(cue.vx)<0.01 &&
        Math.abs(cue.vy)<0.01
    ){

        ctx.strokeStyle="white";

        ctx.beginPath();

        ctx.moveTo(cue.x,cue.y);
        ctx.lineTo(mouseX,mouseY);

        ctx.stroke();
    }

}



function loop(){

    update();
    draw();

    requestAnimationFrame(loop);

}

loop();
