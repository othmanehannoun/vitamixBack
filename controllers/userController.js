const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {encrypt, decrypt} = require('../middllwars/crypte')

exports.checkThisEmailIfExist = (req, res, next) => {
    User.find({email: req.body.email}, (err, data) => {
        if(err || !data || data.length >= 1)
            return res.status('400').json({error: "cette email déjà exist"})
        next()
    })
}

exports.signup = (req, res) => {
    try {
        if(req.body.confirmPass !== req.body.password || !req.body.confirmPass) {
            return res.status('400').json({error: "Les mots de passe saisis ne sont pas identiques. "})
        }

        const user = new User(req.body)

        user.save((err, user) => {
            if(err) {
                return res.status('400').json({error: err})
            }

            res.send(user)
        })
    }
    catch(error) {

    }
}

exports.signin = (req, res) => {
    try {
        const {email, password} = req.body

        User.findOne({email}, (err, user) => {
            if(err || !user) {
                return res.status(400).json({error: "Ce compte n'existe pas ! Veuillez-vous inscrire"})
            }
            if(decrypt(user.password) != password) {
                return res.status(401).json({error: 'Veuillez entrer un mot de passe correct'})
            }

            // expire after 1 hours exp: Math.floor(Date.now() / 1000) + (60 * 60)
            const token = jwt.sign({_id: user._id, role: user.role, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, process.env.JWT_SECRET, { algorithm: 'HS256' }); 
    
            res.cookie('token', token, { expire: new Date() + (60*24*3600000) })

            const {_id, name, email, role, phone} = user;

            // return res.json({
            //     token, user: {_id, name, email, role}
            // })
            return res.json({ user: {_id, name, email, phone, role} })
        })
    }
    catch(error) {

    }
}

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(404).json({
                error: "Ce compte n'existe pas ! Veuillez-vous inscrire"
            })
        }

        req.profile = user;
        next();
    })
}

exports.getOneUser = (req, res) => {
    res.json({
        user: req.profile._id
    })
}

exports.SignOut = (req, res) =>  {
    res.clearCookie('token');

    res.json({
        message: "Vous êtes déconnecté"
    })
}

exports.updateUserPassword = (req, res) => {
    if(req.body.Password != req.body.RPassword) {
        return res.status(400).json({error: "Les mots de passe saisis ne sont pas identiques"})
    }

    if(req.body.Password == "" || req.body.RPassword == "")
        return res.status(400).json({error: "Entrer votre mot de pass"})

    var userPasswordObject = {
        password: encrypt(req.body.Password),
    }

    User.findOneAndUpdate({_id: req.params.UserID}, userPasswordObject, (err, user) => {
        if(req.body.oldPassword != decrypt(user.password))
            return res.status(400).json({error: "Le mot de passe actuel saisi est incorrect"})
        if(err)
            return res.status(400).json({error: "server error"})

        res.json("le mot de pass a été modifiée")
    })
}

