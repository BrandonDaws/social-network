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
    .post(addThoughts)
    .get(getAllThoughts);
    

//api/thoughts/:id
router
    .route('/:id')
    .get(getOneThought)
    .put(updateThoughts)
    .delete(removeThoughts);

//api/thoughts/:thoughtId/reactions
router.route('/:thoughtsId/reactions').post(addReaction);



module.exports = router;