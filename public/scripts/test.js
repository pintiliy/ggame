import Core from "./Core.js";

export default class TestGame extends Core {
    constructor() {
        super();
        this.setBackground();
        let file = $('#game-test').data('file');
        this.loadTask(file);
        this.loadAudio();
        this.taskTitle = "Уважно прочитай питання та обери вірну відповідь на нього";
    }

    drawText() {
        this.cleanHeader();
        let t = this.level.title;
        this.header = new createjs.Text(t, "30px Arial", "#fff");
        this.header.set({
            lineWidth: 900,
            textAlign: "center"
        });
        var bounds = this.header.getBounds();
        var hitArea = new createjs.Shape();
        hitArea.graphics.f("#F29325").r(bounds.x, bounds.y, bounds.width, bounds.height);
        this.header.hitArea = hitArea;
        this.headerBg = hitArea.clone();

        this.header.x = 1000/2;
        this.header.y = 10;

        this.headerBg.x = this.header.x;
        this.headerBg.y = this.header.y;

        this.stage.addChild(this.headerBg, this.header);
        this.stage.update();
    }

    cleanHeader() {
        if (this.header) {
            this.stage.removeChild(this.headerBg, this.header);
        }
    }

    cleanButtons() {
        if (this.buttons) {
            for(let i = 0; i < this.buttons.length; i++) {
                this.stage.removeChild(this.buttons[i].bg, this.buttons[i].text);
            }
        }
    }

    makeAnswersList() {
        let buttons = this.level.answers
        this.cleanButtons();
        for(let i = 0; i < buttons.length; i++) {
            this.buttons[i] = {};
            this.buttons[i].text = new createjs.Text(buttons[i].title, "20px Arial", "#fff");

            this.buttons[i].text.set({
                lineWidth: 900,
                textAlign: "center",
                textBaseline: "middle",
                x: this.width / 2,
                y: this.height - (buttons.length * 75) + (i * 75)
            });

            var c = 20;
            var bounds = this.buttons[i].text.getBounds();
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginStroke("#662400").f("#D94F04").r(bounds.x - c, bounds.y - 15, bounds.width + (c * 2), bounds.height + c);
            this.buttons[i].text.hitArea = hitArea;
            this.buttons[i].text.cursor = "pointer";

            this.buttons[i].bg = hitArea.clone();
            this.buttons[i].bg.x = this.buttons[i].text.x;
            this.buttons[i].bg.y = this.buttons[i].text.y;

            this.stage.addChild(this.buttons[i].bg, this.buttons[i].text);

            this.buttons[i].text.addEventListener("click", () => { 
                if (!!buttons[i].true) {
                    createjs.Sound.play('correct');
                    this.nextLevelOrFinish();
                } else {
                    this.fails++;
                    this.renderCountFails();
                    createjs.Sound.play('fail');
                }
            });
        }
        this.stage.enableMouseOver(20);
        this.stage.update();
    }
}