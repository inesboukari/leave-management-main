const User = require("../models/user");
const Leave = require("../models/leave");
const LeaveEntitlement = require("../models/leaveEntitlement");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const io = require("../socket");
const moment = require("moment-timezone");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const date = new Date();
const currentYear = date.getFullYear();

// Create user
exports.postCreateUser = (req, res, next) => {
  const {
    name,
    isAdmin,
    email,
    password,
    grade,
    matricule,
    createdOn,
    lastUpdatedOn,
    reportingEmail,
    coveringEmail,
  } = req.body;
  console.log("createdOn: ", createdOn);

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        console.log(userDoc);
        return res.status(499).send("Email already exists");
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const createdOnDate = moment(createdOn);
      const lastUpdatedOnDate = moment(lastUpdatedOn);

      const chengduLrsLeaveScheme = [
        new Leave({
          name: `Annual Leave (${currentYear - 1})`,
          type: "prevYearAnnual",
          entitlement: 0,
          pending: 0,
          used: 0,
          note: "NA /",
        }),
      ];

      LeaveEntitlement.find({}, (err, records) => {
        if (err) {
          return console.log(
            "Error adding leave entitlement to new user: ",
            err
          );
        }
        if (!records || records.length === 0) {
          return console.log("No leave entitlement records found");
        }

        console.log("records: ", records);
        const leaveRecords = records[0].leaveEntitlement;

        leaveRecords.forEach((record) => {
          const leaveType = new Leave({
            name: record.name,
            type: record.type,
            entitlement: record.entitlement,
            pending: 0,
            used: 0,
            note: record.note,
          });
          console.log("leaveType: ", leaveType);
          chengduLrsLeaveScheme.push(leaveType);
          console.log(
            "chengduLrsLeaveScheme after push: ",
            chengduLrsLeaveScheme
          );
        });

        console.log("chengduLrsLeaveScheme: ", chengduLrsLeaveScheme);

        const user = new User({
          name: name,
          isAdmin: isAdmin,
          email: email,
          grade: grade,
          matricule: matricule,
          password: hashedPassword,
          createdOn: createdOnDate
            .tz("Asia/Singapore")
            .format("YYYY/MM/DD H:mm:ss"),
          lastUpdatedOn: lastUpdatedOnDate
            .tz("Asia/Singapore")
            .format("YYYY/MM/DD H:mm:ss"),
          reportingEmail: reportingEmail,
          coveringEmail: coveringEmail,
          leave: chengduLrsLeaveScheme,
          leaveHistory: [],
          staffLeave: [],
          sessionToken: jwt.sign({ email }, "leave", { expiresIn: "7d" }), // to generate a JWT token expiring after 7 days
        });

        return user.save();
      })
        .then((result) => {
          if (!result) {
            return res.status(401).send("Create user: User creation failed");
          }

          // Send email with Firebase
          admin.initializeApp();

          // Configure the SMTP transporter
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "your-email@gmail.com",
              pass: "your-email-password",
            },
          });

          const sendWelcomeEmail = functions.auth.user().onCreate((user) => {
            const email = user.email;
            const mailOptions = {
              from: "your-email@gmail.com",
              to: email,
              subject: "Welcome to LeavePlan",
              html: `
                            <div>
                                <p>Welcome to LeavePlan </p>
                                <p> Click <a href="${process.env.FRONTENDURL}/login"> here </a> to start making leave plans!</p>
                                <p> Click <a href="${process.env.FRONTENDURL}/change-password"> here </a> to change your password</p>
                            </div>
                        `,
            };

            return transporter
              .sendMail(mailOptions)
              .then(() => {
                console.log("Account creation email sent to user");
                return null;
              })
              .catch((err) => {
                console.log("Failed to create user", err);
                return res.status(400).send(`Failed to create user ${err}`);
              });
          });

          return res.status(200).send("User created and email sent");
        })
        .catch((err) => {
          console.log("Failed to create user", err);
          return res.status(400).send(`Failed to create user ${err}`);
        });
    })
    .catch((err) => {
      console.log("Error in creating user", err);
      return res.status(400).send(`Error in creating user ${err}`);
    });
};

// Delete user
exports.postDeleteUser = (req, res, next) => {
  const email = req.body.email;
  User.deleteOne({ email: email })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .send("Delete user: Did not find user record in DB");
      }
      console.log("user: ", user);
      return res.send("User deleted");
    })
    .catch((err) => {
      console.log("Failed to delete user", err);
      return res.status(400).send(`Failed to delete user ${err}`);
    });
};

//cree type de congé
exports.postCreateLeaveType = (req, res, next) => {
  console.log("req.body: ", req.body);
  const leaveName = req.body.leaveName;
  const leaveSlug = req.body.leaveSlug;
  const leaveEntitlement = req.body.leaveEntitlement;
  const leaveRollOver = req.body.leaveRollOver;
  const leaveNote = req.body.leaveNote;
  const addedByUser = req.body.userAdded;
  const addedOn = moment(req.body.addedOn);

  /*a propriété entitlement représente le nombre de jours de congé auxquels les utilisateurs ont droit pour ce type de congé. */
  const newLeaveEntitlementData = {
    name: leaveName,
    entitlement: leaveEntitlement,
    type: leaveSlug,
    rollover: leaveRollOver,
    year: date.getFullYear(),
    addedByUser: addedByUser,
    addedOn: addedOn.tz("Asia/Singapore").format("YYYY/MM/DD H:mm:ss"),
  };

  LeaveEntitlement.findOne({
    entity: "chengdu",
    "leaveEntitlement.name": leaveName,
  })
    .then((record) => {
      if (record) {
        // console.log("record: ", record)
        return res.status(401).send("leave already exists!");
      }
      return LeaveEntitlement.findOneAndUpdate(
        { entity: "chengdu" },
        { $push: { leaveEntitlement: newLeaveEntitlementData } },
        { upsert: true }
      );
    })
    .then((updateRecord) => {
      if (!updateRecord) {
        res.status(400).send("failed to add new leave");
      }
      const newLeaveEntitlementDataForUserDoc = new Leave({
        name: leaveName,
        type: leaveSlug,
        entitlement: leaveEntitlement,
        pending: 0,
        used: 0,
        rollover: leaveRollOver,
        year: date.getFullYear(),
        addedByUser: addedByUser,
      });

      User.updateMany(
        {},
        { $push: { leave: newLeaveEntitlementDataForUserDoc } }
      )
        .then(() => {
          console.log("added new leave to all users");
          res.send("added new leave to all users");
        })
        .catch((err) => {
          console.log("err: ", err);
          res.status(400).send("failed to add leave to all users");
        });
    })
    .catch((err) => {
      console.log("failed to add new leave: ", err);
      res.status(400).send("failed to add new leave");
    });
};

// supp type de congé
exports.postDeleteLeaveType = (req, res, next) => {
  console.log("req.body: ", req.body);
  const leaveName = req.body.leaveName;

  LeaveEntitlement.findOneAndUpdate(
    { entity: "chengdu", "leaveEntitlement.name": leaveName }, // pour une entité appelée "chengdu"
    { $pull: { leaveEntitlement: { name: leaveName } } }
  )
    .then((record) => {
      console.log("record: ", record);
      if (!record) {
        return res.status(400).send("did not find leave type");
      }
      // delete leave type from all users
      User.updateMany({}, { $pull: { leave: { name: leaveName } } })
        .then((result) => {
          if (!result) {
            console.log("failed to delete leave type from all users");
          }
          console.log("result: ", result);
          console.log("deleted new leave to all users");
          return res.send("deleted new leave to all users");
        })
        .catch((err) => {
          console.log("err: ", err);
          return res.status(400).send("failed to add leave to all users");
        });
    })
    .catch((err) => {
      console.log("failed to delete leave type: ", err);
      res.status(400).send("failed to delete leave type");
    });
};

//Accepter demande de congé
// const User = require("path/to/UserModel");
// const functions = require("firebase-functions");
// const admin = require("firebase-admin");

exports.approveLeave = async (req, res, next) => {
  try {
    const {
      staffEmail,
      coveringEmail,
      reportingEmail,
      dateRange,
      leaveType,
      leaveStatus,
      numOfDaysTaken,
      submittedOn,
      start,
      end,
      leaveClassification,
      staffName,
    } = req.body;

    if (leaveStatus !== "pending") {
      return res.status(400).send("Leave status is not pending");
    }

    // Update reporting's staffLeave
    const reportingUser = await User.findOneAndUpdate(
      {
        email: reportingEmail,
        "staffLeave.staffEmail": staffEmail,
        "staffLeave.timePeriod": dateRange,
        "staffLeave.leaveType": leaveType,
        "staffLeave.submittedOn": submittedOn,
        "staffLeave.status": leaveStatus,
      },
      { $set: { "staffLeave.$.status": "approved" } },
      { new: true }
    );

    if (!reportingUser) {
      return res
        .status(404)
        .send("Reporting user not found or leave application not found");
    }

    // Update user's leave history to approved
    const user = await User.findOneAndUpdate(
      {
        email: staffEmail,
        "leaveHistory.leaveType": leaveType,
        "leaveHistory.timePeriod": dateRange,
        "leaveHistory.quotaUsed": numOfDaysTaken,
        "leaveHistory.submittedOn": submittedOn,
        "leaveHistory.status": leaveStatus,
      },
      { $set: { "leaveHistory.$.status": "approved" } },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .send("User not found or leave application not found");
    }

    // Update pending and quotaUsed count after approval
    const leaveUpdateResult = await User.findOneAndUpdate(
      { email: staffEmail, "leave.name": leaveType },
      {
        $inc: {
          "leave.$.pending": -numOfDaysTaken,
          "leave.$.used": numOfDaysTaken,
        },
      },
      { new: true }
    );

    if (!leaveUpdateResult) {
      return res.status(404).send("Failed to update leave counts");
    }

    console.log("Subtracted from pending, added to used quota");

    // Send approval email
    const mailOptions = {
      from: `noreply@yourdomain.com`,
      to: staffEmail,
      subject: "Leave Application Approved",
      text: `Dear ${staffName},\n\nYour leave application for ${dateRange} has been approved.\n\nBest regards,\nYour Company`,
    };

    await admin.firestore().collection("mail").add(mailOptions);

    return res.status(200).send("Leave approved and email sent");
  } catch (error) {
    console.error("Error approving leave: ", error);
    return res.status(500).send("An error occurred while approving leave");
  }
};

exports.approveLeave = functions.firestore
  .document("leaveRequests/{requestId}")
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    const staffEmail = data.staffEmail;
    const dateRange = data.dateRange; // Assuming dateRange is part of the data

    const mailOptions = {
      from: "your-email@gmail.com",
      to: staffEmail,
      subject: "Your Leave Request has been Approved",
      html: `
                <div>
                    <p>Your leave request for ${dateRange} has been approved.</p> 
                    <p>Thank you for your submission.</p>
                </div>
            `,
    };

    return transporter
      .sendMail(mailOptions)
      .then(() => {
        console.log("Leave approval email sent");
        return null;
      })
      .catch((error) => {
        console.error("Error sending leave approval email: ", error);
        throw new Error("Error sending leave approval email");
      });
  });

// Refuser demande de congé

exports.rejectLeave = (req, res, next) => {
  // update reporting's staffLeave
  // update staff's leaveHistory
  // send rejection email

  const staffEmail = req.body.staffEmail;
  const coveringEmail = req.body.coveringEmail;
  const reportingEmail = req.body.reportingEmail;
  const dateRange = req.body.dateRange;
  const leaveType = req.body.leaveType;
  const leaveStatus = req.body.leaveStatus;
  const numOfDaysTaken = req.body.numOfDaysTaken;
  const submittedOn = req.body.submittedOn;
  console.log(req.body);

  if (leaveStatus === "pending") {
    // update pending count after rejection
    User.findOneAndUpdate(
      { email: staffEmail, "leave.name": leaveType },
      { $inc: { "leave.$.pending": -numOfDaysTaken } }
    )
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .send("did not find user record in db while rejecting leave");
        }

        // update reporting's staffLeave to rejected
        return User.findOneAndUpdate(
          {
            email: reportingEmail,
            "staffLeave.staffEmail": staffEmail,
            "staffLeave.timePeriod": dateRange,
            "staffLeave.quotaUsed": numOfDaysTaken,
            "staffLeave.leaveType": leaveType,
            "staffLeave.submittedOn": submittedOn,
          },
          { $set: { "staffLeave.$.status": "rejected" } }
        );
      })
      .then((reportingOfficer) => {
        if (!reportingOfficer) {
          return res
            .status(401)
            .send("reject leave: did not find reporting officer record in db");
        }

        return User.findOneAndUpdate(
          {
            email: staffEmail,
            "leaveHistory.leaveType": leaveType,
            "leaveHistory.timePeriod": dateRange,
            "leaveHistory.quotaUsed": numOfDaysTaken,
            "leaveHistory.submittedOn": submittedOn,
            "leaveHistory.status": leaveStatus,
          },
          { $set: { "leaveHistory.$.status": "rejected" } }
        );
      })
      .then((staff) => {
        if (!staff) {
          return res
            .status(401)
            .send("reject leave: could not find staff record in db");
        }

        res.status(200).send("leave rejected");
      })
      .catch((error) => {
        console.error("Error rejecting leave: ", error);
        res.status(500).send("Error rejecting leave");
      });
  } else {
    res.status(400).send("Leave status is not pending");
  }
};

exports.approveAttestation = (req, res, next) => {
  // Placeholder function
  console.log("Placeholder function for approving attestation called.");
  res.status(501).send("Not Implemented");
};

// send email reject avec farebase
exports.sendLeaveRejectionEmail = functions.firestore
  .document("leaveRejections/{rejectionId}")
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    const staffEmail = data.staffEmail;
    const rejectionReason = data.rejectionReason;

    const mailOptions = {
      from: "your-email@gmail.com",
      to: staffEmail,
      subject: "Leave Request Rejected",
      html: `
                <div>
                    <p>Hi ${staffEmail}, your leave request has been rejected.</p> 
                    <p>Rejection Reason: ${rejectionReason}</p>
                </div>
                <div>
                    <p>${staffEmail}</p> 
                    <p>：${rejectionReason}</p>
                </div>
            `,
    };

    return transporter
      .sendMail(mailOptions)
      .then(() => {
        console.log("Leave rejection email sent to user");
        return null;
      })
      .catch((error) => {
        console.error("Error sending leave rejection email: ", error);
        throw new Error("Error sending leave rejection email");
      });
  });

//cette fonction récupère les informations d'un utilisateur à partir de son adresse e-mail

exports.getUserInfoByEmail = (req, res, next) => {
  const userEmail = req.params.id;
  // console.log("req.params: ", req.params)
  User.findOne({ email: userEmail })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .send("did not find user record in db while updating user records");
      }
      return res.status(200).send({
        _id: user._id,
        name: user.name,
        isAdmin: user.isAdmin,
        email: user.email,
        grade: user.grade,
        matricule: user.matricule,
        createdOn: user.createdOn,
        lastUpdatedOn: user.lastUpdatedOn,
        reportingEmail: user.reportingEmail,
        coveringEmail: user.coveringEmail,
        leave: user.leave,
        leaveHistory: user.leaveHistory,
        staffLeave: user.staffLeave,
      });
    })
    .catch((err) => {
      // console.log("getUserInfoByEmail err:", err)
      return res.status(400).send("user not found");
    });
};

exports.postUpdateUser = (req, res, next) => {
  const userEmail = req.body.userEmail;
  const newReportingEmail = req.body.newReportingEmail;
  const newCoveringEmail = req.body.newCoveringEmail;
  const newGrade = req.body.newGrade;
  console.log("req.body: ", req.body);
  const date = new Date();
  // update reporting's email
  if (newReportingEmail) {
    User.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          reportingEmail: newReportingEmail,
          lastUpdatedOn: moment(date).format("YYYY/MM/DD H:mm:ss"),
        },
      }
    )
      .then((result) => {
        if (!result) {
          return res
            .status(401)
            .send("did not find user record in db while updating user records");
        }
        // console.log(result)
      })
      .catch((err) => {
        // console.log("update reporting email error: ", err)
        return res.status(400).json(`update reporting email error: ${err}`);
      });
  }
  // update covering's email
  if (newCoveringEmail) {
    User.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          coveringEmail: newCoveringEmail,
          lastUpdatedOn: moment(date).format("YYYY/MM/DD H:mm:ss"),
        },
      }
    )
      .then((result) => {
        if (!result) {
          return res
            .status(401)
            .send("did not find user record in db while updating user records");
        }
        // console.log(result)
      })
      .catch((err) => {
        // console.log("update covering email error: ", err)
        return res.status(400).json(`update covering email error: ${err}`);
      });
  }

  // update le grade de l'utilisateur
  if (newGrade) {
    User.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          grade: newGrade,
          lastUpdatedOn: moment(date).format("YYYY/MM/DD H:mm:ss"),
        },
      }
    )
      .then((result) => {
        if (!result) {
          return res
            .status(401)
            .send(
              "N'a pas trouvé l'enregistrement de l'utilisateur dans la base de données lors de la mise à jour des enregistrements utilisateur"
            );
        }
        // console.log(result)
        return res.status(200).send("Mise à jour réussie");
      })
      .catch((err) => {
        // console.log("Erreur de mise à jour du grade : ", err)
        return res.status(400).json(`Erreur de mise à jour du grade : ${err}`);
      });
  }
};

// In adminController.js

exports.getWorkDay = (req, res, next) => {
  // Placeholder function
  console.log("Placeholder function for getWorkDay called.");
  res.status(501).send("Not Implemented");
};

exports.setWorkDay = (req, res, next) => {
  // Placeholder function
  console.log("Placeholder function for setWorkDay called.");
  res.status(501).send("Not Implemented");
};

/* code garantit que les données des droits aux congés sont disponibles pour l'entité spécifiée, 
soit en les récupérant à partir de la base de données si elles existent déjà, 
soit en les créant avec des valeurs par défaut si elles n'existent pas.

 */
exports.getLeaveEntitlement = (req, res, next) => {
  console.log("get leave entitlement endpoint called!");
  LeaveEntitlement.findOne({ entity: "chengdu" })
    .then((record) => {
      if (!record) {
        const defaultEntitlementValues = [
          { name: "Annual Leave ", entitlement: 30 },
          { name: "Compassionate Leave ", entitlement: 10 },
          { name: "Medical leave ", entitlement: 20 },
          { name: "Hospitalisation leave ", entitlement: 60 },
          { name: "Marriage Leave ", entitlement: 15 },
          { name: "Maternity leave ", entitlement: 90 },
          { name: "Miscarriage Leave ", entitlement: 3 },
          { name: "Paternity Leave ", entitlement: 30 },
          { name: "Unpaid Leave ", entitlement: 30 },
        ];

        const defaultEntitlementValue = new LeaveEntitlement({
          entity: "chengdu",
          leaveEntitlement: defaultEntitlementValues,
        });

        defaultEntitlementValue
          .save()
          .then(() => {
            console.log("returning leave entitlement value");
            return res.status(200).json({
              leaveEntitlement: defaultEntitlementValue.leaveEntitlement,
            });
          })
          .catch((err) => console.log("getLeaveEntitlement err:", err));
      }
      return res
        .status(200)
        .json({ leaveEntitlement: record.leaveEntitlement });
    })
    .catch((err) => console.log("getLeaveEntitlement err:", err));
};

// à un point de terminaison (endpoint) qui gère la mise à jour des droits aux congés
exports.postLeaveEntitlement = (req, res, next) => {
  const updatedLeaveEntitlement = req.body.updatedLeaveEntitlement;
  console.log("post leave entitlement endpoint called!");

  LeaveEntitlement.findOneAndUpdate(
    { entity: "chengdu" },
    { $set: { leaveEntitlement: updatedLeaveEntitlement } },
    { upsert: true }
  )
    .then((record) => {
      if (!record) {
        return res
          .status(400)
          .json("did not find leave entitlement record in db");
      }
      return res.status(200).send("leave entitlement updated");
    })
    .catch((err) => {
      console.log("postLeaveEntitlement err:", err);
      return res.status(400).json(err);
    });
};

// envoyer attestation au users

exports.postSendAttestation = async (req, res) => {
  try {
    const { userEmail, userName, grade, subject, matricule, signature } =
      req.body;

    // Créer un nouveau document PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText(`Sujet: ${subject}`, { x: 50, y: 700 });
    page.drawText(`Nom de l'utilisateur: ${userName}`, { x: 50, y: 650 });
    page.drawText(`Grade: ${grade}`, { x: 50, y: 600 });
    page.drawText(`Email: ${userEmail}`, { x: 50, y: 550 });
    page.drawText(`Matricule: ${matricule}`, { x: 50, y: 500 });
    page.drawText(`Signature: ${signature}`, { x: 50, y: 450 });

    // Convertir le document PDF en buffer
    const pdfBytes = await pdfDoc.save();

    // Configuration du transporteur SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "votre-email@gmail.com",
        pass: "votre-mot-de-passe",
      },
    });

    // Configuration de l'e-mail
    const mailOptions = {
      from: "votre-email@gmail.com",
      to: userEmail,
      subject: "Votre attestation",
      text: "Veuillez trouver ci-joint votre attestation.",
      attachments: [
        {
          filename: "attestation.pdf",
          content: pdfBytes,
          contentType: "application/pdf",
        },
      ],
    };

    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Erreur lors de l'envoi de l'e-mail");
      } else {
        console.log("Email envoyé: " + info.response);
        res.status(200).send("Attestation envoyée par e-mail");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};
