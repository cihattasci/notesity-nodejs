const Note = require('../Models/NoteModel');
const Purchased = require('../Models/PurchasedModel');
const User = require('../Models/UserModel');
const Comment = require('../Models/CommentModel');
const Favorite = require('../Models/FavoriteModel');
const FCM = require('fcm-node');

module.exports.upload = async (req, res) => {
    const note = new Note({
        userId: req.params.userId,
        university: req.body.university,
        department: req.body.department,
        course: req.body.course,
        subject: req.body.subject,
        pageNumber: req.body.pageNumber,
        notes: req.body.notes,
        purchased: 0,
        price: req.body.price,
        detail: req.body.detail,
    });

    await note.save()
        .then(note => res.json({note, success: true}))
        .catch(e => res.json({success: false, response: e}));
};

module.exports.delete = async (req, res) => {
    await Note.deleteOne({_id: req.params.noteId})
        .then(async () => {
            await Note.findOne({_id: req.params.noteId}).then(async note => {
                if (note) {
                    res.json({ message: "Failed Delete", response: note });
                } else {
                    res.json({ message: "Successful Delete" });
                    await Comment.deleteMany({noteId: req.params.noteId});
                    await Favorite.deleteMany({noteId: req.params.noteId});
                }
            });
        })
        .catch(e => res.json(e));
};

module.exports.update = async (req, res) => {
    await Note.updateOne({_id: req.params.noteId}, {
        university: req.body.university, 
        course: req.body.course, 
        department: req.body.department,
        subject: req.body.subject,
        pageNumber: req.body.pageNumber,
        notes: req.body.notes,
        detail: req.body.detail,
        price: req.body.price,
    })
        .then(async () => {
            await Note.findOne({_id: req.params.noteId})
                .then(note => res.send(note))
                .catch(e => res.send(e));
        })
        .catch(e => {
            return res.send(e);
        });
};

module.exports.listAllNotes = async (req, res) => {
    await Note.find().then(note => res.json(note)).catch(e => res.json(e));
};

module.exports.updatePurchased = async (req, res) => {
    await Note.updateOne({_id: req.params.noteId}, { $inc: {purchased: 1} })
        .then(async () => {
            await Note.findOne({_id: req.params.noteId})
                .then(note => res.send(note))
                .catch(e => res.send(e));
        })
        .catch(e => {
            return res.send(e);
        });
};

module.exports.lastAddedNotes = async (req, res) => {
    await Note.find().sort({createdAt: -1}).limit(10).exec((error, response) => {
        if (error) {
            res.json(error);
        } else {
            res.json(response);
        }
    });
};

module.exports.topPurchasedNotes = async (req, res) => {
    await Note.find().sort({purchased: -1}).limit(10).exec((error, response) => {
        if (error) {
            res.json(error);
        } else {
            res.json(response);
        }
    });
};

module.exports.topRatedNotes = async (req, res) => {
    await Note.find().sort({averageRating: -1}).limit(10).exec((error, response) => {
        if (error) {
            res.json(error);
        } else {
            res.json(response);
        }
    })
};

module.exports.mostVotedNotes = async (req, res) => {
    await Note.find().sort({ratingCount: -1}).limit(10).exec((error, response) => {
        if (error) {
            res.json(error);
        } else {
            res.json(response);
        }
    })
};

module.exports.myNotes = async (req, res) => {
    await Note.find({userId: req.params.userId}).then(note => res.json(note)).catch(e => res.json(e));
};

module.exports.saveNoteToPurchased = async (req, res) => {
    const purchased = new Purchased({
        purchasedPersonId: req.params.whomId,
        noteId: req.body.noteId,
        userId: req.body.userId,
        university: req.body.university,
        department: req.body.department,
        course: req.body.course,
        subject: req.body.subject,
        pageNumber: req.body.pageNumber,
        notes: req.body.notes,
        detail: req.body.detail,
        price: req.body.price,
    });

    let profit = req.body.price*0.75;
    profit = profit.toFixed(2);
    let deviceToken = null;
    await User.findOne({_id: req.body.userId})
        .then(user => deviceToken = user.deviceToken)
        .catch(err => res.send(err));

    await User.updateMany({_id: req.body.userId}, { $inc: {totalProfit: profit, totalSell: 1}});
    await User.updateOne({_id: req.params.whomId}, { $inc: {totalBuy: req.body.price}});
    await Note.updateOne({_id: req.body.noteId}, { $inc: { purchased: 1 }})
    await purchased.save()
        .then(note => res.json({note, success: true}))
        .catch(e => res.json(e));

    let fcm = new FCM(process.env.SERVER_KEY);
    let message = {
        to: deviceToken.toString(),
        notification: {
            title: "Notun Satın Alındı",
            body: "Hey! " + req.body.subject + " notun satın alındı. " + profit + "₺ hesabında... :)",
            sound: "default",
            image: process.env.PUSH_NOTIFICATION_IMAGE
        },
    };
        
    fcm.send(message, (err, response) => {
        if (err) {
            console.error({success: false, message: err, statusCode: 404});
        } else {
            console.log({success: true, message: response.json(), statusCode: 200});
        }
    });
};

module.exports.getPurchasedNote = async (req, res) => {
    await Purchased.find({purchasedPersonId: req.params.whomId})
        .then(note => res.json(note))
        .catch(e => res.json(e));
};

module.exports.isPurchasedNote = async (req, res) => {
    await Purchased.exists({purchasedPersonId: req.params.userId, noteId: req.params.noteId}, (err, doc) => {
        if (err){ 
            res.json(err);
        }else{ 
            res.json(doc);
        }
    });
};

module.exports.isMyNote = async (req, res) => {
    await Note.exists({userId: req.params.userId, _id: req.params.noteId}, (err, doc) => {
        if (err){ 
            res.json(err);
        }else{
            res.json(doc);
        }
    });
}