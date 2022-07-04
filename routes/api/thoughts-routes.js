const router= require('express').Router();
const { getAllThoughts,
        addThoughts,
        removeThoughts,
        addReaction,
        getOneThought,
        updateThoughts
    } = require('../../controllers/thoughts-controller');

//api/thoughts
router
    .route('/')
    .get(getAllThoughts)
    .post(addThoughts);

//api/thoughts/:id
router
    .route('/:id')
    .get(getOneThought)
    .put(updateThoughts)

//api/thoughts/:thoughtId/reactions
router.route('/:thoughtsId/reactions').post(addReaction);



module.exports = router;