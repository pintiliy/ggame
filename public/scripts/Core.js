export default class Core {
    constructor() {
        this.width = 1000;
        this.height = 800;
        this.stage = new createjs.Stage('canvas');
        this.lvl = 0;
        this.countLevels = 0;
        this.timer = 0;
        this.multiAnswers = 0;
        this.trueAnswers = 0;
        this.trueUserAnswers = 0;
        this.fails = 0;
        this.header = null;
        this.buttons = [];
        this.file = null;
        this.manifest = [];
        this.images = [];
        this.imagesSize = [];
        this.gameOverVariable = false;
        this.taskTitle = null;
        this.setBackground();
    }

    async loadTask(file) {
        fetch(`../tasks/${file}.json`)
            .then((response) => response.json())
            .then((json) => {
                this.tasks = json;
                this.countLevels = this.tasks.length;
                this.run();
                this.play();
            });
    }

    setBackground(background = "../images/background.jpg") {
        this.img = new Image();
		this.img.onload = this.handleImageLoad.bind(this);
		this.img.src = background;
    }

    handleImageLoad() {
        if (this.bg) {
            this.stage.removeChild(this.bg);
        }
        this.bg = new createjs.Bitmap(this.img);
        let imageBounds = new createjs.Rectangle(0,0, 1000, 800)
        var xScale = imageBounds.width/this.img.width;
        var yScale = imageBounds.height/this.img.height;
        this.bg.scaleX = xScale;
        this.bg.scaleY = yScale;
        this.stage.addChild(this.bg);
        this.stage.setChildIndex(this.bg, 0);
        this.stage.update();
    }

    renderCountTasks() {
        this.stage.removeChild(this.lvlContainer);
        var text = new createjs.Text(`${this.lvl + 1} / ${this.countLevels}`, "25px Arial", "#F29325");
        text.x = 20;
        text.y = this.height - 30;
        this.lvlContainer = new createjs.Container();
        this.lvlContainer.addChild(text);
        this.stage.addChild(this.lvlContainer);
        this.stage.setChildIndex(this.lvlContainer, 3);
        this.stage.update();
    }

    renderTimer() {
        this.timer = new Date();
        let time = setInterval(() => {
            if (this.gameOverVariable) {
                window.clearTimeout(time);
                return;

            }
            this.stage.removeChild(this.timerContainer);
            let timer = new Date();
            var diff = timer.getTime() - this.timer.getTime();
            var msec = diff;
            var hh = Math.floor(msec / 1000 / 60 / 60);
            msec -= hh * 1000 * 60 * 60;
            var mm = Math.floor(msec / 1000 / 60);
            msec -= mm * 1000 * 60;
            var ss = Math.floor(msec / 1000);
            msec -= ss * 1000;
            this.timerText = `${mm} хв : ${ss} сек`;
            let text = new createjs.Text(this.timerText, "25px Arial", "#F29325");
            text.x = this.width - 140;
            text.y = this.height - 30;

            this.timerContainer = new createjs.Container();
            this.timerContainer.addChild(text);
            this.stage.addChild(this.timerContainer);
            this.stage.update();
        }, 1000);
    }

    renderCountFails() {
        this.stage.removeChild(this.countFails);
        var text = new createjs.Text(`помилки - ${this.fails}`, "25px Arial", "#F29325");
        text.x = this.width / 2 - 60;
        text.y = this.height - 30;
        this.countFails= new createjs.Container();
        this.countFails.addChild(text);
        this.stage.addChild(this.countFails);
        this.stage.setChildIndex(this.countFails, 2);
        this.stage.update();
    }

    loadAudio() {
        var audioPath = "../sounds/";
        var sounds = [
            {id:"correct", src:"correct.mp3"},
            {id:"fail", src:"fail.mp3"}
        ];

        createjs.Sound.registerSounds(sounds, audioPath);
    }

    play() {
        var rect = new createjs.Shape();
        rect.graphics.beginFill("#FFF").drawRect(0, 0, this.width, this.height);

        var rect2 = new createjs.Shape();
        rect2.graphics.beginFill("#F2CB05").drawRect(0, 0, 200, 50);
        
        var text = new createjs.Text("Грати", "32px Arial", "#040000");
        text.set({
            lineWidth: 450,
            // textAlign: "center"
        });
        text.hitArea = rect2;
        let bg3 = rect2.clone();
        text.x += 50;
        text.y += 10;
        
        this.playContainer = new createjs.Container();
        this.playContainer.addChild(rect);

        this.buttonContainer = new createjs.Container();
        this.buttonContainer.cursor = "pointer";
        this.buttonContainer.x = this.width / 2 - 100;
        this.buttonContainer.y = this.height / 2 - 25;
        this.buttonContainer.addChild(bg3, text);

        // this.playContainer.addChild(rect);
        // this.playContainer.addChild(text);
        this.stage.addChild(this.playContainer);
        this.renderTitle(this.taskTitle);
        this.stage.addChild(this.buttonContainer);
        
        // this.stage.setChildIndex(this.playContainer, 99);
        this.stage.update();
        
        this.buttonContainer.addEventListener("click", () => {
            this.renderTimer();
            this.stage.removeChild(this.playContainer);
            this.stage.removeChild(this.buttonContainer);
            this.stage.removeChild(this.titleBg, this.title);
            
            this.makeAnswersList();
        });

        this.stage.enableMouseOver(20);
    }

    gameOver() {
        this.gameOverVariable = true;
        this.stage.removeAllChildren();

        var rect = new createjs.Shape();
        rect.graphics.beginFill("#FFF").drawRect(0, 0, this.width, this.height);
        
        var rect2 = new createjs.Shape();
        rect2.graphics.beginFill("#F2CB05").drawRect(0, 0, 300, 50);

        var rect3 = new createjs.Shape();
        rect3.graphics.beginFill("#F2CB05").drawRect(0, 0, 300, 50);

        var text = new createjs.Text("Повторити гру", "32px Arial", "#040000");
        text.set({
            lineWidth: 450,
            // textAlign: "center"
        });
        text.hitArea = rect2;
        let bg3 = rect2.clone();
        text.x += 50;
        text.y += 10;

        var text2 = new createjs.Text("Закрити гру", "32px Arial", "#040000");
        text2.set({
            lineWidth: 450,
            // textAlign: "center"
        });
        text2.hitArea = rect3;
        let bg4 = rect2.clone();
        text2.x += 50;
        text2.y += 10;

        this.buttonContainer = new createjs.Container();
        this.buttonContainer.cursor = "pointer";
        this.buttonContainer.x = this.width / 2 - 100;
        this.buttonContainer.y = this.height / 2 - 25;
        this.buttonContainer.addChild(bg4, text);

        this.buttonContainer2 = new createjs.Container();
        this.buttonContainer2.cursor = "pointer";
        this.buttonContainer2.x = this.width / 2 - 100;
        this.buttonContainer2.y = this.height / 2 + 40;

        this.buttonContainer2.addChild(bg3, text2);
        
        this.gameOverContainer = new createjs.Container();

        this.gameOverContainer.addChild(rect);
        // this.gameOverContainer.addChild(text);
        this.stage.addChild(this.gameOverContainer);
        let errors = this.fails ? `Кількість помилок – ${this.fails}` : '';
        this.renderTitle(`Молодець! Гра завершена з результатом, ${this.timerText}. ${errors}`);
        this.stage.addChild(this.buttonContainer);
        this.stage.addChild(this.buttonContainer2);
        this.stage.setChildIndex(this.gameOverContainer, 9999999999999);
        this.stage.update();

        this.buttonContainer.addEventListener("click", () => {
            this.clearAll();
            this.gameOverVariable = false;
            this.renderTimer();
            this.stage.removeChild(this.gameOverContainer);
        });

        this.buttonContainer2.addEventListener("click", () => {
            window.location.href = "/";
        });
    }

    clearAll() {
        this.stage.removeAllChildren();
        this.stage.update();
        this.handleImageLoad();
        this.timer = 0;
        this.fails = 0;
        this.lvl = 0;
        this.multiAnswers = 0;
        this.trueAnswers = 0;
        this.trueUserAnswers = 0;
        this.manifest = [];
        this.images = [];
        this.imagesSize = [];
        this.countLvlTrue = 0;
        this.run();
        this.makeAnswersList();
    }

    setLevel(lvl) {
        this.renderCountTasks();
        this.level = this.tasks[lvl];
        let answers = this.level.answers.filter(i => !!i.true);
        this.multiAnswers = answers.length > 1;
        this.trueAnswers = answers.length;
        if (this.level.background) {
            this.setBackground('../images/'+this.level.background);
        }
    }

    nextLevelOrFinish() {
        this.trueUserAnswers++;
        if (!this.multiAnswers || (this.trueUserAnswers >= this.trueAnswers)) {
            this.lvl++;
            if (this.lvl >= this.countLevels) {
                this.gameOver();
            } else {
                this.manifest = [];
                this.images = [];
                this.imagesSize = [];
                this.countLvlTrue = 0;
                this.run();
                this.makeAnswersList();
            }
        }
    }

    run() {
        this.setLevel(this.lvl);
        this.drawText();
        this.renderCountTasks();
        this.renderCountFails();
    }

    drawText() {
        this.cleanHeader();
        let t = this.level.title;
        if (!t) {
            return;
        }

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

    renderTitle(title) {
        this.title = new createjs.Text(title, "25px Arial", "#000");
        this.title.set({
            lineWidth: 900,
            textAlign: "center"
        });
        var bounds = this.title.getBounds();
        var hitArea = new createjs.Shape();
        hitArea.graphics.f("#fff").r(bounds.x, bounds.y, bounds.width, bounds.height);
        this.title.hitArea = hitArea;
        this.titleBg = hitArea.clone();

        this.title.x = 1000/2;
        this.title.y = 200;

        this.titleBg.x = this.title.x;
        this.titleBg.y = this.title.y;

        this.stage.addChild(this.titleBg, this.title);
    }
}