const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const comentarySchema = new Schema({
	email:{type: String},
	comentary:{type: String},
	created_at: {type: Date, default: Date.now},
	user:{type: String}
});

module.exports=mongoose.model('Comentary',comentarySchema);
