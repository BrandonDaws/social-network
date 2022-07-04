const { Thoughts, User} = require('../models');

const thoughtsController = {
    
    getAllThoughts(req, res){
        Thoughts.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    addThoughts({ params, body }, res ){
        console.log(body);
        Thoughts.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoguths: _id } },
                {new: true }
            );
        })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No User Was Found With That Id '});
            }
            res.json({message: 'Thought Had Been Created!'});
        })
        .catch(err => res.json(err));
    },

    addReaction({ params }, res){
        Thoughts.findOneAndUpdate(
            {_id: params.thoughtsId },
            { $pull: { reations: { reactionId: params.reactionId } }},
            { new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    },

    removeThoughts({ params }, res){
        Thoughts.findOneAndDelete({ _id: params.id })
        .then((dbThoughtData) =>{
            if(!dbThoughtData){
                return res.status(404).json({ message: 'No Users Were Found With That Id'});
            }
            res.json({ message: 'Thought Was Deleted!'});
        })
        .catch((err) => res.json(err));
    },

    getOneThought({ params}, res){
        Thoughts.findOne({ _id: params.id })
        .populate({
            path: 'reactions',
            select: '-__V',
        })
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'No Thought With That Id Found!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    updateThoughts({ params, body }, res) {
        Thoughts.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    }
}

module.exports = thoughtsController;