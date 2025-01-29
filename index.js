
class Problem {
    constructor(data) {
        this.question = data.question;
        this.options = data.options;
        this.answer = data.answer;
    }
}

class MathGame {
    constructor() {
        this.level = 1;
        this.operation = "+";
        this.problems = [];
        this.score = 0;
        this.problemsCount = 20;
        this.startTime;
    }

    start = () => {
        this.showSection("game");

        this.startTime = Date.now();

        this.generate();
        this.change(0);
        this.updateTimer();
    }

    addEvents = () => {
        level.addEventListener("change", () => {
            this.level = Number(level.value);
        });
        operation.addEventListener("change", () => {
            this.operation = operation.value
        });
        problemsCountInput.addEventListener("change", () => {
            this.problemsCount = Number(problemsCountInput.value)
        });


        const buttons = game.querySelectorAll("button");
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const option = button.getAttribute("data-option");
                const index = button.getAttribute("data-index");
                if (option === this.problems[index].answer) {
                    this.score++;
                }
                this.change(Number(index) + 1);
            });
        })
    }

    generate = () => {
        for (let i = 0; i < this.problemsCount; i++) {
            let questionP1;
            let questionP2;
            if (Number(this.level) === 1) {
                questionP1 = Math.ceil(Math.random() * 10);
                questionP2 = Math.ceil(Math.random() * 10);
            }
            else if (Number(this.level) === 2) {
                questionP1 = Math.ceil(Math.random() * 100);
                questionP2 = Math.ceil(Math.random() * 100);
            }
            else {
                questionP1 = (Math.random() * 1000).toFixed(2);
                questionP2 = (Math.random() * 1000).toFixed(2);
            }
            let answer, a, b, c, d;

            switch (this.operation) {
                case "+": answer = Number(questionP1) + Number(questionP2); break;
                case "-": answer = Number(questionP1) - Number(questionP2); break;
                case "*": answer = Number(questionP1) * Number(questionP2); break;
                case "/": { questionP1 = (Number(questionP1) + (Math.random() * 5 + 5)).toFixed(2); answer = Number(questionP1) / Number(questionP2); }
            }


            if (this.level === 3) {
                answer = Number(answer.toFixed(2));
                a = (answer + 2).toFixed(2)
                b = (answer - 2).toFixed(2)
                c = (answer + 1).toFixed(2)
                d = (answer - 1).toFixed(2)
            } else {
                if (this.operation === "/") {
                    answer = Number((answer).toFixed(2));
                    a = Number((answer + 2).toFixed(2));
                    b = Number((answer - 2).toFixed(2));
                    c = Number((answer + 1).toFixed(2));
                    d = Number((answer - 1).toFixed(2));
                } else {
                    answer = Math.round(answer);
                    a = Math.round(answer + 2);
                    b = Math.round(answer - 2);
                    c = Math.round(answer + 1);
                    d = Math.round(answer - 1);
                }
            }

            const question = `${questionP1} ${this.operation} ${questionP2}`;

            const random = Math.random();
            const correctAnswer = random < 0.25 ? 'a' : random < 0.5 ? 'b' : random < 0.75 ? "c" : random <= 1 ? "d" : undefined;




            this.problems.push(
                new Problem({
                    question,
                    options: {
                        a: correctAnswer === "a" ? answer : a,
                        b: correctAnswer === "b" ? answer : b,
                        c: correctAnswer === "c" ? answer : c,
                        d: correctAnswer === "d" ? answer : d
                    },
                    answer: correctAnswer
                }))
        }
    }

    change = (index) => {
        if (index == this.problems.length) {
            this.result();
            return;
        }
        const span = game.querySelector("span");
        const p = game.querySelector("p");
        const btnA = game.querySelector("#btn-a");
        const btnB = game.querySelector("#btn-b");
        const btnC = game.querySelector("#btn-c");
        const btnD = game.querySelector("#btn-d");

        span.textContent = `${index + 1}/${this.problemsCount}`;
        p.textContent = this.problems[index].question;
        btnA.textContent = this.problems[index].options.a;
        btnB.textContent = this.problems[index].options.b;
        btnC.textContent = this.problems[index].options.c;
        btnD.textContent = this.problems[index].options.d;

        btnA.setAttribute("data-index", index);
        btnB.setAttribute("data-index", index);
        btnC.setAttribute("data-index", index);
        btnD.setAttribute("data-index", index);
    }

    result = () => {
        this.showSection("result");

        const p = result.querySelector("p");
        p.textContent = `Score: ${this.score}/${this.problemsCount} \n`;
        const time = (Date.now() - this.startTime) / 1000;
        p.textContent += `Time: ${time}s`;

        this.saveResult();

        this.updateRecords();
    }

    records() {
        this.showSection("result");
        this.updateRecords();
    }

    updateRecords = () => {
        const records = JSON.parse(localStorage.getItem("scores"));
        const table = result.querySelector('.table');
        table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Operation</th>
            <th>Accuracy</th>
            <th>Level</th>
            <th>Duration</th>
            <th>Total</th>
            <th>Corrects</th>
            <th>Speed</th>
            <th>Time</th>
        </tr>
        `;
        if (records === null) return;
        records.forEach((record, index) => {
            let time = '';
            let diffInSec = (Date.now() - record.endTime) / 1000;
            if (diffInSec < 60) {
                time = 'just now';
            } else if (diffInSec < 360) {
                time = (diffInSec / 60).toFixed(0) + 'm ago';
            } else if (diffInSec < 43200) {
                time = (diffInSec / 60 / 60).toFixed(0) + 'h ago';
            } else {
                time = (diffInSec / 60 / 60 / 60).toFixed(0) + 'd ago';
            }
            table.innerHTML +=
                `
                <tr>
                    <td>${index + 1}</td>
                    <td>${record.operation}</td>
                    <td>${record.accuracy.toFixed(0)}%</td>
                    <td>${record.level === 1 ? "Easy" : record.level === 2 ? "Normal" : "Hard"}</td>
                    <td>${record.duration.toFixed(0)}s</td>
                    <td>${record.problems.toFixed(0)}</td>
                    <td>${record.correct.toFixed(0)}</td>
                    <td>${record.speed} q/s</td>
                    <td>${time}</td>
                </tr>
                `;
        });
    }

    updateTimer = () => {
        if (game.style.display === 'block') {
            const time = (Date.now() - this.startTime) / 1000;
            game.querySelector('div').textContent = time + "s"
            requestAnimationFrame(this.updateTimer);
        }
    }

    restart = () => {
        this.problems = [];
        this.score = 0;

        this.showSection("intro")
    }

    saveResult = () => {
        const accuracy = (this.score / this.problemsCount) * 100;
        const duration = (Date.now() - this.startTime) / 1000;
        const object = {
            problems: this.problemsCount,
            correct: this.score,
            level: this.level,
            accuracy,
            endTime: Date.now(),
            duration,
            speed: (duration / this.problemsCount).toFixed(2),
            operation: this.operation,
        };
        let data = JSON.parse(localStorage.getItem("scores"));
        let scores = [];
        if (data !== null) {
            scores = data;
            scores.push(object);
        } else {
            scores.push(object);
        }
        localStorage.setItem("scores", JSON.stringify(scores));
    }

    clearStorage = () => {
        localStorage.clear();
        this.updateRecords();
    }

    showSection(section) {
        if (!section) return;
        game.style.display = section === 'game' ? 'block' : 'none';
        intro.style.display = section === 'intro' ? 'block' : 'none';
        result.style.display = section === 'result' ? 'block' : 'none';
    }
}


const mathgame = new MathGame();

mathgame.addEvents();

const startGame = mathgame.start.bind(mathgame);
const restartGame = mathgame.restart.bind(mathgame);
const clearStorage = mathgame.clearStorage.bind(mathgame);
const showRecords = mathgame.records.bind(mathgame);