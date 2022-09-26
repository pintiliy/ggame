import Core from "./Core.js";

export default class Game4 extends Core {
    constructor() {
        super();
        this.setBackground();
        this.file = $('body').data('file');
        this.loadTask(this.file);
        this.loadAudio();
        this.container = [];
        this.countLvlTrue = 0;
        this.dragZone = [];
        this.taskTitle = "Склади слово із запропонованих літер";
    }

    cleanHeader() {
        if (this.header) {
            this.stage.removeChild(this.headerBg, this.header);
        }
    }

    cleanButtons() {
        if (this.buttons) {
            for(let i = 0; i < this.buttons.length; i++) {
                this.stage.removeChild(this.buttons[i]);
            }
        }

        if (this.dragZone) {
            for(let i = 0; i < this.dragZone.length; i++) {
                this.stage.removeChild(this.dragZone[i]);
            }
        }

        this.stage.update();
    }

    makeAnswersList() {
        let letters = this.level.answers[0].title.split('').sort(() => (Math.random() > 0.5) ? 1 : -1);
        this.cleanButtons();
        this.letters = letters;
        this.clickHandler = [];

        for(let i = 0; i < letters.length; i++) {
            let q = new createjs.Text(letters[i].toUpperCase(), "30px Arial", "#fff");
            q.set({
                lineWidth: 900,
                textAlign: "center"
            });

            var hitArea = new createjs.Shape();
            var hitArea2 = new createjs.Shape();
            let width = 50;
            hitArea.graphics.beginStroke("#662400").f("#D94F04").r(0, 0, width, width);
            hitArea2.graphics.setStrokeStyle(2).beginStroke("#662400").r(0, 0, width, width);
            let bg2 = hitArea2.clone();

            q.hitArea = hitArea;
            let bg = hitArea.clone();
            q.x += 25;
            q.y += 15;
            
            let cof = letters.length >= 7 ? 30 : 40;
            let marginLeft = width * (i + 1) + (cof * (i));

            this.buttons[i] = new createjs.Container();
            this.buttons[i].x = marginLeft;
            this.buttons[i].y = 700;
            this.buttons[i].cursor = "pointer";
            this.buttons[i].setBounds(marginLeft, 700, width, width);
            this.buttons[i].addChild(bg, q);
            this.stage.addChild(this.buttons[i]);

            this.dragZone[i] = new createjs.Container();
            this.dragZone[i].x = marginLeft;
            this.dragZone[i].y = 500;
            this.dragZone[i].value = this.level.answers[0].title.split('')[i];
            this.dragZone[i].setBounds(marginLeft - 50, 500, width, width);
            this.dragZone[i].addChild(bg2);
            this.stage.addChild(this.dragZone[i]);

            this.clickHandler[i] = {};
            this.clickHandler[i].mousedown = this.eventMousedown.bind(this, i);
            this.clickHandler[i].pressmove =this.eventPressMove.bind(this, i, hitArea2);
            this.clickHandler[i].pressup = this.eventPressUp.bind(this, i);

            this.buttons[i].addEventListener("pressmove", this.clickHandler[i].pressmove);
            this.buttons[i].addEventListener("mousedown", this.clickHandler[i].mousedown);
            this.buttons[i].addEventListener("pressup", this.clickHandler[i].pressup);
        }
        
        this.stage.mouseMoveOutside = true;
        this.stage.enableMouseOver(20);
        this.stage.update();
    }

    eventPressMove(i, box, evt) {
        var sX = Math.floor(evt.stageX);
        var sY = Math.floor(evt.stageY);
        this.buttons[i].x = sX - this.buttons[i].dX;
        this.buttons[i].y = sY - this.buttons[i].dY;
        let collision = false;
        let current = null;
        for(let j = 0; j < this.dragZone.length; j++) {
            collision = this.intersect(evt.currentTarget, this.dragZone[j]);
            let b = this.dragZone[j].children[0];
            if (this.dragZone[j].value !== current) {
                current = this.dragZone[j].value;
                b.graphics.clear();
                b.graphics.setStrokeStyle(2).beginStroke("#662400").r(0, 0, 50, 50);
            }            

            if (collision) {
                b.graphics.clear();
                b.graphics.setStrokeStyle(3)
                    .beginStroke("#0066A4")
                    .rect(0, 0, 50, 50);
            }
        }

        this.stage.update();
   }

    eventMousedown(i, event) {
        var sX = Math.floor(event.stageX);
        var sY = Math.floor(event.stageY);
        this.buttons[i].dX = sX - this.buttons[i].x;
        this.buttons[i].dY = sY - this.buttons[i].y;
    }

    eventPressUp(i, event) {
        let collision = false;
        for(let j = 0; j < this.dragZone.length; j++) {
            collision = this.intersect(event.currentTarget, this.dragZone[j]);
            if (collision && !this.dragZone[j].notEmpty) {
                let dropZoneValue = this.dragZone[j].value.toLowerCase();
                let thisValue = this.letters[i].toLowerCase();

                if (dropZoneValue === thisValue) {
                    this.countLvlTrue++;
                    createjs.Sound.play('correct');
                    this.buttons[i].x = this.dragZone[j].x;
                    this.buttons[i].y = this.dragZone[j].y;
                    this.dragZone[j].notEmpty = true;
                    this.buttons[i].removeEventListener("pressmove", this.clickHandler[i].pressmove);
                    this.buttons[i].removeEventListener("mousedown", this.clickHandler[i].mousedown);
                    this.buttons[i].removeEventListener("pressup", this.clickHandler[i].pressup);

                    if (this.countLvlTrue >= this.letters.length) {
                        this.nextLevelOrFinish();
                    }
                }  else {
                    this.fails++;
                    this.renderCountFails();
                    createjs.Sound.play('fail');
                    this.buttons[i].x = this.buttons[i]._bounds.x;
                    this.buttons[i].y = this.buttons[i]._bounds.y;
                }
                this.stage.update();
                break;
            }
        }

        if (!collision) {
            this.buttons[i].x = this.buttons[i]._bounds.x;
            this.buttons[i].y = this.buttons[i]._bounds.y;
            this.stage.update();
        }
    }

    intersect(obj1, obj2) {
        if (obj1 && obj2) {
            var objBounds1 = obj1.getBounds().clone();
            var objBounds2 = obj2.getBounds().clone();
        
            var pt = obj1.globalToLocal(objBounds2.x, objBounds2.y);
            
            var h1 = -(objBounds1.height / 2 + objBounds2.height);
            var h2 = objBounds2.width / 2;
            var w1 = -(objBounds1.width / 2 + objBounds2.width);
            var w2 = objBounds2.width / 2;

            if(pt.x > w2 || pt.x < w1) return false;
            if(pt.y > h2 || pt.y < h1) return false;
            
            return true;
        }
        return false;
    }
}