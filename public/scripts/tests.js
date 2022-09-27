export default class Tests {
    constructor() {
        this.trueAnswers = [];
        fetch(`../tasks/tests.json`)
            .then((response) => response.json())
            .then((json) => {
                this.tasks = json;
                this.countLevels = this.tasks.length;
                this.renderItems();
            });

        $('#form-test').on('submit', (e) => {
            e.preventDefault();
            let answers = $(e.target).serializeArray();
            if (answers.length < this.countLevels) {
                Swal.fire('Ви не дали відповіді на усі запитання!');
                return;
            }
            let userAnswers = answers.map(a => parseInt(a.value));
            let diff = this.diff(this.trueAnswers, userAnswers);
            
            if (diff.length) {
                Swal.fire(`Ви дали ${this.countLevels - diff.length} правильних відповідей з ${this.countLevels}!`);
            } else {
                Swal.fire(`Вітаємо! Ви відповіли вірно на усі запитання!`);
            }
        });
    }

    renderItems() {
        this.tasks.forEach((test, i) => {
            let copy = $('.item-for-copy').clone();
            copy.find('.title').text(`${i + 1}. ${test.title}`);
            copy.find('.items').html('');

            test.answers.forEach((answer, j) => {
                let letters = {
                    0: 'a)',
                    1: 'b)',
                    2: 'c)'
                };

                let answerForCopy = $('.answer-for-copy').first().clone()
                answerForCopy.removeClass('answer-for-copy');
                copy.removeClass('d-none').removeClass('item-for-copy');
                answerForCopy.find('input')
                    .attr('id', `item-${i}-${j}`)
                    .attr('name', `radio[${i}][]`)
                    .attr('value', j);
                answerForCopy.find('label').text(`${letters[j]} ${answer.title}`).attr('for', `item-${i}-${j}`);
                copy.find('.items').append(answerForCopy);
                if (answer.true) {
                    this.trueAnswers.push(j);
                }
            });
            $('.form-tests').append(copy);
        })
    }

    diff(arr1, arr2) {
        let difference = [];
        arr1.forEach((e, i) => {
            if (arr2[i] !== e) {
                difference.push(e);
            }
        });

        return difference;
    }
}