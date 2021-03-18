const db = require('../db');

exports.getQuestions = (req,res) => {
  const responseObj = {};
  const {product_id, count} = req.query;

  db.query(`SELECT * from questions WHERE product_id = $1 and reported = $2 limit $3`, [product_id, 0, count || 5])
    .then(result=>{
      responseObj.product_id = product_id
      responseObj.results = result.rows;
      const questionList = result.rows.map(result=>`question_id = ${result.id}`);
      return db.query(`SELECT * from answers WHERE ${questionList.join(' or ')}`)
    })
    .then(answers=>{
      responseObj.answers = answers.rows;
      res.send(responseObj);
    })
    .catch(err=>{throw err});
}

exports.postQuestion =  (req,res) => {
  const {body, name, email, product_id} = req.body;
  db.query('INSERT INTO questions(question_body, question_date, asker_name, product_id, asker_email) values($1,$2,$3,$4,$5)',
  [body, new Date().toJSON(), name, product_id, email])
    .then(result=>res.send('posted a question!'))
    .catch(err=>{throw err});
}

exports.upvoteQuestion =  (req,res) => {
  const {question_id} = req.body;
  db.query('SELECT question_helpfulness from questions where id = $1 ',
  [question_id])
    .then(result=>{
      console.log(result.rows[0].question_helpfulness)
      return db.query('UPDATE questions SET question_helpfulness = $1 WHERE id = $2', [result.rows[0].question_helpfulness+1, question_id]);
    })
    .then(finished=>res.send(`Upvoted a question with question ID: ${question_id}`))
    .catch(err=>{throw err});
}

exports.reportQuestion =  (req,res) => {
  const {question_id} = req.body;
  db.query('UPDATE questions SET reported = true WHERE id = $1',[question_id])
    .then(result=>{
      res.send(`Reported question with question id ${question_id}`);
    })
    .catch(err=>{throw err});
}

exports.getAnswers =  (req,res) => {
  const {question_id} = req.query;
  db.query('SELECT * FROM answers WHERE question_id = $1',[question_id])
    .then(result=>res.send(result.rows[0]))
    .catch(err=>{throw err});
}

exports.postAnswer =  (req,res) => {
  res.send('post answers');
}

exports.upvoteAnswer =  (req,res) => {
  res.send('upvote answer');
}

exports.reportAnswer =  (req,res) => {
  res.send('report answer');
}