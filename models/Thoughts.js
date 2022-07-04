const {Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


ReactionSchema = new Schema(
    {
    reactionId:{
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionText:{
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    username:{
        type: String,
        required: 'Username is required'
    },
    createdAt:{
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    }
},
{
    toJson:{
        getters: true
    },
    id: false
}
);


const ThoughtsSchema = new Schema(
    {
     thoughtText:{
        type: String,
        required: 'Must be between 1 and 280 characters',
        minLength: 1,
        maxLength: 280
     },
     createdAt:{
        type:Date,
        default:Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
     },
     username:{
        type: String,
        required: 'Username is Required!'
     },
     reactions:[ReactionSchema],  
    },
    {
        toJSON:{
            virtuals:true,
            getters:true
        },
        id:false,
    });

    ThoughtsSchema.virtual('reactionCount').get(function(){
        return this.reactions.length;
    });

    const Thoughts = model('Thoughts', ThoughtsSchema);

    module.exports = Thoughts;