class InputBloom extends canvasBase {
  constructor(node, options) {
    super(node, options);
    let { dotNumber } = options;
    this.input = null;
    this.wordsList = [];
    //{name ,x,y}
    this.renderIndex = 0;
    this.dotNumber = dotNumber || 12;
    this.testOffset = 0;
  }
  close() {
    super.close();
    this.input.remove();
    this.input = null;
  }
  init() {
    super.init();
    this.input = this.mountNode.querySelector("input");
    if (
      !(
        this.input instanceof Element &&
        (this.input.nodeName === "INPUT" || this.input.nodeName === "TEXTAREA")
      )
    ) {
      throw new Error("can not find input element");
    } else {
      this.input.style.fontSize = "12px";
      this.input.style.paddingLeft = "5px";
      this.input.style.position = "relative";
      this.input.style.zIndex = "10";
      this.canvas.style.position = "absolute";
      this.canvas.style.left = "5px";
      this.canvas.style.top =
        "-" + (this.contextHeight - this.input.offsetHeight) / 2 + "px";
      this.ctx.font = "12px";
    }
    this.ctx.fillStyle = "#fff";
    this.bindEvent();
    //this.contextHeight = this.canvas.height = 100;
  }
  render() {
    super.render();

    for (let i = 0; i < this.wordsList.length; i++) {
      let item = this.wordsList[i];

      if (item[0].currentEtc == 40) {
        this.wordsList.splice(i, 1);
        i--;
        break;
      }
      for (let c = 0; c < item.length; c++) {
        let dot = item[c];
        let { x, y } = dot;
        this.ctx.fillRect(x, y, 1, 1);
        this.changeWordsState(dot);
      }
    }
    //this.ctx.save()
  }
  /**
   *
   * @param {Object} obj |粒子对象
   */
  changeWordsState(obj) {
    let { x, currentEtc, number, y, originY, growStop } = obj;
    let newX, newY;
    let xDirect = number % 2 == 0 ? 1 : -1;

    //先让它直线上升一会儿，到点了就按抛物线轨迹开始下落
    if (currentEtc < growStop) {
      let getY = function(X) {
        return 2 / X;
      };
      newY = y - getY(currentEtc / 2);
      newX = x;
    } else {
      let getY = function(R, X) {
        return Math.pow(R / 4, 2) - Math.pow((X - R) / 4, 2);
      };
      let startGoTop = 0;
      for (let i = 1; i <= growStop - 1; i++) {
        startGoTop += 2 / i / 2;
      }

      let ratio = Math.ceil((number - growStop) / 2);

      newY = y - getY(ratio, (currentEtc - growStop) / 2);
      newX = x + xDirect / 2;
    }

    obj.x = newX;
    obj.y = newY;
    obj.currentEtc = currentEtc + 1;
  }
  appendContext() {
    super.appendContext();
  }
  bindEvent() {
    this.input.addEventListener("input", this.drawNewWord.bind(this));
  }
  drawMain() {
    super.drawMain();
  }
  drawNewWord(e) {
    let value = e.target.value;

    //TODO 用e.target.到left-border的距离判断offseX，
    let code = document.createElement("code");
    code.innerHTML = value;
    document.body.appendChild(code);
    let txtWidth = code.offsetWidth;
    code.remove();

    this.generateWordData(txtWidth + 5);
  }
  generateWordData(offsetX) {
    let arr = [],
      ox,
      oy;
    for (let i = 0; i < this.dotNumber; i++) {
      ox = offsetX + (Math.floor(Math.random() * 6) - 3);
      oy = this.contextHeight / 2 + Math.floor(Math.random() * 6) - 3;
      arr.push({
        x: ox,
        y: oy,
        number: i + 1,
        currentEtc: 1,
        growStop: 10 + Math.floor(Math.random() * 8),
        originX: ox,
        originY: oy
      });
    }
    this.wordsList.push(arr);
  }
}

export default InputBloom;
