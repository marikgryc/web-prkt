import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Auth.css';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1 = Вибір, 2 = Ввід
  const [method, setMethod] = useState<'email' | 'phone'>('email');

  return (
    <div className="auth-container">
      <motion.div 
         key={step} // Анімація при зміні кроку
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         className="auth-card"
      >
        <h2 className="auth-title">Forgot password</h2>
        
        {step === 1 ? (
          <>
            <p className="auth-subtitle">Please select option to send link reset password</p>
            
            {/* Вибір Email */}
            <div 
                className={`method-card ${method === 'email' ? 'active' : ''}`}
                onClick={() => setMethod('email')}
            >
                <div className="method-icon">✉️</div>
                <div className="method-info">
                    <h4>Send to your email</h4>
                    <p>Link reset will be send to your email address registered</p>
                </div>
            </div>

            {/* Вибір Телефону */}
            <div 
                className={`method-card ${method === 'phone' ? 'active' : ''}`}
                onClick={() => setMethod('phone')}
            >
                <div className="method-icon">📞</div>
                <div className="method-info">
                    <h4>Send to your phone number</h4>
                    <p>Link reset will be send to your phone number</p>
                </div>
            </div>

            <button className="auth-btn" onClick={() => setStep(2)} style={{marginTop: '20px'}}>
                Send link
            </button>
          </>
        ) : (
          <>
             {/* Крок 2: Введення даних */}
             <p className="auth-subtitle">Enter your {method === 'email' ? 'email' : 'phone number'}</p>
             
             <div className="form-group">
                <label className="form-label">
                    {method === 'email' ? 'Enter your email' : 'Enter your phone number'}
                </label>
                <input 
                    type={method === 'email' ? 'email' : 'tel'} 
                    className="form-input" 
                    placeholder={method === 'email' ? 'example@mail.com' : '+380...'}
                />
             </div>

             <button className="auth-btn" style={{marginTop: '20px'}}>
                Confirm
             </button>
          </>
        )}

        <p className="bottom-text">
          Didn't receive link? <span style={{color: '#10b981', cursor: 'pointer'}}>Resend Link</span>
        </p>
        <p className="bottom-text" style={{marginTop: '10px'}}>
             <Link to="/login">Back to Login</Link>
        </p>

      </motion.div>
    </div>
  );
}