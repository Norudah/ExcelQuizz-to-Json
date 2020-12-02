class Answer {
    constructor(choice, points) {
        this.choice =  choice;
        this.points = points;
    }
}

class Question {

    constructor(title) {
        this.title = title;
        this.answers = [];
    }

    // addChoice = (choice, points) => {
    //     const answer = new Answer(choice, points);
    //     this.answers.push(answer);
    // }

    addChoice2 = (choice, points) => this.answers.push(new Answer(choice, points));
}



const input = document.querySelector("#inputField");

input.addEventListener("change", () => {
    const files = input.files;

    if (files === 0) return 0;
    else {
        console.log(input.files);

        const file = files[0];
        const fileName = files[0].name;
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;

            const workbook = XLSX.read(data, {type: "binary"});
            const name = workbook.SheetNames[0]; // Prends uniquement le classeur Questions sans la bèreme
            const arr = XLSX.utils.sheet_to_json(workbook.Sheets[name]);


            const quizz_data = [];
            let i_questions = -1;

            arr.forEach((value) => {
                // "title" peut être une question ou une réponse
                const title = value["QUESTIONS"];
                const points = value["POINTS"];

                if (title[0] === 'Q') {
                    i_questions++;
                    quizz_data.push(new Question(title))
                } else if (Number.isInteger(parseInt(title[0]))) {
                    quizz_data[i_questions].addChoice2(title, points);
                }

            })

            console.log("tableau du quizz");
            console.log(quizz_data);

            console.log("conversion en Json des données")
            const quizzJson = JSON.stringify(quizz_data);
            console.log(quizzJson);

            console.log("tentive dowload");
            download(fileName+".json", quizzJson);

        }

        reader.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };

        reader.readAsBinaryString(file);

    }
})



function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}








