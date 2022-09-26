import TestGame from './test.js';
import Tests from './tests.js';
import Game2 from './game2.js';
import Game3 from './game3.js';
import Game4 from './game4.js';
import Game5 from './game5.js';
import Game6 from './game6.js';
import Game7 from './game7.js';
import Game12 from './game12.js';
import Game13 from './game13.js';
import Game14 from './game14.js';
import Game15 from './game15.js';

(function() {
    $("#navigation").load("/parts/navigation.html");
    $('#canvas').css({"border": "1px solid #F2CB05"});
    if ($('#game-test').length) {
        new TestGame();
    }
    if ($('#tests').length) {
        new Tests();
    }
    if ($('#game-2').length) {
        new Game2();
    }
    if ($('#game-3').length) {
        new Game3();
    }
    if ($('#game-4').length) {
        new Game4();
    }
    if ($('#game-5').length) {
        new Game5();
    }
    if ($('#game-6').length) {
        new Game6();
    }
    if ($('#game-7').length) {
        new Game7();
    }
    if ($('#game-12').length) {
        new Game12();
    }
    if ($('#game-13').length) {
        new Game13();
    }
    if ($('#game-14').length) {
        new Game14();
    }
    if ($('#game-15').length) {
        new Game15();
    }
})();