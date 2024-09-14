const homeScreen = document.getElementById('homeScreen');
const gameArea = document.getElementById('gameArea');
const player1Area = document.getElementById('player1Area');
const player2Area = document.getElementById('player2Area');
const resultCard = document.getElementById('resultCard');
const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');
const roundHistory = document.getElementById('roundHistory');
const homeButton = document.getElementById('homeButton');
const playAgainBtn = document.getElementById('playAgain');
const leaderboard = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboardList');
const usernamePrompt = document.getElementById('usernamePrompt');
const usernameInput = document.getElementById('usernameInput');
const submitUsername = document.getElementById('submitUsername');
const gameEndOptions = document.getElementById('gameEndOptions');

let gameMode = '';
let player1Choice = '';
let player2Choice = '';
let player1Score = 0;
let player2Score = 0;
let roundsPlayed = 0;
let consecutiveWins = 0;
let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
let gameActive = false;

document.getElementById('vsComputer').addEventListener('click', () => startGame('computer'));
document.getElementById('vsPlayer').addEventListener('click', () => startGame('player'));

function startGame(mode) {
    gameMode = mode;
    gameActive = true;
    homeScreen.classList.add('hidden');
    gameArea.classList.remove('hidden');
    leaderboard.classList.add('hidden');

    if (mode === 'computer') {
        player2Area.classList.add('hidden');
        player1Area.querySelector('h2').textContent = 'You';
        player2ScoreElement.textContent = 'Computer: 0';
    } else {
        player2Area.classList.remove('hidden');
        player1Area.querySelector('h2').textContent = 'Player 1';
        player2ScoreElement.textContent = 'Player 2: 0';
    }

    resetGame();
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    roundsPlayed = 0;
    player1Choice = '';
    player2Choice = '';

    player1ScoreElement.textContent = 'Player 1: 0';
    player2ScoreElement.textContent = gameMode === 'computer' ? 'Computer: 0' : 'Player 2: 0';

    roundHistory.innerHTML = '';

    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => choice.classList.remove('selected'));

    resultCard.classList.add('hidden');
    gameEndOptions.classList.add('hidden');
    leaderboard.classList.add('hidden');
}

gameArea.addEventListener('click', (e) => {
    if (!gameActive) return;
    if (e.target.classList.contains('choice')) {
        const choice = e.target.dataset.choice;
        if (!player1Choice) {
            player1Choice = choice;
            e.target.classList.add('selected');

            if (gameMode === 'computer') {
                player2Choice = getComputerChoice();
                player2Area.querySelector(`[data-choice="${player2Choice}"]`).classList.add('selected');
                setTimeout(showResult, 500);
            } else {
                player2Area.querySelector('.choices').classList.remove('hidden');
                resultText.textContent = "Player 2's turn";
                resultCard.classList.remove('hidden');
            }
        } else if (gameMode === 'player' && !player2Choice) {
            player2Choice = choice;
            e.target.classList.add('selected');
            setTimeout(showResult, 500);
        }
    }
});

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}

function showResult() {
    const roundResult = getWinner(player1Choice, player2Choice);

    resultTitle.textContent = "Round Result";
    resultText.textContent = roundResult;
    resultCard.classList.remove('hidden');

    updateScore(roundResult);
    updateRoundHistory(roundResult);
    roundsPlayed++;

    if (roundResult.includes('You win') || roundResult.includes('Player 1 wins')) {
        consecutiveWins++;
    } else {
        resetConsecutiveWins();
    }

    if (roundsPlayed === 5 || player1Score === 3 || player2Score === 3) {
        endGame();
    } else {
        setTimeout(() => {
            resultCard.classList.add('hidden');
            countdown();
        }, 2000);
    }
}

function getWinner(choice1, choice2) {
    if (choice1 === choice2) return "It's a tie!";

    if (
        (choice1 === 'rock' && choice2 === 'scissors') ||
        (choice1 === 'paper' && choice2 === 'rock') ||
        (choice1 === 'scissors' && choice2 === 'paper')
    ) {
        return gameMode === 'computer' ? 'You win!' : 'Player 1 wins!';
    } else {
        return gameMode === 'computer' ? 'Computer wins!' : 'Player 2 wins!';
    }
}

function updateScore(result) {
    if (result.includes('You win') || result.includes('Player 1 wins')) {
        player1Score++;
    } else if (result.includes('Computer wins') || result.includes('Player 2 wins')) {
        player2Score++;
    }

    player1ScoreElement.textContent = `Player 1: ${player1Score}`;
    player2ScoreElement.textContent = gameMode === 'computer' ? `Computer: ${player2Score}` : `Player 2: ${player2Score}`;
}

function updateRoundHistory(result) {
    const roundResult = document.createElement('div');
    roundResult.classList.add('round-result');

    if (result.includes('You win') || result.includes('Player 1 wins')) {
        roundResult.classList.add('win');
        roundResult.textContent = 'W';
    } else if (result.includes('Computer wins') || result.includes('Player 2 wins')) {
        roundResult.classList.add('lose');
        roundResult.textContent = 'L';
    } else {
        roundResult.classList.add('tie');
        roundResult.textContent = 'T';
    }

    roundHistory.appendChild(roundResult);
}

function resetRound() {
    player1Choice = '';
    player2Choice = '';

    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => choice.classList.remove('selected'));

    if (gameMode === 'computer') {
        player1Area.querySelector('.choices').classList.remove('hidden');
        player2Area.classList.add('hidden');
    } else {
        player1Area.querySelector('.choices').classList.remove('hidden');
        player2Area.querySelector('.choices').classList.add('hidden');
    }

    resultCard.classList.add('hidden');
}

function endGame() {
    gameActive = false;
    let winner;
    if (player1Score > player2Score) {
        winner = gameMode === 'computer' ? 'You win the series!' : 'Player 1 wins the series!';
        if (gameMode === 'computer') {
            checkLeaderboard();
        }
    } else if (player2Score > player1Score) {
        winner = gameMode === 'computer' ? 'Computer wins the series!' : 'Player 2 wins the series!';
        resetConsecutiveWins();
    } else {
        winner = "It's a tie series!";
        resetConsecutiveWins();
    }

    resultTitle.textContent = "Game Over";
    resultText.textContent = winner;
    resultCard.classList.remove('hidden');

    gameEndOptions.classList.remove('hidden');
    updateLeaderboard();
}

function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboardData.sort((a, b) => b.wins - a.wins);
    leaderboardData.slice(0, 10).forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${entry.username}: ${entry.wins} wins`;
        leaderboardList.appendChild(li);
    });
    leaderboard.classList.remove('hidden');
}

function checkLeaderboard() {
    const lowestScore = leaderboardData.length < 10 ? 0 : leaderboardData[leaderboardData.length - 1].wins;
    if (consecutiveWins > lowestScore) {
        usernamePrompt.classList.remove('hidden');
    } else {
        resetConsecutiveWins();
    }
}

function addToLeaderboard(username) {
    leaderboardData.push({ username, wins: consecutiveWins });
    leaderboardData.sort((a, b) => b.wins - a.wins);
    leaderboardData = leaderboardData.slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
    updateLeaderboard();
    resetConsecutiveWins();
}

function resetConsecutiveWins() {
    consecutiveWins = 0;
}

homeButton.addEventListener('click', () => {
    initGame();
});

playAgainBtn.addEventListener('click', () => {
    gameActive = true;
    resetGame();
    gameArea.classList.remove('hidden');
});

document.addEventListener('keydown', (e) => {
    if (!gameActive || gameArea.classList.contains('hidden')) return;

    let choice;
    if (e.key === 'r' || e.key === 'R') choice = 'rock';
    else if (e.key === 'p' || e.key === 'P') choice = 'paper';
    else if (e.key === 's' || e.key === 'S') choice = 'scissors';

    if (choice) {
        const choiceElement = gameArea.querySelector(`[data-choice="${choice}"]:not(.hidden)`);
        if (choiceElement) choiceElement.click();
    }
});

function countdown(count = 3) {
    if (count > 0) {
        const countdownEl = document.createElement('div');
        countdownEl.textContent = count;
        countdownEl.classList.add('countdown');
        document.body.appendChild(countdownEl);

        setTimeout(() => {
            countdownEl.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(countdownEl);
                countdown(count - 1);
            }, 500);
        }, 500);
    } else {
        resetRound();
    }
}

submitUsername.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        addToLeaderboard(username);
        usernamePrompt.classList.add('hidden');
        usernameInput.value = '';
    }
});

function initGame() {
    gameActive = false;
    updateLeaderboard();
    homeScreen.classList.remove('hidden');
    gameArea.classList.add('hidden');
    resultCard.classList.add('hidden');
    gameEndOptions.classList.add('hidden');
    leaderboard.classList.add('hidden');
    usernamePrompt.classList.add('hidden');

    // Reset all game elements
    player1Score = 0;
    player2Score = 0;
    roundsPlayed = 0;
    player1Choice = '';
    player2Choice = '';
    player1ScoreElement.textContent = 'Player 1: 0';
    player2ScoreElement.textContent = 'Player 2: 0';
    roundHistory.innerHTML = '';

    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => choice.classList.remove('selected'));
}

// Call initGame when the script loads
initGame();