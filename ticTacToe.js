const game_board = () => {
    let board = [];
    for (let i = 0; i <= 8; i++) {
        board.push('');
    }
    const gameResults = document.querySelector('.gameResults ');
    let gameEnded = false;
    let gameTie = false;
    const renderBoard = () => {
        const container = document.querySelector('.container');
        for (let i = 0; i <= 8; i++) {
            const box = document.createElement('div');
            box.id = 'box' + i;
            container.append(box);
        }
    };
    const getGameStatus = () => {
        return gameEnded;
    };
    const resetGame = () => {
        board = [];
        for (let i = 0; i <= 8; i++) {
            board.push('');
        }
        const container = document.querySelector('.container');
        for (let i = 0; i <= 8; i++) {
            const box = container.querySelector('#box' + i);
            box.textContent = '';
        }
        gameEnded = false;
        gameTie = false;
        gameResults.textContent = ``;
        const btnReset = document.querySelector('.nextGame');
        const gameInfo = document.querySelector('.gameInfo');
        gameInfo.style.visibility = "visible";
        btnReset.style.visibility = "hidden";
    };
    const setPlay = (playLocation, playChar) => {
        if (board[playLocation] === '' && gameEnded === false) {
            board[playLocation] = playChar;
            editBoard(playLocation);
            return true;
        }
    };
    const editBoard = (i) => {
        const box = document.querySelector('#box' + i);
        box.textContent = board[i];
    };
    const printResults = (playerName) => {
        if (!gameTie) {
            gameResults.textContent = `${playerName} Won!`;
        } else {
            gameResults.textContent = `Tie Game!`;
        }
    };
    const checkDownRight = (starter, rows, char, playerName) => {
        let boxes = [];
        if (rows === true)
            for (let i = 0; i < 3; i++) {
                boxes.push(board[starter + i]);
            }
        else if (rows === false) {
            for (let i = 0; i < 3; i++) {
                boxes.push(board[starter + (3 * i)]);
            }
        } else {
            for (let i = 0; i < 3; i++) {
                boxes.push(board[starter + (4 * i)]);
            }
        }
        if (boxes.join('') === char.repeat(3)) {
            gameEnded = true;
            printResults(playerName);
            return true;
        }
    };
    const checkDiag = (starter, char, playerName) => {
        let boxes = [];
        if (starter === 0) {
            for (let i = 0; i < 3; i++) {
                boxes.push(board[starter + (4 * i)]);
            }
        } else {
            for (let i = 0; i < 3; i++) {
                boxes.push(board[starter + (2 * i)]);
            }
        }
        if (boxes.join('') === char.repeat(3)) {
            gameEnded = true;
            printResults(playerName);
            return true;
        }
    };
    const checkTie = (char, playerName) => {
        let emptyBox = false;
        if (gameEnded === false) {
            for (let i = 0; i <= 8; i++) {
                if (board[i] === '') {
                    emptyBox = true;
                    break;
                }
            }
            if (emptyBox === false) {
                gameEnded = true;
                gameTie = true;
                printResults(playerName);
            }
        }
    };
    const checkWin = (char, playerName) => {
        const starterRow = [0, 3, 6];
        const starterCol = [0, 1, 2];
        const starterDiag = [0, 2];
        starterRow.forEach(row => {
            if (checkDownRight(row, true, char, playerName) === true) return true;
        });
        starterCol.forEach(col => {
            if (checkDownRight(col, false, char, playerName) === true) return true;
        });
        starterDiag.forEach(diag => {
            if (checkDiag(diag, char, playerName) === true) return true;
        });
        checkTie(char, playerName);
    };
    return {renderBoard, resetGame, setPlay, editBoard, checkWin, getGameStatus};
};
const player = () => {
    let playerChar = '';
    let tic_tac_toe_board = {};
    let playerTurn = false;
    let playerWin = false;
    let playerName = ``;
    const setGameBoard = (board) => {
        tic_tac_toe_board = board;
    };
    const setTurn = (turn) => {
        playerTurn = turn;
    };
    const getTurn = () => {
        return playerTurn;
    };
    const playAtLocation = (location) => {
        if (tic_tac_toe_board.setPlay(location, getChar())) {
            setTurn(false);
            tic_tac_toe_board.checkWin(getChar(), getName());
        }
    };
    const getName = () => {
        return playerName;
    };
    const setName = (name) => {
        playerName = name || `Player ${getChar()}`;
    };
    const setChar = (char) => {
        playerChar = char;
    };
    const setWinner = (winner) => {
        playerWin = winner;
    };
    const getChar = () => {
        return playerChar;
    };
    return {setChar, getChar, setGameBoard, playAtLocation, setTurn, getTurn, setWinner, setName, getName};
};
(function () {
    const tic_tac_toe_board = game_board();
    tic_tac_toe_board.renderBoard();
    const btnStart = document.querySelector('.start');
    const btnReset = document.querySelector('.nextGame');
    const gameInfo = document.querySelector('.gameInfo');
    btnStart.addEventListener('click', function () {
        gameInfo.style.visibility = "hidden";
        const playerOne = player();
        const playerTwo = player();
        playerOne.setGameBoard(tic_tac_toe_board);
        playerTwo.setGameBoard(tic_tac_toe_board);
        playerOne.setChar('X');
        playerTwo.setChar('O');
        playerOne.setName(gameInfo.querySelector('#xName').value);
        playerTwo.setName(gameInfo.querySelector('#oName').value);
        playerOne.setTurn(true);
        const btnEdit = document.querySelectorAll('.container>div');
        btnEdit.forEach(box => box.addEventListener('click', function () {
            let location = box.id.slice(3);
            if (playerOne.getTurn() === true) {
                playerOne.playAtLocation(location);
                playerTwo.setTurn(true);
            } else if (playerTwo.getTurn() === true) {
                playerTwo.playAtLocation(location);
                playerOne.setTurn(true);
            }
            if (tic_tac_toe_board.getGameStatus()) {
                btnReset.style.visibility = "visible";
                btnReset.addEventListener('click', function () {
                    tic_tac_toe_board.resetGame();
                    playerTwo.setTurn(false);
                    playerOne.setTurn(false);
                });
            }
        }));
    });
})();
