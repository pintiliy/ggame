import Core from "./Core.js";

export default class Game6 extends Core {
    constructor() {
        super();
        this.setBackground();
        this.file = $('body').data('file');
        this.loadTask(this.file);
        this.loadAudio();
        this.container = [];
        this.countLvlTrue = 0;
        this.dragZone = [];
        this.taskTitle = "Визнач якому з суддів відповідає нижчезазначений опис повноважень та обов’язків";
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
        let answers = this.level.answers;
        this.cleanButtons();
        var copy = [...answers];
        this.answers = answers.sort(() => (Math.random() > 0.5) ? 1 : -1);
        this.clickHandler = [];

        for(let i = 0; i < this.answers.length; i++) {
            var hitArea2 = new createjs.Shape();
            let width = 200;
            hitArea2.graphics.setStrokeStyle(2).beginStroke("#662400").r(0, 0, 200, width);
            let bg2 = hitArea2.clone();
            
            let cof = i > 0 ? 230 : 0;

            this.dragZone[i] = new createjs.Container();
            this.dragZone[i].x = 20 * (i + 1) + cof * i;
            this.dragZone[i].y = 250;
            this.dragZone[i].answerId = this.answers[i].id;
            this.dragZone[i].setBounds(this.dragZone[i].x - 100, this.dragZone[i].y - 100, 200, width);
            this.dragZone[i].addChild(bg2);
            this.stage.addChild(this.dragZone[i]);
            let text = new createjs.Text(this.answers[i].type, "20px Arial", "#fff");
            text.set({
                lineWidth: 450,
            });
            var hitArea = new createjs.Shape();
            hitArea.graphics.f("#373DEB").r(0, 0, 200, 30);
        
            text.hitArea = hitArea;
            let bg3 = hitArea.clone();
            text.x += 10;
            text.y += 5;
            let con = new createjs.Container();
            con.x = 20 * (i + 1) + cof * i;
            con.y = 220;

            con.addChild(bg3, text);
            this.stage.addChild(con);

        }

        this.answers2 = copy.sort(() => (Math.random() > 0.5) ? 1 : -1);

        for(let i = 0; i < this.answers2.length; i++) {
            let q = new createjs.Text(this.answers2[i].title, "14px Arial", "#fff");
            q.set({
                lineWidth: 180,
                // textAlign: "center"
            });
            var hitArea = new createjs.Shape();
            let width = 200;
            hitArea.graphics.beginStroke("#662400").f("#D94F04").r(0, 0, 200, width);
            q.hitArea = hitArea;
            let bg = hitArea.clone();
            q.x += 5;
            q.y += 5;
            let cof = i > 0 ? 230 : 0;
            this.buttons[i] = new createjs.Container();
            this.buttons[i].x = 20 * (i + 1) + cof * i;
            this.buttons[i].y = 550;
            this.buttons[i].cursor = "pointer";
            this.buttons[i].setBounds(this.buttons[i].x, this.buttons[i].y, 200, width);
            this.buttons[i].addChild(bg, q);
            this.stage.addChild(this.buttons[i]);
            
            this.clickHandler[i] = {};
            this.clickHandler[i].mousedown = this.eventMousedown.bind(this, i);
            this.clickHandler[i].pressmove =this.eventPressMove.bind(this, i);
            this.clickHandler[i].pressup = this.eventPressUp.bind(this, i);

            this.buttons[i].addEventListener("pressmove", this.clickHandler[i].pressmove);
            this.buttons[i].addEventListener("mousedown", this.clickHandler[i].mousedown);
            this.buttons[i].addEventListener("pressup", this.clickHandler[i].pressup);
        }

        this.stage.mouseMoveOutside = true;
        this.stage.enableMouseOver(20);
        this.stage.update();
    }

    eventPressMove(i, evt) {
        var sX = Math.floor(evt.stageX);
        var sY = Math.floor(evt.stageY);
        this.buttons[i].x = sX - this.buttons[i].dX;
        this.buttons[i].y = sY - this.buttons[i].dY;
        let collision = false;
        let current = null;
        for(let j = 0; j < this.dragZone.length; j++) {
            collision = this.intersect(evt.currentTarget, this.dragZone[j]);
            let b = this.dragZone[j].children[0];

            if (collision) {
                b.graphics.clear();
                b.graphics.setStrokeStyle(3)
                    .beginStroke("#0066A4")
                    .rect(0, 0, 200, 200);
            } else {
                b.graphics.clear();
                b.graphics.setStrokeStyle(2).beginStroke("#662400").r(0, 0, 200, 200);
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
                let dropZoneValue = this.dragZone[j].answerId;
                let thisValue = this.answers2[i].id;
                if (dropZoneValue === thisValue) {
                    this.countLvlTrue++;
                    createjs.Sound.play('correct');
                    this.buttons[i].x = this.dragZone[j].x;
                    this.buttons[i].y = this.dragZone[j].y;
                    this.dragZone[j].notEmpty = true;
                    this.buttons[i].removeEventListener("pressmove", this.clickHandler[i].pressmove);
                    this.buttons[i].removeEventListener("mousedown", this.clickHandler[i].mousedown);
                    this.buttons[i].removeEventListener("pressup", this.clickHandler[i].pressup);

                    if (this.countLvlTrue >= this.answers.length) {
                        this.nextLevelOrFinish();
                    }
                    break;
                }  else {
                    this.fails++;
                    this.renderCountFails();
                    createjs.Sound.play('fail');
                    this.buttons[i].x = this.buttons[i]._bounds.x;
                    this.buttons[i].y = this.buttons[i]._bounds.y;
                }
            }
        }

        if (!collision) {
            this.buttons[i].x = this.buttons[i]._bounds.x;
            this.buttons[i].y = this.buttons[i]._bounds.y;
        }

        this.stage.update();
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