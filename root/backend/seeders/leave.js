import React, { useState, useEffect } from 'react';
import Select from '../components/layout/Select';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useMainContext } from '../hooks/useMainContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

/* Page de demande de congé */

function ApplyLeavePage() {
  const { currentUser, currentLeaveEntitlement, currentLeaveSelection, fetchCurrentUserInfo, setCurrentLeaveSelection } = useMainContext();

  const currentDate = new Date();

  const [leaveOptions, setLeaveOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateRadioSelection, setStartDateRadioSelection] = useState("Full Day");
  const [checkBoxStatus, setCheckBoxStatus] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [numOfDaysApplied, setNumOfDaysApplied] = useState(0);
  const [currentUserAppliedDates, setCurrentUserAppliedDates] = useState([]);
  const [applyBtnLoading, setApplyBtnLoading] = useState("");

  useEffect(() => {
    if (currentUser) {
      setLeaveOptions(currentUser.leave?.map(leave => leave.name));
      setCurrentUserAppliedDates(
        currentUser.leaveHistory?.filter(entry => entry.status === "pending" || entry.status === "approved")?.map(entry => +(entry.startDateUnix))
      );
    }
  }, [currentUser]);

  const userSelectedLeave = currentUser?.leave?.find((leaveType) => leaveType.name === currentLeaveSelection);

  const numOfSelectedLeave = (userSelectedLeave?.name === "Annual Leave (Carry Forward)") 
    ? userSelectedLeave?.entitlement 
    : currentLeaveEntitlement.find(leave => leave.name === userSelectedLeave?.name)?.entitlement - userSelectedLeave?.pending - userSelectedLeave?.used;

  const validateAndSubmitLeaveApplication = (e) => {
    e.preventDefault();
    setApplyBtnLoading("loading");

    if (!currentLeaveSelection) {
      toast.error("Leave type not selected");
      return;
    }
    if (currentUserAppliedDates.includes(startDate.getTime())) {
      toast.error("You have already applied leave on this day");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Start and end date must be selected");
      return;
    }
    if (!startDateRadioSelection) {
      toast.error("Please select AM, PM Leave or Full Day");
      return;
    }
    if (numOfDaysApplied > numOfSelectedLeave) {
      toast.error("Insufficient leave");
      return;
    }
    if (!checkBoxStatus) {
      toast.error("Checkbox not checked!");
      return;
    }

    setIsLoading(true);

    const applyLeaveFormData = {
      userId: currentUser._id,
      staffName: currentUser.name,
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      dateOfApplication: currentDate.getTime(),
      userEmail: currentUser.email,
      coveringEmail: currentUser.coveringEmail,
      reportingEmail: currentUser.reportingEmail,
      remarks: remarks,
      leaveType: currentLeaveSelection,
      leaveClassification: startDateRadioSelection,
      numOfDaysTaken: numOfDaysApplied,
    };

    axios.post(`${process.env.REACT_APP_BACKENDURL}/user/applyLeave`, applyLeaveFormData)
      .then((resp) => {
        setIsLoading(false);
        if (resp.status === 200) {
          fetchCurrentUserInfo(currentUser);
          setCurrentLeaveSelection("Annual Leave");
          toast.success("Leave application successful!");
          navigate('/');
        }
      })
      .catch(err => {
        setIsLoading(false);
        if (err.response && err.response.status === 488) {
          toast.error("Sendgrid email limit exceeded!");
        } else {
          toast.warning("Failed to apply leave");
        }
      });
  };

  const handleStartDateSelection = (date) => {
    if (date.getTime() > endDate) {
      setEndDate(null);
      setNumOfDaysApplied(0);
    }
    setStartDate(date);
    if (startDateRadioSelection !== "Full Day") {
      setTimeout(() => {
        setEndDate(date);
      }, 500);
      setNumOfDaysApplied(0.5);
    } else {
      if (endDate) {
        calculateNumOfBizDays(date, endDate);
      }
    }
  };

  const handleEndDateSelection = (date) => {
    setEndDate(date);
    if (startDate) {
      calculateNumOfBizDays(startDate, date);
    }
  };

  const calculateNumOfBizDays = (start, end) => {
    const days = moment(end).diff(moment(start), 'days') + 1;
    setNumOfDaysApplied(startDateRadioSelection === "Full Day" ? days : days - 0.5);
  };

  return (
    <div>
      {isLoading && <Loading />}
      <form onSubmit={validateAndSubmitLeaveApplication}>
        <Select
          options={leaveOptions}
          value={currentLeaveSelection}
          onChange={setCurrentLeaveSelection}
        />
        <ReactDatePicker
          selected={startDate}
          onChange={handleStartDateSelection}
          dateFormat="yyyy/MM/dd"
        />
        <ReactDatePicker
          selected={endDate}
          onChange={handleEndDateSelection}
          dateFormat="yyyy/MM/dd"
        />
        <div>
          <label>
            <input
              type="radio"
              value="Full Day"
              checked={startDateRadioSelection === "Full Day"}
              onChange={() => setStartDateRadioSelection("Full Day")}
            />
            Full Day
          </label>
          <label>
            <input
              type="radio"
              value="AM"
              checked={startDateRadioSelection === "AM"}
              onChange={() => setStartDateRadioSelection("AM")}
            />
            AM
          </label>
          <label>
            <input
              type="radio"
              value="PM"
              checked={startDateRadioSelection === "PM"}
              onChange={() => setStartDateRadioSelection("PM")}
            />
            PM
          </label>
        </div>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <div>
          <input
            type="checkbox"
            checked={checkBoxStatus}
            onChange={() => setCheckBoxStatus(!checkBoxStatus)}
          />
          I agree to the terms and conditions
        </div>
        <button type="submit" disabled={applyBtnLoading === "loading"}>
          Apply Leave
        </button>
      </form>
    </div>
  );
}

export default ApplyLeavePage;
