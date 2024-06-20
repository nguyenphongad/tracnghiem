const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const filePath = path.join(__dirname, 'questions.json');

app.post('/save-question', (req, res) => {
    const questions = req.body;
    fs.writeFile(filePath, JSON.stringify(questions, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to save questions.');
        }
        res.send('Questions saved successfully.');
    });
});

app.get('/questions', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to read questions.');
        }
        res.json(JSON.parse(data));
    });
});

app.delete('/delete-question/:index', (req, res) => {
    const questionIndex = parseInt(req.params.index, 10);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to read questions.');
        }
        const questions = JSON.parse(data);
        if (questionIndex < 0 || questionIndex >= questions.length) {
            return res.status(400).send('Invalid question index.');
        }
        questions.splice(questionIndex, 1);
        fs.writeFile(filePath, JSON.stringify(questions, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed to save questions.');
            }
            res.send('Question deleted successfully.');
        });
    });
});

app.put('/update-question/:index', (req, res) => {
    const questionIndex = parseInt(req.params.index, 10);
    const updatedQuestion = req.body;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to read questions.');
        }
        const questions = JSON.parse(data);
        if (questionIndex < 0 || questionIndex >= questions.length) {
            return res.status(400).send('Invalid question index.');
        }
        questions[questionIndex] = updatedQuestion;
        fs.writeFile(filePath, JSON.stringify(questions, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed to save questions.');
            }
            res.send('Question updated successfully.');
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
