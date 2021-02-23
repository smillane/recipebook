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

router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Recipe.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// show all recipes
// GET /recipes

router.get('/', ensureAuth, async (req, res) => {
    try {
        const recipes = await Recipe.find({ status: 'public'})
            .populate('user')
            .sort({ createdAt: 'desc'})
            .lean()

        res.render('recipes/index', {
            recipes,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// show individual recipe
// GET /recipe/:id

router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id)
            .populate('user')
            .lean()

        if (!recipe) {
            return res.render('error/404')
        }

        res.render('recipes/show', {
            recipe
        })

    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

// show edit page
// GET /recipes/edit/:id

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            _id: req.params.id,
        }).lean()

        if (!recipe) {
            return res.render('error/404')
        }

        if (recipe.user != req.user.id) {
            res.redirect('/recipes')
        } else {
            res.render('recipes/edit', {
                recipe,
            })
        }
    }catch(err) {
        console.error(err)
        return res.render('error/500')
    }
})

// update recipe
// PUT /recipes/:id

router.put('/:id', ensureAuth, async (req, res) => {
    let recipe = await Recipe.findById(req.params.id).lean()

    if (!recipe) {
        return res.render('error/404')
    }

    if (recipe.user != req.user.id) {
        res.redirect('/recipes')
    } else {
        recipe = await Recipe.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        })

        res.redirect('/dashboard')
    }
})

// delete recipe
// DELETE /recipes/:id

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Recipe.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    }catch(err) {
        console.error(err)
        return res.render('error/500')
    }
})

// show user recipes
// GET /recipes/user/:userId

router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const recipes = await Recipe.find({
            user: req.params.userId,
            status: 'public',
        })
        .populate('user')
        .lean()

        res.render('recipes/index', {
            recipes
        })
    }catch(err) {
        console.error(err)
        res.render('error/500')
    }
})


module.exports = router