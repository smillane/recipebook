const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Recipe = require('../models/Recipe')

// login/landing page
// GET /

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

// dashboard
// GET dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            recipes,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router