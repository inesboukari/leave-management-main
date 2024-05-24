import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMainContext } from '../hooks/useMainContext';

/* Un administrateur crée un nouveau type de congé */

function CreateNewLeave() {
  const { currentUser, fetchCurrentUserInfo } = useMainContext();
  const [leaveName, setLeaveName] = useState('');
  const [leaveEntitlement, setLeaveEntitlement] = useState('');

  const navigate = useNavigate();

  const handleCreateClick = async (e) => {
    e.preventDefault();
    
    if (!leaveName || !leaveEntitlement) {
      return toast.error("Fill in all blanks!");
    }

    const createLeaveFormData = {
      leaveName: leaveName,
      leaveSlug: leaveName.split(" ")[0].toLowerCase(),
      leaveEntitlement: leaveEntitlement,
      leaveRollOver: "no",
      userAdded: currentUser.email,
      addedOn: new Date()
    };

    console.log("createLeaveFormData: ", createLeaveFormData);

    try {
      const resp = await axios.post(`${process.env.REACT_APP_BACKENDURL}/admin/create-new-leave`, createLeaveFormData);
      console.log(resp);

      // Fetch current user info
      fetchCurrentUserInfo();

      // Navigate to delete leave type page
      navigate('/delete-leave-type');

      // Reload the page
      window.location.reload();
    } catch (err) {
      console.log("catch block: ", err);

      if (err.response) {
        if (err.response.status === 400) return toast.error("Failed to create new leave");
        if (err.response.status === 401) return toast.error("Leave type already exists!");
        console.log(err.message, ": ", err.response.data);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="bg-rose-100 h-screen">
      <div className="flex flex-col w-full border-opacity-50">
        <div className='grid place-items-center mt-8 mb-6'>
          <p className='text-slate-600 text-3xl taraji'>
            Create <span className="text-sky-500 taraji">New Leave</span>
          </p>
        </div>
        <div className="grid h-58 card rounded-box place-items-center my-1">
          <form onSubmit={handleCreateClick} className="form-control w-full max-w-xs gap-y-0.5">
            <label className="label text-sm">Leave Name (in EN)</label>
            <input
              type="text"
              placeholder=''
              className="input input-bordered w-full max-w-xs"
              value={leaveName}
              onChange={(e) => setLeaveName(e.target.value)}
            />
            <label className="label text-sm">Leave Entitlement</label>
            <input
              type="number"
              placeholder=''
              className="input input-bordered w-full max-w-xs"
              step="0.5"
              value={leaveEntitlement}
              onChange={(e) => setLeaveEntitlement(e.target.value)}
            />
            <button
              type="submit"
              className="btn bg-rose-300 text-white text-center text-base font-semibold shadow-md rounded-lg mt-4"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Si la création réussit, la page est redirigée vers /delete-leave-type, une page pour supprimer des types de congés existants */

export default CreateNewLeave;
