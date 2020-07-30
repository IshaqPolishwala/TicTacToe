const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

setCanvasSize();

const dim = canvas.width;       // Length of board
const cDim = dim / 3;           // Length of cell

let player = true;
let count = 0;
const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

drawGrid();

function handleClick(e) {
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;
    let i = Math.floor(y/cDim);
    let j = Math.floor(x/cDim);
    
    if(board[i][j] == '') {
        board[i][j] = player ? 'X' : 'O';
        drawBoard();
        checkWinner();
        player = !player;
    }
}
canvas.addEventListener("click", handleClick);

const equals3 = (a, b, c) => (a==b && b==c && a!="");

function checkWinner() {
    count++;

    let winner = null;
    ctx.beginPath();
    ctx.strokeStyle = "red";
    for(let i=0; i<3; i++) {
        if(equals3(board[i][0], board[i][1], board[i][2])) {
            winner = player;
            ctx.moveTo(3, cDim * i + cDim/2);
            ctx.lineTo(dim-3, cDim * i + cDim/2);
        }
        if(equals3(board[0][i], board[1][i], board[2][i])) {
            winner = player;
            ctx.moveTo(cDim * i + cDim/2, 3);
            ctx.lineTo(cDim * i + cDim/2, dim-3);
        }
    }

    if(equals3(board[0][0], board[1][1], board[2][2])) {
        winner = player;
        ctx.moveTo(0, 0);
        ctx.lineTo(dim, dim);
    }
    if(equals3(board[0][2], board[1][1], board[2][0])) {
        winner = player;
        ctx.moveTo(dim, 0);
        ctx.lineTo(0, dim);
    }
    ctx.stroke();
    
    if(winner != null) {
        document.getElementById("result").innerHTML = "Player " + (winner ? "1" : "2") + " wins!";
        canvas.removeEventListener("click", handleClick);
    }
    else if(count == 9)
        document.getElementById("result").innerHTML = "It's a Tie!";

    ctx.strokeStyle = "black";
}

function drawBoard() {
    let dr = cDim/4;
    for(let i=0; i<3; i++)
        for(let j=0; j<3; j++) {
            let x = cDim * j + cDim/2;
            let y = cDim * i + cDim/2;
            
            if(board[i][j] == 'X') {
                ctx.beginPath();
                ctx.moveTo(x-dr, y-dr);
                ctx.lineTo(x+dr, y+dr);
                ctx.moveTo(x+dr, y-dr);
                ctx.lineTo(x-dr, y+dr);
                ctx.stroke();
            }
            else if(board[i][j] == 'O') {
                ctx.beginPath();
                ctx.arc(x , y, dr, 0, 2*Math.PI);
                ctx.stroke();
            }
        }
}

function drawGrid() {
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(cDim, 3);
    ctx.lineTo(cDim, dim-3);
    ctx.moveTo(cDim*2, 3);
    ctx.lineTo(cDim*2, dim-3);
    ctx.moveTo(3, cDim);
    ctx.lineTo(dim-3, cDim);
    ctx.moveTo(3, cDim*2);
    ctx.lineTo(dim-3, cDim*2);
    ctx.stroke();
}

function setCanvasSize() {
    if(window.innerWidth > window.innerHeight) {
        canvas.width = window.innerHeight - 250;
        canvas.height = window.innerHeight - 250;
    }
    else {
        canvas.width = window.innerWidth - 30;
        canvas.height = window.innerWidth - 30;
    }
}
