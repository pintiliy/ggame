import Core from "./Core.js";

export default class Game3 extends Core {
    constructor() {
        super();
        this.setBackground();
        this.file = $('body').data('file');
        this.loadTask(this.file);
        this.loadAudio();
        this.container = [];
        this.imgContainer = [];
        this.taskTitle = "Уважно прочитай коротку інформацію про видатного плавця та згадай, кому з представлених нижче спортсменів вона належить. Обери правильну відповідь";
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
            if (this.buttons[i]) {
                this.stage.removeChild(this.buttons[i].bg);
            }
            this.buttons[i] = {};
            var hitArea = new createjs.Shape();
            j++;
            let margin = 100;
            let width = this.width / 2 - (margin * 2);
            hitArea.graphics.beginStroke("#662400").f("#D94F04").r(this.width / 2 * (j - 1) + margin, 400, width, 300);
            this.buttons[i].bg = hitArea.clone();
            this.buttons[i].bg.cursor = "pointer";
            this.stage.addChild(this.buttons[i].bg);

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
                    hitArea.graphics.setStrokeStyle(4).beginStroke("#C62017").r(ev.target.graphics.command.x, ev.target.graphics.command.y, width, 300);
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
            if (this.imgContainer[i]) {
                this.stage.removeChild(this.imgContainer[i]);
            }
            this.imgContainer[i] = new createjs.Bitmap(this.images[i].src);

            j++;
            let margin = 100;
            let width = this.width / 2 - (margin * 2);

            let imageBounds = new createjs.Rectangle(this.width / 2 * (j - 1) + margin, 400, width, 260)
            var xScale = imageBounds.width/this.imagesSize[i].width;
            var yScale = imageBounds.height/this.imagesSize[i].height;
            this.imgContainer[i].scaleX = xScale;
            this.imgContainer[i].scaleY = yScale;
            this.imgContainer[i].x = this.width /2 * (j - 1) + margin;
            this.imgContainer[i].y = 400;

            if (j >= 3) {
                j = 0;
            }

            this.stage.setChildIndex(this.imgContainer[i], 2);
            this.stage.addChild(this.imgContainer[i]);
            this.renderButtonText(this.level.answers[i].title, this.imgContainer[i].x, this.imgContainer[i].y + imageBounds.height + 15, i);
        }

        this.stage.update();
    }

    renderButtonText(text, x, y, i = 0) {
        if (this.container[i]) {
            this.stage.removeChild(this.container[i]);
        }
        var text = new createjs.Text(text, "18px Arial", "#fff");
        text.x = x + 5;
        text.y = y;
        this.container[i] = new createjs.Container();
        this.container[i].addChild(text);  
        this.stage.addChild(this.container[i]);
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