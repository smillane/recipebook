const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')

// show add page
// GET /stories/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// process add form
// POST /stories

router.post('/', ensureAuth, (req, res) => {
    try {
        req.body
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router