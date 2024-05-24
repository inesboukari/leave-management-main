
import React from 'react';
import Tab from '../components/layout/Tab';
import Table from '../components/layout/Table';
import { Link } from 'react-router-dom';
import { useMainContext } from '../hooks/useMainContext';


//par admin

function ApproveAttestationPage() {
  const { activeTab } = useMainContext();

  const activeTabSelection = (activeTab) => {
    switch (activeTab) {
      case "Pending":
      case "Home ": //"Home " is the default choice when page loads; 
        return (     // this will set pending tab as default for approve leave page
          <>
            <h1 className='text-xl my-6 text-center'>Pending for Attestation</h1>
            <Table headerType="approval"/>
          </>
        );
      case "Approved":
        return (
          <>
            <h1 className='text-xl mb-6 text-center'>Approval History</h1>
            <Table headerType="approvalHistory"/>
          </>
        );
      default:
        console.log("tab not found!");
        break;
    }
  };

  return (
    <div className='flex flex-col justify-between mt-8'> 
      <Tab/>
      {activeTabSelection(activeTab)}
      <div className="mt-4">
        <Link to="/attestation-form" className="text-blue-600 underline">Access Attestation Form</Link>
      </div>
    </div>
  );
}

export default ApproveAttestationPage;
