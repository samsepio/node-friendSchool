const express=require('express');
const User=require('../model/database');
const passport=require('passport');
const router=express.Router();

router.get('/signin',(req,res,next)=>{
	res.render('signin');
});
router.post('/signin',passport.authenticate('local-signin',{
	successRedirect: '/profile',
	failureRedirect: '/signin',
	failureFlash: true
}));
router.get('/signup',(req,res,next)=>{
	res.render('signup');
});
router.post('/signup',async(req,res,next)=>{
	const {email,name,password,comfirm} = req.body;
	const errors = [];
	if(email.length <= 0 || name.length <= 0 || password.length <= 0 || comfirm.length <= 0){
		errors.push({text: 'todos los campos son hobligatorios'});
	}
	if(password.length <= 5){
		errors.push({text: 'la contraseña debe tener minimo 6 caracteres'});
	}
	if(password != comfirm){
		errors.push({text: 'las contraseñas no coinciden'});
	}
	if(errors.length > 0){
		res.render('signup',{name,email,password,comfirm,errors});
	}else{
		const emailUser = await User.findOne({email: email});
		if(emailUser){
			res.redirect('/signup');
			req.flash('error_msg','el correo ya ha sido registrado');
		}else{
			const newuser = new User({email,name,password});
			newuser.password = newuser.encryptPassword(password);
			await newuser.save();
			console.log(newuser);
			req.flash('success_msg','registrado correctamente ahora inicia secion');
                	res.redirect('/signin');
		}
	}
});

module.exports=router;
