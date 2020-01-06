import Game from './game';
import Victor from 'victor';


async function main() {
    var game = new Game();
    await game.load();
    game.player.bindEvents();
    game.mainloop.run();
}

main();
