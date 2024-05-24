import React from 'react';
import { Link } from 'react-router-dom';

//import logo from '.assets/logoPoste.png'; // Make sure to place your logo in the source folder

const WelcomePage = () => {
    const handleSubmit = () => {
        // Submission logic to be implemented here
        console.log('Form submitted');
    };
    

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-rose-100">
          
            <h1 className="text-2xl text-center font-bold mb-8">Welcome to Tarajina</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                {/* You can add other form fields here if needed */}
                <img src={userLogo} alt="logoPoste" className="w-20 h-20 mb-4" /> {/* Affichez logo de poste */}
               <Link to="/login">
                    <span className='underline text-slate-600'> Login / </span>
                </Link>
            </form>
        </div>
    );
};

export default WelcomePage;
