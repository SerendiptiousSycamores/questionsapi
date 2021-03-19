const db = require('../db');

const loopAnswersToGetPhotos = (answers, object) => {
  return Promise.all(answers.map(answer=>{
    return db.query('SELECT * FROM photos WHERE answer_id = $1',[answer.id])
      .then(photos=>{
        answer.photos = photos.rows;
        return answer;
      })
  }));
};

const loopQuestionsToGetAnswers = (questions) => {
  return Promise.all(questions.map(question=>{
    return db.query('SELECT * from answers where question_id = $1',[question.id])
      .then(returnedAnswers => {
        let returnedQuestion = question;
        return Promise.all(returnedAnswers.rows.map(answer=>{
          return db.query('select url,id from photos where answer_id = $1', [answer.id])
            .then(photos=>{
              answer.photos = photos.rows;
              return answer;
            })
        }))
          .then(values=>{
            const obj = {}
            for (var answer of values) {
              obj[answer.id] = answer;
            }
            return obj;
          })
          .then(finalResult=>{
            returnedQuestion.answers = finalResult;
            // console.log(returnedQuestion)
            return returnedQuestion;
          })
        // console.log(returnedAnswers)
        // let answers = returnedAnswers.rows[0].json_object_agg
        // let keys = Object.keys(answers);
        // Promise.all(Object.keys(answers).map(key=>{
        //   return db.query('select url,id from photos where answer_id = $1', [key])
        //     .then(photos=>{
        //       console.log(photos)
        //       answers[key].photos = photos.rows;
        //       return answers[key];
        //     })
        // }))
        //   .then(values=>console.log(values))
      })
  }));
};



exports.getQuestions = (req,res) => {
  const responseObj = {};
  const {product_id, count} = req.query;

  db.query('SELECT * FROM questions WHERE product_id = $1 ORDER BY question_date DESC limit $2', [product_id,  count || 5])
    .then(result=>{
      responseObj.product_id = product_id;
      let questions = result.rows;
      loopQuestionsToGetAnswers(questions)
        .then(values=>{
          responseObj.results = values;
          res.send(responseObj);
        })
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
  const {question_id, count, page} = req.query;
  const responseObj = {};
  responseObj.question_id = question_id;
  // what is page?
  responseObj.page = 0;
  const answer = [];
  db.query('SELECT * from answers where question_id = $1 order by created_at desc limit $2',[question_id, count || 5 ])
    .then(result=>{
      let answers = result.rows;
      loopAnswersToGetPhotos(answers)
        .then(values=>{
          responseObj.count = values.length;
          responseObj.results = values;
          res.send(responseObj);
        })
    })
    .catch(err=>{throw err});
}

exports.postAnswer =  (req,res) => {
  const {body, name, email, photos} = req.body;
  const {question_id} = req.query;
  db.query('INSERT INTO answers (answer_body, answerer_name, answerer_email, question_id, created_at) values($1, $2, $3, $4, $5)', [body, name, email, question_id, new Date().toJSON()])
    .then(success=>{
      if (photos.length !== 0) {
        db.query("SELECT currval('answers_id_seq')")
          .then(lastIndex=>{
            Promise.all(photos.map(photo=>{
              return db.query('INSERT INTO photos (url, answer_id) values($1, $2)', [photos, lastIndex.rows[0].currval])
                .then(success=>console.log(`inserted photo for answer id: ${lastIndex}` ))
            }))
            .then(photoSuccess => res.send(`posted answer and inserted ${photos.length} photos`))
          })
          .catch(err=>{throw err})
      } else {
        res.send('posted answer!')
      }
    })
    .catch(err=>{throw err})
}

exports.upvoteAnswer =  (req,res) => {
  const {answer_id} = req.body;
  db.query('SELECT helpfulness from answers where id = $1 ',
  [answer_id])
    .then(result=>{
      return db.query('UPDATE answers SET helpfulness = $1 WHERE id = $2', [result.rows[0].helpfulness+1, answer_id]);
    })
    .then(finished=>res.send(`Upvoted an answer with answer id: ${answer_id}`))
    .catch(err=>{throw err});

}

exports.reportAnswer =  (req,res) => {
  const {answer_id} = req.body;
  db.query('UPDATE answers SET reported = true WHERE id = $1',[answer_id])
    .then(result=>{
      res.send(`Reported question with answer id ${answer_id}`);
    })
    .catch(err=>{throw err});

}