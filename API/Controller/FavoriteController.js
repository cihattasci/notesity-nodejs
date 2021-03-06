var Favorite = require('../Models/FavoriteModel');

module.exports.addFavorite = async (req, res) => {
    var favorite = new Favorite({
        _id: req.body.noteId,
        whomId: req.params.whomId,
        noteId: req.body.noteId,
        userId: req.body.userId,
        university: req.body.university,
        department: req.body.department,
        course: req.body.course,
        subject: req.body.subject,
        pageNumber: req.body.pageNumber,
        notes: req.body.notes,
        purchased: req.body.purchased,
        detail: req.body.detail,
        price: req.body.price,
        averageRating: req.body.averageRating
    });

    await favorite.save().then(favorite => res.json(favorite)).catch(e => res.json(e));
};

module.exports.getFavorite = async (req, res) => {
    await Favorite.find({whomId: req.params.whomId})
        .then(favorite => res.json(favorite))
        .catch(e => res.json(e));
};

module.exports.removeFavorite = async (req, res) => {
    await Favorite.deleteOne({_id: req.params.favoriteId})
        .then(async () => {
            await Favorite.findOne({_id: req.params.favoriteId}).then(favorite => {
                if (favorite) {
                    res.json({ favorite });
                } else {
                    res.json({ message: "Successful Delete" });
                }
            });
        })
        .catch(err => res.json(err));
};

module.exports.removeAllFavorite = async (req, res) => {
    await Favorite.deleteMany({whomId: req.params.whomId})
        .then(async () => {
            await Favorite.findOne({_id: req.params.favoriteId}).then(favorite => {
                if (favorite) {
                    res.json({ favorite });
                } else {
                    res.json({ message: "Successful Delete" });
                }
            });
        })
        .catch(err => res.json(err));
};

module.exports.isFavorite = async (req, res) => {
    await Favorite.exists({whomId: req.params.whomId, noteId: req.params.noteId}, (err, doc) => {
        if (err){ 
            res.json(err);
        }else{ 
            res.json(doc);
        }
    });
};