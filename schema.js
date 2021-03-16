import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
  product_id: {type: Number, required: true}
});

const questionSchema = new Schema({
  // will use objectId provided by MongodDB as unique identifier
  question_body: {type: String, required: true, maxLength: 1000},
  question_date: {type: Date, required: true},
  asker_name: {type: String, required: true, maxLength:60},
  question_helpfulness: {type: Number, required: true},
  reported: {type: Boolean, required: true},
  answers: [{
    type: Schema.Types.ObjectId, ref: 'answerSchema'
  }]
});


const answerSchema = new Schema({
  // will use objectId provided by MongodDB as unique identifier
  body: {type: String, required: true, maxLength: 1000},
  date: {type: Date, required: true},
  answerer_name: {type: String, required: true, maxLength:60},
  helpfulness: {type: Number, required: true},
  reported: {type: Boolean, required: true},
  photos: [{
    type: String, data: Buffer
  }]

});