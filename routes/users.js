const express = require('express')
const router = express.Router()
const {signup, signin, userById, SignOut, updateUserPassword, getOneUser, checkThisEmailIfExist} = require('../controllers/userController')
const {SignUpValidator} = require('../middllwars/formValidator')
const {requireSignIn, isAuth, isUser} = require('../middllwars/auth')

router.post('/signUp', SignUpValidator, checkThisEmailIfExist, signup)
router.post('/signIn', SignUpValidator, signin)
router.post('/signOut', SignOut)
router.put('/updateUserPassword/:UserID', updateUserPassword)

router.get('/:Uid', requireSignIn, isAuth, isUser, getOneUser)
router.param('Uid', userById)

module.exports = router
