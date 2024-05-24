const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');/*Nous utilisons Nodemailer pour envoyer l'e-mail via SMTP. */

// generate jwt token
const generateToken = (id) => {
    return jwt.sign({ id }, 'leave', { expiresIn: '7d' })
}

exports.getHome = (req, res, next) => {
    console.log("request received")
    return res.status(200).send("homepage")
}

//new users

// Fonction pour ajouter un nouvel utilisateur
exports.addUser = async (req, res) => {
    let name = req.body.name
    let email = req.body.email
    let isAdmin = req.body.isAdmin
    let password = req.body.password
    try {
        // Hash du mot de passe avant de le stocker en base de données
        const hashedPassword = await bcrypt.hash(password, 12);

        // Création d'un nouvel utilisateur avec les données fournies
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            isAdmin: isAdmin // ou tout autre champ que vous avez besoin
        });

        // Sauvegarde du nouvel utilisateur dans la base de données
        await newUser.save();

        // Mise à jour de la liste des utilisateurs dans le contexte
        //setUserList([...userList, newUser]);

        // Retournez le nouvel utilisateur créé ou un message de succès si nécessaire
        return newUser;
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        throw new Error("Erreur lors de la création de l'utilisateur");
    }
};




exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .populate('leaveHistory') // Populate the leaveHistory field
        .then(user => {
            if (!user) {
                return res.status(400).send("Login failed: Email is not registered.");
            }
            bcrypt.compare(password, user.password)
                .then(passwordMatch => {
                    if (passwordMatch) {
                        console.log("Password match!");
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            const sessionTokenByServer = generateToken(user._id);
                            console.log(sessionTokenByServer);
                            User.findOneAndUpdate(
                                { email: user.email },
                                { $set: { "sessionToken": sessionTokenByServer } }
                            ).then(result => {
                                return res.status(200).send({
                                    _id: user._id,
                                    name: user.name,
                                    isAdmin: user.isAdmin,
                                    email: user.email,
                                    createdOn: user.createdOn,
                                    lastUpdatedOn: user.lastUpdatedOn,
                                    reportingEmail: user.reportingEmail,
                                    coveringEmail: user.coveringEmail,
                                    leave: user.leave,
                                    leaveHistory: user.leaveHistory,
                                    staffLeave: user.staffLeave,
                                    sessionToken: sessionTokenByServer
                                });
                            }).catch(err => console.log("Session error: ", err));
                        });
                    }
                    return res.status(401).send("Login failed: Password does not match.");
                }).catch(err => {
                    console.log(err);
                    return res.status(500).send("Internal server error.");
                });
        }).catch(err => {
            console.log(err);
            return res.status(500).send("Internal server error.");
        });
}


exports.postLogout = (req, res, next) => {
    // console.log("before destroying: ", req.session)
    if (req.session) {
        req.session.destroy((err) => {
            if (err) res.status(400).send("failed to sign out")
            req.session = null
            return res.status(200).send("sign out successful")
        })
        // console.log("after destroying: ", req.session)
    }
}

exports.postValidateSession = (req, res, next) => {
    console.log("req.body: ", req.body)
    const sessionId = req.body.sessionId
    User
        .findOne({ sessionToken: sessionId })
        .then(user => {
            if (!user) {
                return res.status(400).send("invalid token!")
            }
            return res.send(user)
        })
        .catch(err => console.log(err))
}

exports.postChangePassword = (req, res, next) => {
    const email = req.body.email

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString('hex')
        User
            .findOne({ email: email })
            .then(user => {
                if (!user) {
                    return res.status(400).send("email is not registered!")
                }
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 1800000 // 30 min validity
                return user.save()
            })
            .then(result => {
              /*
              envoyer email avec farebase
              // Initialisation de Firebase Admin
admin.initializeApp();

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

exports.sendResetPasswordEmail = functions.firestore.document('resetPasswordRequests/{requestId}')
    .onCreate((snapshot, context) => {
        const data = snapshot.data();
        const email = data.email;
        const token = data.token;

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: `
                <div>
                    <p>You requested to reset your password. </p> 
                    <p> Click this <a href="${process.env.FRONTENDURL}/set-new-password/${token}"> link </a> to set a new password </p>
                </div>
                <div>
                    <p></p> 
                    <p><a href="${process.env.FRONTENDURL}/set-new-password/${token}"> </a></p>
                </div>
            `
        };

        return transporter.sendMail(mailOptions)
            .then(() => {
                console.log('reset password email sent');
                return null;
            })
            .catch((error) => {
                console.error("Error sending reset password email: ", error);
                throw new Error("Error sending reset password email");
            });
    });
           
              */
                return res.status(200).send("reset password email sent")
            })
            .catch(err => console.log(err))
    })
}

exports.postUpdatePassword = (req, res, next) => {
    const userToken = req.body.userToken
    const updatedPassword = req.body.password
    let currentUser;
    User.findOne({ resetToken: userToken, resetTokenExpiration: { $gt: Date.now() } })
        .then((user) => {
            if (!user) {
                return res.status(401).send("update password: user not found")
            }
            currentUser = user
            return bcrypt.hash(updatedPassword, 12)
        })
        .then((hashedPassword) => {
            if (!hashedPassword) {
                return res.status(401).send("update password: password hashing failed")
            }
            currentUser.password = hashedPassword
            currentUser.resetToken = undefined
            currentUser.resetTokenExpiration = undefined
            return currentUser.save()
        })
        .then((result) => {
            if (!result) {
                return res.status(401).send("update password: failed to update password")
            }
            console.log(result)
            return res.status(200).send("password reset successful")
        })
        .catch(err => {
            if (!currentUser) return res.status(402).send("token expired")
            return res.status(500).send("please contact engineer")
            console.log("postUpdatePassword err: ", err)
        })
}