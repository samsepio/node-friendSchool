const express=require('express');
const Image=require('../model/database2');
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
		res.render('/profile',{title,description,descript,name,favorite,year,religion,errors});
	}else{
		const image = new Image();
		image.title = req.body.title;
		image.description = req.bosy.description;
	}
});
router.get('/profiles',isAuthenticated,(req,res,next)=>{
	res.render('profiles');
});

module.exports=router;
