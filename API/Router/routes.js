const express = require('express');
const router = express.Router();
const path = require('path');
const UserController = require('../Controller/UserController');
const NoteController = require('../Controller/NoteController');
const CardController = require('../Controller/CardController');
const CommentController = require('../Controller/CommentController');
const FavoriteController = require('../Controller/FavoriteController');
const auth = require('../Middleware/auth');
//user route
router.post('/users/register', UserController.register);
router.post('/users/login',/* auth.verifyToken,*/ UserController.login);
router.get('/users/get-profile/:userId', UserController.getProfile);
router.post('/users/logout/:id', UserController.logout);
router.post('/users/change-password/:id', UserController.changePassword);
router.post('/users/reset-password', UserController.resetPassword);
router.post('/users/save-user-deviceToken', UserController.saveUserDeviceToken);
//user card route
router.post('/card/save-card/:userId', CardController.saveCard);
router.get('/card/get-card/:userId', CardController.getCard);
router.delete('/card/delete-card/:id', CardController.deleteCard);
//note route
router.post('/notes/upload-note/:userId', NoteController.upload);
router.put('/notes/update-note/:noteId', NoteController.update);
router.delete('/notes/delete-note/:noteId', NoteController.delete);
router.get('/notes/list-all-notes', NoteController.listAllNotes);
router.get('/notes/last-added-notes', NoteController.lastAddedNotes);
router.get('/notes/top-purchased-notes', NoteController.topPurchasedNotes);
router.get('/notes/top-rated-notes', NoteController.topRatedNotes);
router.get('/notes/most-voted-notes', NoteController.mostVotedNotes);
router.put('/notes/update-purchased/:noteId', NoteController.updatePurchased);
router.get('/notes/:userId/my-notes', NoteController.myNotes);
router.get('/notes/is-my-note/:userId/:noteId', NoteController.isMyNote);
//purchased route
router.post('/purchased/save-purchased-note/:whomId', NoteController.saveNoteToPurchased);
router.get('/purchased/get-purchased-note/:whomId', NoteController.getPurchasedNote);
router.get('/purchased/is-purchased-note/:userId/:noteId', NoteController.isPurchasedNote);
//note comment route
router.post('/comment/add-comment/:noteId/:userId', CommentController.addComment);
router.get('/comment/get-comment/:noteId', CommentController.getComment);
router.delete('/comment/delete-comment/:commentId/:userId/:noteId', CommentController.removeComment);
//user favorite route
router.post('/favorite/:whomId/add-user-favorites', FavoriteController.addFavorite);
router.get('/favorite/:whomId/get-user-favorites', FavoriteController.getFavorite);
router.get('/favorite/:whomId/:noteId/is-user-favorite', FavoriteController.isFavorite);
router.delete('/favorite/:whomId/delete-user-favorites/:favoriteId', FavoriteController.removeFavorite);
router.delete('/favorite/:whomId/delete-user-all-favorites', FavoriteController.removeAllFavorite);
//privacy policy
router.get('/notesity/privacy-policy', async (req, res) => {
    res.sendFile(path.join(__dirname, '../../privacy_policy.html'));
});

module.exports = router;

