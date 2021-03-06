var Comment = require('../Models/CommentModel');
var User = require('../Models/UserModel');
var Note = require('../Models/NoteModel');
var Purchased = require('../Models/PurchasedModel');

module.exports.addComment = async (req, res) => {
    var username = null;
    await User.findOne({_id: req.params.userId})
        .then(user => username = user.userName)
        .catch(e => res.json(e));
    
    var comment = new Comment({
        noteId: req.params.noteId,
        userId: req.params.userId,
        comment: req.body.comment,
        username: username,
        rating: req.body.rating,
    });

    var ratingTotal = null;
    var ratingCount = null;
    var averageRating = null;

    await Note.updateMany({_id: req.params.noteId}, { $inc: {ratingCount: 1, ratingTotal: req.body.rating}});

    await Note.findOne({_id: req.params.noteId}).then(note => { 
        ratingTotal = note.ratingTotal;
        ratingCount = note.ratingCount;
    });

    if (ratingCount === 0) {
        averageRating = ratingTotal;
    } else {
        averageRating = ratingTotal / ratingCount;
    }

    await Note.updateMany({_id: req.params.noteId}, {averageRating: averageRating});
    await Purchased.updateOne({purchasedPersonId: req.params.userId, noteId: req.params.noteId}, {isEvaluated: true});

    await comment.save()
        .then(comment => res.json(comment))
        .catch(e => res.json({success: false, response: e}));
};

module.exports.getComment = async (req, res) => {
    await Comment.find({noteId: req.params.noteId})
        .then(comments => res.json(comments))
        .catch(e => res.json({success: false, response: e}));
};

module.exports.removeComment = async (req, res) => {
    await Comment.deleteOne({_id: req.params.commentId})
        .then(() => {
            Comment.findOne({_id: req.params.commentId})
                .then(async comment => {
                    if (comment) {
                        res.json({success: false, response: 'Delete comment failed'});
                    } else {
                        res.json({success: true, response: 'Successful delete'});
                        await Purchased.updateOne({purchasedPersonId: req.params.userId, noteId: req.params.noteId}, {isEvaluated: false})
                    }
                });
        })
        .catch(e => res.json({success: false, response: e}));
};