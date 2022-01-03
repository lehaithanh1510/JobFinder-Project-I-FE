
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notify = (message, handleCallBack) =>
    toast.success(message, {
        autoClose: 2000,
        onClose: () => handleCallBack,
    });


const NotiToast = () => {
    return (
        <div>
            <ToastContainer theme="colored"></ToastContainer>
        </div>
    );
};

export default NotiToast;