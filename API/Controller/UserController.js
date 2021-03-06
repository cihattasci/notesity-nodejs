var User = require('../Models/UserModel');
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
require('dotenv').config();

hashPassword = passwordToHash => {
    return bcrypt.hash(passwordToHash, 10);
};

comparePassword = (userPassword, hashedPassword) => {
    return bcrypt.compare(userPassword, hashedPassword);
};

module.exports.register = async (req,res) => {
    var bcrypt_password = await hashPassword(req.body.password);
    var first_user = new User({
        email: req.body.email,
        password: bcrypt_password,
        userName: req.body.userName
    });
    var token = jwt.sign({ first_user }, process.env.jwtKey);
    var user = new User({
        email: first_user.email,
        password: first_user.password,
        userName: first_user.userName,
        token: token,
    });
    
    user.save()
        .then(async user => {
            await User.updateOne({email: user.email}, {isLoggedIn: true}).then(() => null).catch(e => res.json(e));
            res.send(user);
        })
        .catch(e => res.send(e));
};

module.exports.login = async (req, res) => {
    await User.findOne({email: req.body.email}).then(async user => {
        if (!user.token) {
            var token = jwt.sign({ user }, process.env.jwtKey);
            await User.updateOne({email: user.email}, {token}).then(() => null).catch(e => res.json(e));
        } else {
            null
        };
    });

    await User.findOne({email: req.body.email})
        .then(async user => {
            var userPassword = user.password;
            var resetToken = user.resetToken;
            var resetTokenExpirations = user.resetTokenExpirations;
            var isPasswordMatch = await comparePassword(req.body.password, userPassword);
            var isResetToken = null;
            if ((req.body.password === resetToken) && resetTokenExpirations > Date.now()) {
                isResetToken = true;
            } else {
                isResetToken = false;
            }
            if (isPasswordMatch || isResetToken) {
                await User.updateOne({email: req.body.email}, {resetToken: undefined, resetTokenExpirations: undefined, isLoggedIn: true});
                return res.status(200).json({user: user, success:true});
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Password Login Failed'
                });
            }
        })
        .catch(e => res.status(401).json({
            success: false,
            message: 'No User'
        }));
};

module.exports.logout = async (req, res) => {
    await User.updateOne({_id: req.params.id}, {token: null, isLoggedIn: false})
        .then(() => res.json({success: true, message: 'Successful logout'}))
        .catch(e => res.json({success: false, message:'Failed logout', response: e}));
};

module.exports.changePassword = async (req, res) => {
    //var currentPassword = req.body.currentPassword;
    var newPassword = req.body.newPassword;
    //var userPassword = null;
    //await User.findOne({_id: req.params.id}).then(user => userPassword = user.password).catch(e => res.json(e));
    //var isPasswordTrue = await comparePassword(currentPassword, userPassword);
    //if (isPasswordTrue) {
        var newHashedPassword = await hashPassword(newPassword);
        await User.updateOne({_id: req.params.id}, {password: newHashedPassword})
            .then(() => res.json({success: true, message: 'Password change success'}))
            .catch(() => res.json({success: false, message: 'Password change failed'}));
    /*} else {
        res.json({message: 'passwords does not match'});
    }*/
};

module.exports.getProfile = async (req, res) => {
    await User.findOne({_id: req.params.userId})
        .then(user => res.json(user))
        .catch(e => res.json(e));
};

module.exports.resetPassword = async (req, res) => {
  var email = req.body.email;
  var transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
    g_smtp_allow_invalid: true
  });

  await crypto.randomBytes(3, async (error, buffer) => {
      if (error) {
          return res.send(error);
      }

      User.findOne({email: req.body.email})
      .then(async user =>??{
        if (!user) {
            return res.json({status: false, message: 'B??yle bir e-mail adresi kay??tl?? de??il'});
        } else {
          var resetToken = buffer.toString('hex');
          var resetTokenExpirations = Date.now() + 3600000;
          await User.updateOne({email}, {resetToken, resetTokenExpirations});

          var mailOptions = await transporter.sendMail({
              from: process.env.EMAIL,
              to: req.body.email,
              subject: '??ifre S??f??rlama',
              text: "Tek kullan??ml??k ??ifreniz: " + resetToken + "\n\nL??tfen giri?? yapt??ktan sonra kendinizin belirledi??i bir ??ifre ile ??ifrenizi g??ncelleyin."
          });
      
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  res.json(error);
                  return;
              } else {
                  res.json(true);
              }
          });  
        };
      })
  });
};

module.exports.saveUserDeviceToken = async (req, res) => {
    await User.updateOne({_id: req.body.userId}, {deviceToken: req.body.deviceToken})
        .then(() => res.json({success: true}))
        .catch(err => res.json({success: false}))
};