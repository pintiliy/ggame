import Core from "./Core.js";

export default class Game2 extends Core {
    constructor() {
        super();
        this.setBackground();
        this.file = $('body').data('file');
        this.loadTask(this.file);
        this.loadAudio();
        this.taskTitle = "Подивись на зображення інвентарю та екіпірування спортсменів, визнач до якого виду спорту вони належать та обери ті які пов’язані зі спортивним плаванням";
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
        let buttons = this.level.answers.sort(() => (Math.random() > 0.5) ? 1 : -1);
        this.cleanButtons();
        let j = 0;
        let lvl = 1;
        for(let i = 0; i < buttons.length; i++) {
            this.buttons[i] = {};
            var hitArea = new createjs.Shape();
            j++;

            let cof = j > 1 ? 155 : 10;
            let width = 150;

            hitArea.graphics.beginStroke("#662400").f("#D94F04").r(10 * j + (cof * (j - 1)),  110 * lvl, width, 100);
            this.buttons[i].bg = hitArea.clone();
            this.buttons[i].bg.cursor = "pointer";
            this.stage.addChild(this.buttons[i].bg);
            
            if (j >= 6) {
                j = 0;
                lvl++;
            }

            this.manifest.push(
                {src:`../images/${buttons[i].img}`, id:`img-${i}`}
            );

            this.buttons[i].bg.addEventListener("click", (ev) => {
                this.stage.removeChild(this.buttons[i].bg);
                if (!!buttons[i].true) {
                    createjs.Sound.play('correct');

                    let hitArea = new createjs.Shape();
                    hitArea.graphics.setStrokeStyle(4).beginStroke("#5AC642").r(ev.target.graphics.command.x, ev.target.graphics.command.y, width, 100);
                    this.buttons[i].bg = hitArea.clone();
                    this.stage.addChild(this.buttons[i].bg);

                    this.nextLevelOrFinish();
                } else {
                    this.fails++;
                    this.renderCountFails();
                    createjs.Sound.play('fail');

                    let hitArea = new createjs.Shape();
                    hitArea.graphics.setStrokeStyle(4).beginStroke("#C62017").r(ev.target.graphics.command.x, ev.target.graphics.command.y, width, 100);
                    this.buttons[i].bg = hitArea.clone();
                    this.stage.addChild(this.buttons[i].bg);
                }
                this.stage.setChildIndex(this.buttons[i].bg, 2);
                this.stage.update();
            });
        }
        var queue = new createjs.LoadQueue(true);
        queue.addEventListener("fileload", this.onFileLoaded.bind(this));
        queue.loadManifest(this.manifest);

        this.stage.enableMouseOver(20);
        this.stage.update();
    }

    handleLvlImageLoad() {
        let j = 0;
        let lvl = 1;

        for(let i = 0; i < this.images.length; i++) {
            var bg = new createjs.Bitmap(this.images[i].src);

            j++;
            let cof = j > 1 ? 155 : 10;
            let width = 150;

            let imageBounds = new createjs.Rectangle(10 * j + (cof * (j - 1)),  110 * lvl, width, 100)
            var xScale = imageBounds.width/this.imagesSize[i].width;
            var yScale = imageBounds.height/this.imagesSize[i].height;
            bg.scaleX = xScale;
            bg.scaleY = yScale;
            bg.x = 10 * j + (cof * (j - 1));
            bg.y = 110 * lvl;

            if (j >= 6) {
                j = 0;
                lvl++;
            }

            this.stage.setChildIndex(bg, 2);
            this.stage.addChild(bg);
            this.renderButtonText(this.level.answers[i].title, bg.x, bg.y + imageBounds.height + 15);
        }
        this.stage.setChildIndex(bg, 50);
        this.stage.update();
    }

    renderButtonText(text, x, y) {
        var text = new createjs.Text(text, "18px Arial", "#fff");
        text.x = x + 5;
        text.y = y;
        this.container= new createjs.Container();
        this.container.addChild(text);  
        this.stage.addChild(this.container);
    }

    onFileLoaded = function(ev)
    {
        let img = new Image()
        img.src = ev.item.src;
        img.onload = this.onloadImg.bind(this);

        this.images.push(ev.item);
    }

    onloadImg(ev) {
        this.imagesSize.push({
            width: ev.path[0].width,
            height: ev.path[0].height,
        });

        if (this.imagesSize.length >= this.level.answers.length) {
            this.handleLvlImageLoad();
        }
    }
}