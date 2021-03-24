const db = require('../db');

exports.getQuestions = (req,res) => {
  const responseObj = {};
  const {product_id, count} = req.query;
  db.query(
    'select array_to_json(array_agg(t)) from (select id, question_body, question_date, asker_name, question_helpfulness, reported,(select json_object_agg(d.id, d) from (select id,answer_body,created_at,answerer_name, helpfulness, reported, ( select array_to_json(array_agg(row_to_json(c))) from ( select id, url from photos where photos.answer_id = answers.id )c ) as photos from answers where answers.question_id = questions.id and answers.reported = false ) d ) as answers from questions where questions.product_id  = $1 and questions.reported = false order by question_helpfulness DESC limit $2 ) t', [product_id, count || 5])
  .then(result=>{
    responseObj.product_id = product_id;
    responseObj.results = result.rows[0]['array_to_json'];
    res.send(responseObj);
  })
  .catch(err=>{throw err})
}

exports.postQuestion =  (req,res) => {
  console.log(req.body)
  const {body, name, email, product_id} = req.body;
  db.query('INSERT INTO questions(question_body, question_date, asker_name, product_id, asker_email) values($1,$2,$3,$4,$5)',
  [body, new Date().toJSON(), name, product_id, email])
    .then(result=>res.send('posted a question!'))
    .catch(err=>{throw err});
}

exports.upvoteQuestion =  (req,res) => {
  const {question_id} = req.params;
  db.query('update questions set question_helpfulness = question_helpfulness + 1 where id = $1',[question_id])
    .then(finished=>res.send(`Upvoted a question with question ID: ${question_id}`))
    .catch(err=>{throw err});
}

exports.reportQuestion =  (req,res) => {
  const {question_id} = req.params;
  db.query('UPDATE questions SET reported = true WHERE id = $1',[question_id])
    .then(result=>{
      res.send(`Reported question with question id ${question_id}`);
    })
    .catch(err=>{throw err});
}

exports.getAnswers =  (req,res) => {
  const {question_id, count, page} = req.query;
  const responseObj = {question:question_id,count: count || 5 ,page:0};
  db.query(
    'select array_to_json(array_agg(row_to_json(t))) from (select id,answer_body,created_at,answerer_name, helpfulness, reported, (select array_to_json(array_agg(row_to_json(d))) from ( select id, url from photos where photos.answer_id  = answers.id )d ) as photos  from answers where answers.question_id = $1 and answers.reported = false order by helpfulness DESC limit $2)t', [question_id, responseObj.count])
      .then(result=>{
        responseObj.results = result.rows[0]['array_to_json']
        res.send(responseObj);
      })
      .catch(err=>{throw err})


}

exports.postAnswer =  (req,res) => {
  const {body, name, email, photos,question_id} = req.body;
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
  const {answer_id} = req.params;
  db.query('update answers set helpfulness = helpfulness + 1 where id = $1',[answer_id])
    .then(finished=>res.send(`Upvoted an answer with answer ID: ${answer_id}`))
    .catch(err=>{throw err});

}

exports.reportAnswer =  (req,res) => {
  const {answer_id} = req.params;
  db.query('UPDATE answers SET reported = true WHERE id = $1',[answer_id])
    .then(result=>{
      res.send(`Reported question with answer id ${answer_id}`);
    })
    .catch(err=>{throw err});

}
