const express=require('express');
const Image=require('../model/database2');
const Comentary=require('../model/database3');
const router=express.Router();
const {isAuthenticated}=require('../helpers/auth');

router.get('/profile',isAuthenticated,(req,res,next)=>{
	res.render('profile');
});
router.post('/profile',async(req,res,next)=>{
	const {title,description,descript,name,favorite,year,religion} = req.body;
	const errors = [];
	if(title.length <= 0 || description.length <= 0 || descript.length <= 0 || name.length <= 0 || favorite.length <= 0 || year.length <= 0 || religion.length <= 0 ){
		errors.push({text: 'todos los campos son hobligatorios'});
	}
	if(year <= 6 || year >= 18){
		errors.push({text: 'edad no valida'});
	}
	if(errors.length > 0){
		res.render('profile',{title,description,descript,name,favorite,year,religion,errors});
	}else{
		const image = new Image();
		image.title = req.body.title;
		image.description = req.body.description;
		image.descript = req.body.descript;
		image.name = req.body.name;
		image.favorite = req.body.name;
		image.year = req.body.year;
		image.religion = req.body.religion;
		image.filename = req.file.filename;
		image.originalname = req.file.originalname;
		image.fieldname = req.file.fieldname;
		image.mimetype = req.file.mimetype;
		image.encoding = req.file.encoding;
		image.size = req.file.size;
		image.path = '/img/uploads/'+req.file.filename;
		image.user = req.user.id;
		await image.save();
		console.log(image);
		res.redirect('/profiles');
	}
});
router.post('/comentary/:id',async(req,res,next)=>{
	const comment = new Comentary({email,comentary});
	comment.user = req.user.id;
	await comment.save();
});
router.get('/edit/:id',isAuthenticated,async(req,res,next)=>{
	const {id} = req.params;
	const dimages = await Image.findById(id);
	if(dimages.user != req.user.id){
		req.flash('error_msg','no puedes editar otro perfil que no sea el tuyo');
		res.redirect('/profiles');
	}else{
		res.render('edit',{dimages});
	}
});
router.put('/edit/:id',async(req,res,next)=>{
	const {name,year,description,title,descript,favorite,religion} = req.body;
	await Image.findByIdAndUpdate(req.params.id,{name,title,year,description,descript,favorite,religion});
	req.flash('success_msg','perfil editado');
	res.redirect('/myperfil');
});
router.delete('/delete/:id',isAuthenticated,async(req,res,next)=>{
	const {id} = req.params;
	await Image.findByIdAndDelete(id);
	req.flash('success_msg','perfil eliminado haora puedes crearte otro');
	res.redirect('/profile');
});
router.get('/myperfil',isAuthenticated,async(req,res,next)=>{
	const profile = await Image.find({user: req.user.id});
	res.render('myperfil',{profile});
});
router.get('/img/:id',isAuthenticated,async(req,res,next)=>{
	const {id} = req.params;
	const image = await Image.findById(id);
	const comentarys = await Comentary.find({user: req.user.id});
	res.render('photho',{image},{comentarys});
});
router.get('/profiles',isAuthenticated,async(req,res,next)=>{
	const images = await Image.find();
	res.render('profiles',{images});
});

module.exports=router;
