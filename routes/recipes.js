const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Recipe = require('../models/Recipe')

// show add page
// GET /recipes/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('recipes/add')
})

// process add form
// POST /recipes

router.post('/', ensureAuth, (req, res) => {
    try {
        req.body
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router