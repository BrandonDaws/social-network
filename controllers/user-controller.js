const { User, Thoughts } = require('../models');

const userController ={

    //Find all Users
    getAllUsers(req, res){
        User.find({})
        .populate({
            path: 'friends',
            select: '-__v',
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },


    //Find One User By Id
    getUserById({ params }, res){
        User.findOne({ _id: params.id })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No Users Found With That Id! '});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err),
            res.status(400).json(err);
        });
    },

    //Creates A New User
    createUser({ body }, res){
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    //Update A User By Id
    updateUser({ params, body}, res){
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true})
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No Users Found With That Id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            res.status(400).json(err)
        });
    },

    //Removes A User By Id 
    deleteUser({ params}, res){
        User.findByIdAndDelete({ _id: params.id})
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No Users Found With That Id!' } );
                return;
            }
            return Thoughts.deleteMany({ _id: { $in: dbUserData.thoughts }});
        })
        .then( () => {
            res.json({ message: 'User and Thoughts Deleted!'});

        })
        .catch(err => res.status(400).json(err));
    },

    addFriend({params}, res){
        User.findByIdAndUpdate(
            { _id: params.userId },
            {$pull: { friends: params.friendsId } },
            { new: true } 
        )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },
    removeFriend({ params}, res){
        User.findOneAndDelete(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true } 
        )
        .then(dbUserData => {
            if(dbUserData){
                return res.status(404).json({ message: " No Users Were Found With That Id"});
            }
            res.json(dbUserData)
        })
        .catch(err => res.json(err));
    }
};

module.exports = userController;