import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ApplyAttestationPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [grade, setGrade] = useState('');
    const [matricule, setMatricule] = useState('');
    const [attestationTravail, setAttestationTravail] = useState(false);
    const [attestationSalaire, setAttestationSalaire] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKENDURL}/user/ApplyAttestation`, {
                name: name,
                email: email,
                grade: grade,
                matricule: matricule,
                attestationTravail: attestationTravail,
                attestationSalaire: attestationSalaire
            });
            console.log(response.data);
            toast.success('Attestation request submitted successfully!');
            setIsLoading(false);
            // Redirect to another page after submission
            navigate('/other-page');
        } catch (error) {
            console.error('Error submitting attestation request:', error);
            toast.error('An error occurred while submitting the request.');
            setIsLoading(false);
        }
    };

    return (
    
            <div className="bg-rose-100 h-screen flex flex-col justify-center items-center">
    <h2 className="text-slate-600 text-3xl mb-8">Attestation Request</h2>
            <form className="w-full flex flex-col justify-start items-center "></form>

         
            {/* <form onSubmit={handleSubmit}> */}
            
            
            <form className="w-full flex flex-col justify-start items-center">
            <div className="form-group">
             <label className="label text-lg font-weight-900 -ml-1 m">Name:</label>
                <input type="text" className="input input-bordered w-full max-w-xs" id="name" required />
                </div>

               
                <div className="form-group">
    <label htmlFor="email" className="label text-lg font-weight-900 -ml-1 m">Email:</label>
    <input type="email" id="email" className="input input-bordered w-full max-w-xs" required />
</div>

<div className="form-group">
    <label htmlFor="password" className="label text-lg font-weight-900 -ml-1 m">Matricule:</label>
    <input type="text" id="matricule" className="input input-bordered w-full max-w-xs" required />
</div>

<div className="form-group">
    <label htmlFor="grade" className="label text-lg font-weight-900 -ml-1 m">Grade:</label>
    <input type="text" id="grade" className="input input-bordered w-full max-w-xs" value={grade} onChange={(e) => setGrade(e.target.value)} required />
</div>

<div className="form-group">
    <label className="label text-lg font-weight-900 -ml-1 m">Work Attestation:</label>
    <input type="checkbox" id="attestationTravail" className="checkbox checkbox-primary mr-2" />
</div>

<div className="form-group">
    <label className="label text-lg font-weight-900 -ml-1 m">Salary Attestation:</label>
    <input type="checkbox" id="attestationSalaire" className="checkbox checkbox-primary mr-2" />
</div>

<button type="submit" className={`btn text-lg font-weight-900 -ml-1 label m`}>Submit</button>

            </form>
        </div>
    );
}

export default ApplyAttestationPage;
