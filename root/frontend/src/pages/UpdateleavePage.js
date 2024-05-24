import React, { useState, useEffect } from 'react';
import { useMainContext } from '../hooks/useMainContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

function UpdateleavePage() {


    const { currentUser } = useMainContext(); // Assurez-vous d'avoir currentUser dans votre contexte

    const [editingLeave, setEditingLeave] = useState(null); // Contiendra les détails de la demande de congé en cours d'édition
    const [deletingLeaveId, setDeletingLeaveId] = useState(null); // Contiendra l'ID de la demande de congé en cours de suppression

    const navigate = useNavigate();

    // Fonction pour gérer la soumission du formulaire de modification
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            // Envoi de la demande de modification au backend
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/updateLeaveRequest/${editingLeave._id}`, editingLeave);
            // Gérer la réponse du backend
            if (response.status === 200) {
                toast.success("La demande de congé a été modifiée avec succès !");
                
            }
        } catch (error) {
            console.error("Erreur lors de la modification de la demande de congé :", error);
            toast.error("Une erreur s'est produite lors de la modification de la demande de congé. Veuillez réessayer plus tard.");
        }
    };

    // Fonction pour gérer la suppression d'une demande de congé
    const handleDeleteLeave = async (leaveId) => {
        try {
            // Envoi de la demande de suppression au backend
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/deleteLeaveRequest /${leaveId}`);
            // Gérer la réponse du backend
            if (response.status === 200) {
                toast.success("La demande de congé a été supprimée avec succès !");
            } 
        } catch (error) {
            console.error("Erreur lors de la suppression de la demande de congé :", error);
            toast.error("Une erreur s'est produite lors de la suppression de la demande de congé. Veuillez réessayer plus tard.");
        }
    };


    // Fonction pour gérer l'édition d'une demande de congé
 const handleEditLeave = (leaveEntry) => {
    setEditingLeave(leaveEntry);
}
// Fonction pour annuler l'édition d'une demande de congé
const cancelEditLeave = () => {
    setEditingLeave(null);
}


// Fonction pour annuler la suppression d'une demande de congé
const cancelDeleteLeave = () => {
    setDeletingLeaveId(null);
}



    return (
        <>
            {/* Affichage de l'historique des congés */}
            {currentUser.leaveHistory?.filter(entry => entry.status === "pending" || entry.status === "approved")?.map(entry => (
                <div key={entry._id} className="leave-history-entry">
                    {/* Affichage des détails de la demande de congé */}
                    <p>{moment(entry.startDate).format('DD MMMM YYYY')} - {moment(entry.endDate).format('DD MMMM YYYY')}</p>
                    <p>Type de congé: {entry.leaveType}</p>
                    {/* Boutons Modifier et Supprimer */}
                    <button onClick={() => handleEditLeave(entry)} className="edit-button">Modifier</button>
                    <button onClick={() => handleDeleteLeave(entry._id)} className="delete-button">Supprimer</button>
                </div>
            ))}
    
            {/* Modal de Modification */}
            {editingLeave && (
                <Modal closeModal={cancelEditLeave}>
                 <h2>Modifier la demande de congé</h2>
            <form onSubmit={handleSubmitEdit}>
            {/* Affichez ici un formulaire pré-rempli avec les détails de editingLeave */}
            <label htmlFor="startDate">Date de début:</label>
            <input type="text" id="startDate" value={editingLeave.startDate} onChange={(e) => setEditingLeave({ ...editingLeave, startDate: e.target.value })} />
            <label htmlFor="endDate">Date de fin:</label>
            <input type="text" id="endDate" value={editingLeave.endDate} onChange={(e) => setEditingLeave({ ...editingLeave, endDate: e.target.value })} />
            <label htmlFor="leaveType">Type de congé:</label>
               <select id="leaveType" value={editingLeave.leaveType} onChange={(e) => setEditingLeave({ ...editingLeave, leaveType: e.target.value })}>
    
    {/* Ajoutez d'autres options de type de congé selon vos besoins */}
                </select>
            <button type="submit">Enregistrer les modifications</button>
            <button type="button" onClick={cancelEditLeave}>Annuler</button>
        </form>
                </Modal>
            )}
    
            {/* Modal de Confirmation de Suppression */}
            {deletingLeaveId && (
                <Modal closeModal={cancelDeleteLeave}>
                    <h2>Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer cette demande de congé ?</p>
        <button onClick={() => handleDeleteLeave(deletingLeaveId)}>Supprimer</button>
        <button onClick={cancelDeleteLeave}>Annuler</button> 
                </Modal>
            )}
        </>

)

}


export default UpdateleavePage;
