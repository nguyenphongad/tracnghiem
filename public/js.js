let questions = [];
let editIndex = -1;
let currentSlideIndex = 0;

function themGiaiTich() {
    document.getElementById("addGT").style.display = "block";

}
function dongGiaiTich() {
    document.getElementById("addGT").style.display = "none";

}



document.getElementById('addQuestionBtn').addEventListener('click', () => {
    const question = document.getElementById('question').value;
    const answerA = document.getElementById('answerA').value;
    const answerB = document.getElementById('answerB').value;
    const answerC = document.getElementById('answerC').value;
    const answerD = document.getElementById('answerD').value;
    const correctAnswer = document.querySelector('input[name="correctAnswer"]:checked');
    const gt = document.getElementById('gt').value;

    if (!question || !answerA || !answerB || !answerC || !answerD || !correctAnswer || !gt) {
        alert('Vui lòng nhập đầy đủ thông tin và chọn đáp án đúng.');
        return;
    }

    const newQuestion = {
        cauhoi: question,
        dapan: {
            A: answerA,
            B: answerB,
            C: answerC,
            D: answerD
        },
        dapandung: correctAnswer.value,
        giaithich: gt,
    };

    if (editIndex === -1) {
        questions.push(newQuestion);
    } else {
        questions[editIndex] = newQuestion;
        editIndex = -1;
    }

    fetch('/save-question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(questions)
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            renderQuestions();
        })
        .catch(error => {
            console.error('Error:', error);
        });

    clearForm();
});

function renderQuestions() {
    fetch('/questions')
        .then(response => response.json())
        .then(data => {
            questions = data;
            const questionList = document.getElementById('questionList');
            const totalQuestions = document.getElementById('totalQuestions');
            questionList.innerHTML = '';

            questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('question1');

                const questionText = document.createElement('p');
                questionText.textContent = `Câu ${index + 1}. ${question.cauhoi}`;
                questionDiv.appendChild(questionText);

                const answersList = document.createElement('ul');

                // for (let key in question.dapan) {
                //     const answerItem = document.createElement('li');
                //     answerItem.textContent = `${key}. ${question.dapan[key]}`;
                //     if (key === question.dapandung) {
                //         answerItem.classList.add('correct-answer');
                //     }
                //     answersList.appendChild(answerItem);
                // }

                questionDiv.appendChild(answersList);

                const editButton = document.createElement('button');
                editButton.textContent = 'Sửa';
                editButton.addEventListener('click', () => editQuestion(index));

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Xóa';
                deleteButton.addEventListener('click', () => deleteQuestion(index));

                questionDiv.appendChild(editButton);
                questionDiv.appendChild(deleteButton);

                questionList.appendChild(questionDiv);
            });

            totalQuestions.textContent = `Tổng  ${questions.length} câu hỏi`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function editQuestion(index) {
    const question = questions[index];
    document.getElementById('question').value = question.cauhoi;
    document.getElementById('answerA').value = question.dapan.A;
    document.getElementById('answerB').value = question.dapan.B;
    document.getElementById('answerC').value = question.dapan.C;
    document.getElementById('answerD').value = question.dapan.D;
    document.querySelector(`input[name="correctAnswer"][value="${question.dapandung}"]`).checked = true;
    document.getElementById('gt').value = question.giaithich;
    editIndex = index;
}

function deleteQuestion(index) {
    fetch(`/delete-question/${index}`, {
        method: 'DELETE'
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            renderQuestions();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function clearForm() {
    document.getElementById('question').value = '';
    document.getElementById('answerA').value = '';
    document.getElementById('answerB').value = '';
    document.getElementById('answerC').value = '';
    document.getElementById('answerD').value = '';
    document.getElementById('gt').value = '';
    document.querySelector('input[name="correctAnswer"]:checked').checked = false;
}

// Render questions when the page loads
renderQuestions();


function thuyetTrinh() {
    document.getElementById("show_thuyetTrinh").style.display = "block";
    fetch('/questions')
        .then(response => response.json())
        .then(data => {
            questions = data;
            renderSlides();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function renderSlides() {
    const listSlide = document.getElementById('listSlide');
    listSlide.innerHTML = '';

    questions.forEach((question, index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        if (index !== currentSlideIndex) {
            slide.classList.add('hidden');
        }

        const questionText = document.createElement('div');
        questionText.classList.add('question');
        questionText.textContent = `Câu ${index + 1}/${questions.length}.  ${question.cauhoi}`;
        slide.appendChild(questionText);

        const answers = document.createElement('div');
        answers.classList.add('answers');

        for (let key in question.dapan) {
            const answerItem = document.createElement('div');
            answerItem.textContent = `${key}. ${question.dapan[key]}`;
            answerItem.dataset.correct = key === question.dapandung;
            answerItem.dataset.key = key;
            answerItem.addEventListener('click', () => checkAnswer(answerItem, question.dapandung, question.giaithich));
            answers.appendChild(answerItem);
        }

        slide.appendChild(answers);

        const explanation = document.createElement('div');
        explanation.classList.add('explanation');
        explanation.textContent = question.giaithich;
        explanation.style.display = 'none';
        slide.appendChild(explanation);

        listSlide.appendChild(slide);
    });
}

function checkAnswer(answerItem, correctAnswer, explanation) {
    const isCorrect = answerItem.dataset.correct === 'true';
    if (isCorrect) {
        answerItem.classList.add('correct-answer');
        setTimeout(() => {
            const explanationDiv = answerItem.parentElement.nextElementSibling;
            explanationDiv.style.display = 'block';
        }, 1000);
    } else {
        answerItem.classList.add('incorrect-answer');
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.add('hidden'));
    slides[index].classList.remove('hidden');
}

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentSlideIndex < questions.length - 1) {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        showSlide(currentSlideIndex);
    }
});

function hideTT() {
    document.getElementById("show_thuyetTrinh").style.display = "none";
}


function hideTT() {
    document.getElementById("show_thuyetTrinh").style.display = "none";
}