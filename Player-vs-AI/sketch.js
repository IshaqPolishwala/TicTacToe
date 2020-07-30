const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

setCanvasSize();

const dim = canvas.width;       // Length of board
const cDim = dim / 3;           // Length of cell

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
        board[i][j] = "X";
        drawBoard();
        bestMove();
        drawBoard();

        let result = checkWinner();
        if(result == "tie")
            document.getElementById("result").innerHTML = "It's a Tie!";
        else if(result != null) {
            ctx.strokeStyle = "red";
            ctx.stroke();
            document.getElementById("result").innerHTML = (result=="X" ? "Player" : "AI") + " wins!";
            canvas.removeEventListener("click", handleClick);
        }
    }
}
canvas.addEventListener("click", handleClick);

const scores = {
    "X": -1,
    "O": 1,
    "tie": 0
}

function bestMove() {
    let best = -100;
    let move = null;
    for(let i=0; i<3; i++)
        for(let j=0; j<3; j++)
            if(board[i][j] == '') {
                board[i][j] = "O";
                let score = minimax(false);
                board[i][j] = '';
                if(score > best) {
                    best = score;
                    move = {i, j};
                }
            }
    if(move != null)
        board[move.i][move.j] = "O";
}

function minimax(isMax) {
    let result = checkWinner();
    if(result != null)
        return scores[result];

    if(isMax) {
        let best = -100;
        for(let i=0; i<3; i++)
            for(let j=0; j<3; j++)
                if(board[i][j] == '') {
                    board[i][j] = "O";
                    let score = minimax(false);
                    board[i][j] = '';
                    if(score > best) {
                        best = score;
                    }
                }
        return best;
    }
    else {
        let best = 100;
        for(let i=0; i<3; i++)
            for(let j=0; j<3; j++)
                if(board[i][j] == '') {
                    board[i][j] = "X";
                    let score = minimax(true);
                    board[i][j] = '';
                    if(score < best) {
                        best = score;
                    }
                }
        return best;
    }
}

const equals3 = (a, b, c) => (a==b && b==c && a!="");

function checkWinner() {
    let winner = null;
    ctx.beginPath();
    for(let i=0; i<3; i++) {
        if(equals3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
            ctx.moveTo(3, cDim * i + cDim/2);
            ctx.lineTo(dim-3, cDim * i + cDim/2);
        }
        if(equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
            ctx.moveTo(cDim * i + cDim/2, 3);
            ctx.lineTo(cDim * i + cDim/2, dim-3);
        }
    }

    if(equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
        ctx.moveTo(0, 0);
        ctx.lineTo(dim, dim);
    }
    if(equals3(board[0][2], board[1][1], board[2][0])) {
        winner = board[0][2];
        ctx.moveTo(dim, 0);
        ctx.lineTo(0, dim);
    }
    
    let flag = true;
    for(let i=0; i<3; i++)
        for(let j=0; j<3; j++)
            if(board[i][j] == '') {
                flag = false;
                break;
            }
    if(winner == null && flag)
        return "tie";
    return winner;
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
