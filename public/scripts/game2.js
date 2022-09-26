import Core from "./Core.js";

export default class Game2 extends Core {
    constructor() {
        super();
        this.setBackground();
        this.file = $('body').data('file');
        this.loadTask(this.file);
        this.loadAudio();
        this.taskTitle = "Обери зображення видів плавання, представлених у програмі Олімпійських ігор";
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
        let j = 0;
        for(let i = 0; i < buttons.length; i++) {
            this.buttons[i] = {};
            var hitArea = new createjs.Shape();
            j++;
            let cof = i < 3 ? 1 : 2;
            let margin = 20;
            let width = this.width / 3 - (margin * 3);
            hitArea.graphics.beginStroke("#662400").f("#D94F04").r(this.width / 3 * (j - 1) + margin * 1.5, 250 * cof, width, 200);
            this.buttons[i].bg = hitArea.clone();
            this.buttons[i].bg.cursor = "pointer";
            this.stage.addChild(this.buttons[i].bg);

            if (j >= 3) {
                j = 0;
            }

            this.manifest.push(
                {src:`../images/${buttons[i].img}`, id:`img-${i}`}
            );

            this.buttons[i].bg.addEventListener("click", (ev) => {
                this.stage.removeChild(this.buttons[i].bg);
                if (!!buttons[i].true) {
                    createjs.Sound.play('correct');

                    let hitArea = new createjs.Shape();
                    hitArea.graphics.setStrokeStyle(4).beginStroke("#5AC642").r(ev.target.graphics.command.x, ev.target.graphics.command.y, width, 200);
                    this.buttons[i].bg = hitArea.clone();
                    this.stage.addChild(this.buttons[i].bg);

                    this.nextLevelOrFinish();
                } else {
                    this.fails++;
                    this.renderCountFails();
                    createjs.Sound.play('fail');

                    let hitArea = new createjs.Shape();
                    hitArea.graphics.setStrokeStyle(4).beginStroke("#C62017").r(ev.target.graphics.command.x, ev.target.graphics.command.y, width, 200);
                    this.buttons[i].bg = hitArea.clone();
                    this.stage.addChild(this.buttons[i].bg);
                }

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
        for(let i = 0; i < this.images.length; i++) {
            var bg = new createjs.Bitmap(this.images[i].src);

            j++;
            let cof = i < 3 ? 1 : 2;
            let margin = 20;
            let width = this.width / 3 - (margin * 3);

            let imageBounds = new createjs.Rectangle(this.width / 3 * (j - 1) + margin * 1.5, 250 * cof, width, 150)
            var xScale = imageBounds.width/this.imagesSize[i].width;
            var yScale = imageBounds.height/this.imagesSize[i].height;
            bg.scaleX = xScale;
            bg.scaleY = yScale;
            bg.x = this.width / 3 * (j - 1) + margin * 1.5;
            bg.y = 250 * cof;

            if (j >= 3) {
                j = 0;
            }

            this.stage.setChildIndex(bg, 2);
            this.stage.addChild(bg);
            this.renderButtonText(this.level.answers[i].title, bg.x, bg.y + imageBounds.height + 15);
        }

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