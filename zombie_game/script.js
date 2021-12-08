let board = document.querySelector(".zombiearea");
let score = 0;
let scoreBoard = document.querySelector(".score")
let scoreValue = document.querySelector(".score span");
let zombieWalked = 0;


document.addEventListener("DOMContentLoaded", () => {

    let timer = setInterval( () => {

        let zombie = document.createElement("div");
        zombie.classList.add("zombie");
        
        // scale zombie
        let scale = 0.8 + Math.random() * 0.5;
        zombie.style.transform = "scale(" + scale + ")";

        
        if (bottomPos > 200) {
            zombie.style.filter = "blur(3px)"
        } else if (bottomPos > 100) {
            zombie.style.filter = "blur(2px)"
        } else {

        }


        var bottomPos = Math.floor(Math.random()*360);
        zombie.style.bottom = bottomPos + "px";
        zombie.style.zIndex = 360 - bottomPos;

        // zombie speed
        var min = 2;
        var max = 7;
        let walkSpeed = Math.floor(Math.random()*(max-min+1)+min);
        let anim = "1s," + walkSpeed + "s"
        zombie.style.animationDuration = anim;

        board.appendChild(zombie);

        zombie.addEventListener('animationend', function(e) {
            if(e.animationName === "zombieWalk") {
                zombieWalked++;
                this.remove();
            }
            scoreValue.innerText = score;

            if(zombieWalked == 3){
                clearInterval(timer);
                scoreBoard.style.left = "50%";
                scoreBoard.innerHTML += "<br> END GAME"
                board.style.filter = "blur(3px)";
                board.removeEventListener("click", shootZombie);
            }

        });

    }, 600);


    board.addEventListener("click", shootZombie);

})

function shootZombie(e){
    if (e.target.classList.contains ("zombie")) {
        score += 12;
        e.target.remove();
        scoreValue.innerText = score;
    } else{
        score -= 6;
        scoreValue.innerText = score;
    }

}