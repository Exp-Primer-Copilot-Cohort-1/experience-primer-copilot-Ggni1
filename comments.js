// Create web server

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { readComments, writeComments } = require('./comments');

app.use(cors());
app.use(bodyParser.json());

app.get('/comments', (req, res) => {
  readComments().then((comments) => {
    res.json(comments);
  });
});

app.post('/comments', (req, res) => {
  const { name, comment } = req.body;

  readComments().then((comments) => {
    comments.push({ name, comment });
    writeComments(comments).then(() => {
      res.json({ name, comment });
    });
  });
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});

// Path: comments.js
// Read and write comments

const fs = require('fs');

const COMMENTS_FILE = './comments.json';

const readComments = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(COMMENTS_FILE, (err, data) => {
      if (err) {
        resolve([]);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

const writeComments = (comments) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = { readComments, writeComments };

// Path: comments.json
// []

// Path: index.html
// Create a simple form

<!DOCTYPE html>
<html>
  <head>
    <title>Comments</title>
  </head>
  <body>
    <h1>Comments</h1>
    <form id="commentForm">
      <input type="text" name="name" placeholder="Name" required>
      <textarea name="comment" placeholder="Comment" required></textarea>
      <button type="submit">Submit</button>
    </form>
    <ul id="comments"></ul>
    <script src="comments.js"></script>
  </body>
</html>

// Path: comments.js
// Create a function to fetch and render comments

const commentForm = document.getElementById('commentForm');
const commentsList = document.getElementById('comments');

const fetch