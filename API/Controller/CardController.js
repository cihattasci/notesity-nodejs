var Card = require('../Models/CardModel');

module.exports.saveCard = async (req, res) => {
    var card = new Card({
        userId: req.params.userId,
        name: req.body.name,
        surname: req.body.surname,
        iban: req.body.iban,
        identity_number: req.body.identity_number
    });

    await card.save()
        .then(card => res.send({
            success: true,
            response: card,
        }))
        .catch(error => res.send({
            success: false,
            message: 'Card save is failed'
        }));
};

module.exports.getCard = async (req, res) => {
    await Card.findOne({userId: req.params.userId}).then(card => res.json(card)).catch(e => res.json(e));
};

module.exports.deleteCard = async (req, res) => {
    await Card.deleteOne({_id: req.params.id})
        .then(async () => {
            await Card.findOne({_id: req.params.id}).then(card => {
                if (card) {
                    res.json({ card, response: false });
                } else {
                    res.json({ message: "Successful Delete", response: true });
                }
            });
        })
        .catch(err => res.json(err));
};