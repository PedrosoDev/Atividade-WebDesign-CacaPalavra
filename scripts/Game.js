const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const heightScreen = () => { return (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight); };

const widthScreen = () => { return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth); };

const wordsCords = new Map();

class Game {

    constructor(column, line) {
        this.column = column;
        this.line = line;
        this.wordSearch = [];

        for (let j = 0; j < this.line; j++) {
            this.wordSearch[j] = [];
            for (let i = 0; i < this.column; i++) {
                this.wordSearch[j][i] = null;
            }
        }

        const gameBoard = document.getElementById("gameboard");
        gameBoard.style.height = (line * 27) + "px";
        document.getElementById("wordsList").style.height = (line * 27) + "px";
        gameBoard.style.width = (column * 27) + "px";
    }

    createWordSearch() {

        const gameBoard = document.getElementById("gameboard");
        let div;
        for (let j = 0; j < this.line; j++) {
            for (let i = 0; i < this.column; i++) {
                div = document.createElement("div");
                div.className = "gameSquare notSeletor";
                div.id = j + " " + i;
                div.innerHTML = (this.wordSearch[j][i] == null ? "" : this.wordSearch[j][i]);
                gameBoard.appendChild(div);
            }
        }

        console.log(this.wordSearch);

    }

    randomLetters() {

        for (let j = 0; j < this.line; j++) {
            for (let i = 0; i < this.column; i++) {
                let letter = alphabet[Math.floor((Math.random() * alphabet.length))];
                this.wordSearch[j][i] = (this.wordSearch[j][i] == null ? letter : this.wordSearch[j][i]);
            }
        }

    }

    generateWord(word, columnDefault, lineDefault, position, reverse) {

        word = (reverse ? this.reverseWord(word) : word).toUpperCase();

        let column;
        let line;

        for (let i = 0; i < word.length; i++) {
            column = position.column(columnDefault, i);
            line = position.line(lineDefault, i);

            const letter = word[i];
            this.wordSearch[line][column] = letter;

        }

        wordsCords.set(lineDefault + " " + columnDefault + " " + line + " " + column, (reverse ? this.reverseWord(word) : word));

    }

    canGenerateWord(word, columnDefault, lineDefault, position) {

        word = word.toUpperCase();
        let resp = true;

        for (let i = 0; i < word.length; i++) {
            let column = position.column(columnDefault, i);
            let line = position.line(lineDefault, i);

            if (column < 0 || column > this.column - 1 ||
                line < 0 || line > this.line - 1) {
                resp = false;
                break;
            }

            // if (this.wordSearch[line][column] != null && this.wordSearch[line][column] != "") {
            //     if (this.wordSearch[line][column] != word[i]) {
            //     resp = false;
            //     break;
            //     }
            // }

            if (this.wordSearch[line][column] != null) {
                resp = false;
                break;
            }

        }

        return resp;

    }

    generateWords(words) {

        let repeat = false;
        const positionsList = [Positions.Horizontal, Positions.Vertical, Positions.DiagonalLeft, Positions.DiagonalRight];

        const wordList = document.getElementById("wordsList");
        const width = Math.ceil(words.length / 10);


        for (let i = 0; i < words.length; i++) {

            const word = words[i].toUpperCase();

            const paragraph = document.createElement("p");
            paragraph.classList.add("words");
            paragraph.classList.add("notSeletor");
            paragraph.id = word;
            paragraph.innerHTML = word;
            wordList.appendChild(paragraph);

            do {

                repeat = false;

                const reverse = Math.floor((Math.random() * 2)) == 0;
                const position = positionsList[(Math.floor((Math.random() * positionsList.length)))];
                const column = Math.floor((Math.random() * this.column));
                const line = Math.floor((Math.random() * this.line));

                if (this.canGenerateWord(word, column, line, position)) {
                    this.generateWord(word, column, line, position, reverse);
                } else {
                    repeat = true;
                }

            } while (repeat);

        }

    }

    reverseWord(word) {
        return word.split("").reverse().join("");
    }

    getWordSearch() {
        return this.wordSearch;
    }

    counter = 0;
    checkFoundWord(firstCords, finalCords,) {

        let resp = null;

        const word = wordsCords.get(firstCords + " " + finalCords);
        const wordReverse = wordsCords.get(finalCords + " " + firstCords);
        let wordElement = null;
        if (word != null) {
            wordElement = document.getElementById(word);
            resp = word;
        } else if (wordReverse != null) {
            wordElement = document.getElementById(wordReverse);
            resp = wordReverse;
        }

        if (wordElement != null) {
            wordElement.style.textDecoration = "line-through";
            wordElement.style.color = "#d6d6d6";
        }

        return resp;

    }

    checkAllWordsFound() {

        let resp = true;

        const words = document.getElementsByClassName("words");

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word.style.textDecoration != "line-through") {
                resp = false;
                break;
            }
        }

        return resp;

    }

}

function showTip(word) {

    wordsCords.forEach((value, key) => {

        if (value == word) {

            let lineFirst = Cords.lineFirst(key);
            let columnFirst = Cords.columnFirst(key);
            let lineFinal = Cords.lineFinal(key);
            let columnFinal = Cords.columnFinal(key);

            const gameSquareFirst = document.getElementById(lineFirst + " " + columnFirst);
            const gameSquareFinal = document.getElementById(lineFinal + " " + columnFinal);

            createLine(getPos(gameSquareFirst, gameboard).x, getPos(gameSquareFirst, gameboard).y,
                getPos(gameSquareFinal, gameboard).x, getPos(gameSquareFinal, gameboard).y,
                "lineTip",
                "#f5dc22");
        }

    }, wordsCords);

}

function removeTip() {
    const line = document.getElementById("lineTip");
    if (line) line.remove();
}

let Positions = {
    Horizontal: {
        line: (defaultLine, index) => defaultLine,
        column: (defaultColumn, index) => defaultColumn + index
    },

    Vertical: {
        line: (defaultLine, index) => defaultLine + index,
        column: (defaultColumn, index) => defaultColumn
    },

    DiagonalLeft: {
        line: (defaultLine, index) => defaultLine + index,
        column: (defaultColumn, index) => defaultColumn - index
    },

    DiagonalRight: {
        line: (defaultLine, index) => defaultLine + index,
        column: (defaultColumn, index) => defaultColumn + index
    },
};

let Cords = {
    lineFirst: (cords) => cords.split(" ")[0],
    columnFirst: (cords) => cords.split(" ")[1],

    lineFinal: (cords) => cords.split(" ")[2],
    columnFinal: (cords) => cords.split(" ")[3],
};

function createLine(x1, y1, x2, y2, lineId, color) {

    // the distance between the tow points(for the line div width)
    let distance = Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));

    // the mid-point between the two points, we use it as rotation center
    let xMid = (x1 + x2) / 2;
    let yMid = (y1 + y2) / 2;

    // get the salope of the line between two points
    let salopeInRadian = Math.atan2(y1 - y2, x1 - x2);
    let salopeInDegrees = (salopeInRadian * 180) / Math.PI;

    // change the css of the line to
    let line = document.getElementById(lineId);

    if (line == null) {
        line = document.createElement("div");
        line.className = "line";
        line.id = lineId;
        document.getElementById("gameboard").appendChild(line);
    }

    line.style.width = distance + 24;
    line.style.top = (yMid);
    line.style.left = (xMid - (distance / 2));
    line.style.transform = "rotate(" + salopeInDegrees + "deg)";
    line.style.backgroundColor = (color == null ? black : color);

}
