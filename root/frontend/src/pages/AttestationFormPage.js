import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import nodemailer from 'nodemailer';

const AttestationForm = () => {
    const [subject, setSubject] = useState('');
    const [userName, setUserName] = useState('');
    const [grade, setGrade] = useState('');
    const [email, setEmail] = useState('');
    const [matricule, setMatricule] = useState('');
    const [signature, setSignature] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKENDURL}/admin/AttestationForm`, {
                subject: subject,
                userName: userName,
                grade: grade,
                email: email,
                matricule: matricule,
                signature: signature,
            });

            // Création du document PDF
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            page.drawText(`Subject: ${subject}`, { x: 50, y: 700 });
            page.drawText(`User Name: ${userName}`, { x: 50, y: 650 });
            page.drawText(`Grade: ${grade}`, { x: 50, y: 600 });
            page.drawText(`Email: ${email}`, { x: 50, y: 550 });
            page.drawText(`Matricule: ${matricule}`, { x: 50, y: 500 });
            page.drawText(`Signature: ${signature}`, { x: 50, y: 450 });

            // Conversion du PDF en buffer
            const pdfBytes = await pdfDoc.save();

            // Configuration du transporteur SMTP
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'votre-email@gmail.com',
                    pass: 'votre-mot-de-passe'
                }
            });

            // Configuration de l'e-mail
            const mailOptions = {
                from: 'votre-email@gmail.com',
                to: email,
                subject: 'Votre attestation',
                text: 'Veuillez trouver ci-joint votre attestation.',
                attachments: [
                    {
                        filename: 'attestation.pdf',
                        content: pdfBytes,
                        contentType: 'application/pdf'
                    }
                ]
            };

            // Envoi de l'e-mail
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Erreur lors de l'envoi de l'e-mail: ", error);
                } else {
                    console.log('Email envoyé avec succès.', info.response);
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <img src="/chemin/vers/votre/logo.png" alt="Logo La Poste Tunisienne" />
            <div className="flex justify-center items-center h-screen bg-rose-100">
                <div className="form-container max-w-xs">
                    <h2 className="text-center text-3xl text-slate-600 mb-6 p">Attestation - La Poste Tunisienne</h2>
                    <form onSubmit={handleSubmit}>
                        <label className="label text-sm">Subject:</label>
                        <input type="text" required className="input input-bordered w-full" onChange={(e) => setSubject(e.target.value)} />

                        <label className="label text-sm">User Name:</label>
                        <input type="text" required className="input input-bordered w-full" onChange={(e) => setUserName(e.target.value)} />

                        <label className="label text-sm">Grade:</label>
                        <input type="text" required className="input input-bordered w-full" onChange={(e) => setGrade(e.target.value)} />

                        <label className="label text-sm">Email:</label>
                        <input type="email" required className="input input-bordered w-full" onChange={(e) => setEmail(e.target.value)} />

                        <label className="label text-sm">Matricule:</label>
                        <input type="text" required className="input input-bordered w-full" onChange={(e) => setMatricule(e.target.value)} />

                        <label className="label text-sm">Signature:</label>
                        <input type="text" required className="input input-bordered w-full" onChange={(e) => setSignature(e.target.value)} />
                        
                        <div className="flex justify-center bg-rose-100">
                            <button type="submit" className="btn btn-primary text-sm px-4 py-2 bg-rose-400">Send Attestation</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AttestationForm;
