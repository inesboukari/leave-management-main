const User = require("../models/user");
const leaveHistory = require("../models/leaveHistory");
const moment = require("moment");
require("moment-weekday-calc");
const sgMail = require("@sendgrid/mail");
const functions = require("firebase-functions");

// Function to find user by email
async function findUserByEmail(email) {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
}

// Function to handle leave application form submission
exports.postLeaveApplicationForm = async (req, res, next) => {
  try {
    const {
      userId,
      userEmail,
      coveringEmail,
      reportingEmail,
      staffName,
      file,
      remarks,
      leaveType,
      numOfDaysTaken,
      leaveClassification,
      dateOfApplication,
      startDate,
      endDate,
    } = req.body;

    // Save leave history data
    const leaveHistoryData = new leaveHistory({
      leaveType: leaveType,
      timePeriod: `${startDate} - ${endDate}`,
      startDateUnix: startDate,
      endDateUnix: endDate,
      staffName: staffName,
      submittedOn: moment(dateOfApplication).format("DD MMM YYYY"),
      quotaUsed: numOfDaysTaken,
      coveringEmail: coveringEmail,
      reportingEmail: reportingEmail,
      leaveClassification: leaveClassification,
      remarks: remarks,
      status: "pending",
      year: moment().year(),
    });

    // Save leave history data to database
    await leaveHistoryData.save();

    // Find user by ID
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Update user's leave history
    user.leaveHistory.push(leaveHistoryData);
    await user.save();

    // Send email to user and covering
    const emailToUserAndCovering = {
      to: userEmail,
      cc: coveringEmail,
      from: "mfachengdu@gmail.com",
      subject: `Leave Application from ${startDate} to ${endDate}`,
      html: `<div>
                <p>Hi ${userEmail}, you applied ${numOfDaysTaken} days of <strong>${leaveType}</strong> from ${startDate} to ${endDate}</p> 
                <p>You will receive an email confirmation once your reporting officer reviews the request, thank you.</p>
              </div>
              <div>
                <p> ${userEmail}，${startDate}${endDate}${numOfDaysTaken}<strong>${leaveType}</strong></p> 
                <p>一。</p>
              </div>`,
    };

    await sgMail.send(emailToUserAndCovering);

    res.status(200).send("Leave application processed successfully");
  } catch (error) {
    console.error("Error processing leave application:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Function to handle attestation submission
exports.postAttestation = async (req, res, next) => {
  try {
    const {
      userId,
      userEmail,
      userMatricule,
      userGrade,
      staffName,
      salaryCertificate,
      EmploymentCertificate,
      file,
    } = req.body;

    // Save attestation data
    const newAttestation = new Attestation({
      userId: userId,
      userEmail: userEmail,
      userMatricule: userMatricule,
      userGrade: userGrade,
      staffName: staffName,
      salaryCertificate: salaryCertificate,
      EmploymentCertificate: EmploymentCertificate,
      file: file,
    });

    // Save attestation to database
    await newAttestation.save();

    // Send email to admin
    const emailToAdmin = {
      to: "admin@example.com",
      from: "mfachengdu@gmail.com",
      subject: "New Attestation Submitted",
      text: `New attestation submitted by ${staffName}`,
    };

    await sgMail.send(emailToAdmin);

    res.status(200).json({ message: "Attestation submitted successfully" });
  } catch (error) {
    console.error("Error submitting attestation:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Function to delete leave request
exports.deleteLeaveRequest = async (req, res, next) => {
  try {
    const userEmail = req.body.userEmail;
    const leaveRequestId = req.body.leaveRequestId;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const leaveRequestIndex = user.leaveHistory.findIndex(
      (leave) => leave._id === leaveRequestId
    );
    if (leaveRequestIndex === -1) {
      return res
        .status(404)
        .json({ message: "Leave request not found in user's history" });
    }

    user.leaveHistory.splice(leaveRequestIndex, 1);
    await user.save();

    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (error) {
    console.error("Error deleting leave request:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Function to update leave request
exports.updateLeaveRequest = async (req, res, next) => {
  try {
    const userEmail = req.body.userEmail;
    const leaveRequestId = req.body.leaveRequestId;
    const updatedLeaveData = req.body.updatedLeaveData;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const leaveRequest = user.leaveHistory.find(
      (leave) => leave._id === leaveRequestId
    );
    if (!leaveRequest) {
      return res.status(404).json({
        message: "Leave request not found in user's history",
      });
    }

    // Update leave request data
    Object.assign(leaveRequest, updatedLeaveData);

    // Save updated user data
    await user.save();

    res.status(200).json({
      message: "Leave request updated successfully",
    });
  } catch (error) {
    console.error("Error updating leave request:", error);
    res.status(500).send("Internal Server Error");
  }
};

// controllers/user.js

exports.getUser = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      return res.status(200).json(users);
    })
    .catch((err) => {
      console.error("Error fetching all users:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    });
};
