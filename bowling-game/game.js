const readline = require('readline-sync');
const fs = require('fs');
const path = './history.json';

class Player {
    constructor(name) {
        this.name = name;
        this.frames = [];
        this.strikes = 0;
        this.spares = 0; 
    }

    roll(pins) {
        this.frames.push(pins);
    }

    getScore() {
        let score = 0;
        let frameIndex = 0;

        for (let frame = 0; frame < 10; frame++) {
            if (this.isStrike(frameIndex)) {
                score += 10 + this.strikeBonus(frameIndex);
                this.strikes++;
                frameIndex++;
            } else if (this.isSpare(frameIndex)) {
                score += 10 + this.spareBonus(frameIndex);
                this.spares++;
                frameIndex += 2;
            } else {
                score += this.sumOfPinsInFrame(frameIndex);
                frameIndex += 2;
            }
        }

        return score;
    }

    isStrike(frameIndex) {
        return this.frames[frameIndex] === 10;
    }

    isSpare(frameIndex) {
        return this.frames[frameIndex] + this.frames[frameIndex + 1] === 10;
    }

    strikeBonus(frameIndex) {
        return this.frames[frameIndex + 1] + this.frames[frameIndex + 2];
    }

    spareBonus(frameIndex) {
        return this.frames[frameIndex + 2];
    }

    sumOfPinsInFrame(frameIndex) {
        return this.frames[frameIndex] + this.frames[frameIndex + 1];
    }
}

class BowlingGame {
    constructor() {
        this.players = [];
    }

    startGame() {
        const numPlayers = readline.questionInt('🎳 Entrez le nombre de joueurs (entre 1 et 6): ');

        for (let i = 0; i < numPlayers; i++) {
            let playerName = readline.question(`🤡 Entrez le nom du joueur ${i + 1}: (sois drôle stp) `);
            while (this.players.some(player => player.name === playerName)) {
                console.log('Ce nom est déjà pris. Choisis un nom unique zebi.');
                playerName = readline.question(`🤡 Entrez le nom du joueur ${i + 1}: (pareil...) `);
            }
            this.players.push(new Player(playerName));
        }

        for (let frame = 1; frame <= 10; frame++) {
            console.log(`\nFrame ${frame} 🎳`);
            this.players.forEach(player => {
                console.log(`🌍 ${player.name}, toute la planète bowling te regarde, c'est ton tour ! 🌍`);
                if (frame === 10) {
                    this.handleTenthFrame(player);
                } else {
                    this.handleFrame(player);
                }
            });

            this.displayScores();
        }

        this.displayFinalScores();
        this.saveHistory();
    }

    handleFrame(player) {
        let roll1;
        do {
            roll1 = readline.questionInt(`🎳 ${player.name}, combien de quilles avez-vous renversé au premier lancer? `);
            if (roll1 < 0 || roll1 > 10) {
                console.log('Tricheur de merde va, choisis un nombre entre 0 et 10. 🤬');
            }
        } while (roll1 < 0 || roll1 > 10);
        this.simulateFakeSound(roll1);
        player.roll(roll1);

        if (roll1 < 10) {
            let roll2;
            do {
                roll2 = readline.questionInt(`🎳 ${player.name}, combien de quilles avez-vous renversé au deuxième lancer? `);
                if (roll2 < 0 || roll2 > (10 - roll1)) {
                    console.log(`Tu veux tricher ?? Putain choisis un nombre entre 0 et ${10 - roll1}. 😒`);
                }
            } while (roll2 < 0 || roll2 > (10 - roll1));
            this.simulateFakeSound(roll2);
            player.roll(roll2);
            this.displayComment(roll1, roll2);
        } else {
            console.log(`🎳 ${player.name} a fait un STRIKE comme un GOAT ! 🐐🎳`);
        }
    }

    handleTenthFrame(player) {
        let roll1;
        do {
            roll1 = readline.questionInt(`🎳 ${player.name}, combien de quilles avez-vous renversé au premier lancer? `);
            if (roll1 < 0 || roll1 > 10) {
                console.log('Choisis un nombre entre 0 et 10 cheateur de merde. 🤨');
            }
        } while (roll1 < 0 || roll1 > 10);
        this.simulateFakeSound(roll1);
        player.roll(roll1);

        if (roll1 === 10) {
            let roll2;
            do {
                roll2 = readline.questionInt(`🎳 ${player.name}, combien de quilles avez-vous renversé au deuxième lancer? `);
                if (roll2 < 0 || roll2 > 10) {
                    console.log('Tricheur de merde va, choisis un nombre entre 0 et 10. 😡');
                }
            } while (roll2 < 0 || roll2 > 10);
            this.simulateFakeSound(roll2);
            player.roll(roll2);

            if (roll2 === 10 || roll1 + roll2 === 10) {
                let roll3;
                do {
                    roll3 = readline.questionInt(`🎳 ${player.name}, combien de quilles avez-vous renversé au troisième lancer? `);
                    if (roll3 < 0 || roll3 > 10) {
                        console.log('Tricheur de merde va, choisis un nombre entre 0 et 10. 😡');
                    }
                } while (roll3 < 0 || roll3 > 10);
                this.simulateFakeSound(roll3);
                player.roll(roll3);
            }
        } else {
            let roll2;
            do {
                roll2 = readline.questionInt(`🎳 ${player.name}, combien de quilles avez-vous renversé au deuxième lancer? `);
                if (roll2 < 0 || roll2 > (10 - roll1)) {
                    console.log(`Tu veux tricher ?? Putain choisis un nombre entre 0 et ${10 - roll1}. 😒`);
                }
            } while (roll2 < 0 || roll2 > (10 - roll1));
            this.simulateFakeSound(roll2);
            player.roll(roll2);

            if (roll1 + roll2 === 10) {
                let roll3;
                do {
                    roll3 = readline.questionInt(`🎳 ${player.name}, combien de quilles avez-vous renversé au troisième lancer? `);
                    if (roll3 < 0 || roll3 > 10) {
                        console.log('Tricheur de merde va, choisis un nombre entre 0 et 10. 😡');
                    }
                } while (roll3 < 0 || roll3 > 10);
                this.simulateFakeSound(roll3);
                player.roll(roll3);
            }
        }
    }

    simulateFakeSound(pins) {
        if (pins === 0) {
            console.log('*Bruit de balle qui va lamentablement dans les rigoles sans toucher de quilles*... 😞');
        } else if (pins < 5) {
            console.log('Ha ha ha merdique ! 😂');
        } 
        else {
            console.log('Putain très tchatcheur! 😎');
        }
    }

    displayComment(roll1, roll2) {
        if (roll1 + roll2 === 10) {
            console.log('Spare! 🎉');
        } else if (roll1 === 0 && roll2 === 0) {
            console.log('Oh non, tu pues la merde ! 😭😭😭');
        } else if (roll1 === 10) {
            console.log('Strike! Monstrueux. 🎳');
        }
    }

    displayScores() {
        console.log('\nScore après ce frame:');
        this.players.forEach(player => {
            console.log(`🎳 ${player.name}: ${player.getScore()}`);
        });
    }

    displayFinalScores() {
        console.log('\nScore final:');
        let highestScore = 0;
        let winners = [];
    
        this.players.forEach(player => {
            const score = player.getScore();
            console.log(`${player.name}: ${score} (Strikes: ${player.strikes}, Spares: ${player.spares})`);
            if (score > highestScore) {
                highestScore = score;
                winners = [player.name];
            } else if (score === highestScore) {
                winners.push(player.name);
            }
        });
    
        if (winners.length === 1) {
            console.log(`${winners[0]} est le gagnant ! C'est vraiment un ROI. 🏆`);
        } else {
            console.log(`${winners.join('et ')} sont les gagnants! Egalité parfaite 🏆`);
        }
    }    

    saveHistory() {
        const gameResult = this.players.map(player => ({
            name: player.name,
            score: player.getScore(),
            strikes: player.strikes,
            spares: player.spares
        }));

        let history = [];
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path);
            history = JSON.parse(data);
        }
        history.push(gameResult);

        fs.writeFileSync(path, JSON.stringify(history, null, 2));
    }

    static displayHistory() {
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path);
            const history = JSON.parse(data);

            console.log('\nHistorique des parties:');
            history.forEach((game, index) => {
                console.log(`\nPartie ${index + 1}:`);
                game.forEach(player => {
                    console.log(`  🎳 ${player.name}: ${player.score} (Strikes: ${player.strikes}, Spares: ${player.spares})`);
                });
            });
        } else {
            console.log('Aucun historique de parties trouvé. Faut jouer gros con. 🤷‍♂️');
        }
    }
}

const choice = readline.question('Voulez-vous commencer une nouvelle partie ou afficher l\'historique des parties? (nouvelle/historique) ');

if (choice.toLowerCase() === 'nouvelle') {
    const game = new BowlingGame();
    game.startGame();
} else if (choice.toLowerCase() === 'historique') {
    BowlingGame.displayHistory();
} else {
    console.log('🚫 Choix invalide. 🚫');
}
