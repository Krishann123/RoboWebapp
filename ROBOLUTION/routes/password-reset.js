const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const postmark = require('postmark');

// Create Postmark client
const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

// GET /password-reset - Render the initial password reset request page
router.get('/', (req, res) => {
    res.render('password-reset');
});

// POST /password-reset/request-reset - Handle the request to send a reset link
router.post('/request-reset', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            // Return success even if user not found to prevent email enumeration
            return res.json({ success: true, message: 'If your email is registered, you will receive a password reset link.' });
        }
        
        // Generate reset token and expiry
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 86400000; // 24 hours from now
        
        // Save token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();
        
        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/password-reset/reset/${resetToken}`;
        
        // Send email via Postmark in the background to avoid delaying the user's request.
        postmarkClient.sendEmail({
            "From": process.env.POSTMARK_FROM_EMAIL,
            "To": user.email,
            "Subject": "Reset Your Robolution Password",
            "HtmlBody": `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <img src="https://robolution.ph/images/LOGO.webp" alt="Robolution Logo" style="max-width: 200px; margin-bottom: 20px;">
                    <h2 style="color: #00008b;">Reset Your Password</h2>
                    <p>Hello ${user.fullName || user.username},</p>
                    <p>We received a request to reset your password for your Robolution account. Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${resetUrl}" style="background-color: #00008b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>This link will expire in 24 hours.</p>
                    <p><strong>If you didn't request a password reset, please ignore this email and change your password immediately as someone may be trying to access your account.</strong></p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">This is an automated email from Robolution. Please do not reply to this message.</p>
                </div>
            `,
            "TextBody": `
                Reset Your Password
                
                Hello ${user.fullName || user.username},
                
                We received a request to reset your password for your Robolution account. 
                
                Please go to this URL to reset your password: ${resetUrl}
                
                This link will expire in 24 hours.
                
                If you didn't request a password reset, please ignore this email and change your password immediately as someone may be trying to access your account.
                
                This is an automated email from Robolution. Please do not reply to this message.
            `
        }).catch(emailError => {
            // Log the error if sending fails, but don't block the user.
            console.error('Error sending password reset email in the background:', emailError);
        });
        
        // Return a response to the user immediately.
        return res.json({ success: true, message: 'If your email is registered, you will receive a password reset link.' });
        
    } catch (error) {
        console.error('Password reset request error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
    }
});

// GET /password-reset/reset/:token - Render the page to enter a new password
router.get('/reset/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        // Find user with this token and verify it's not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.render('reset-password-error', {
                message: 'Password reset link is invalid or has expired'
            });
        }
        
        // Render reset password form
        res.render('reset-password', {
            token,
            user: { email: user.email }
        });
        
    } catch (error) {
        console.error('Reset password page error:', error);
        res.render('error', {
            message: 'An error occurred while processing your request'
        });
    }
});

// POST /password-reset/reset/:token - Handle the submission of the new password
router.post('/reset/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;
        
        // Basic validation: ensure passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }
        
        // Find user with this token and verify it's not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ success: false, message: 'Password reset link is invalid or has expired' });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        
        // If user has 2FA enabled, they will need to re-setup
        if (user.twoFactorEnabled) {
            user.twoFactorEnabled = false;
            user.twoFactorSecret = undefined;
        }
        
        await user.save();
        
        // Send confirmation email in the background to avoid delaying response
        postmarkClient.sendEmail({
            "From": process.env.POSTMARK_FROM_EMAIL,
            "To": user.email,
            "Subject": "Your Robolution Password Has Been Reset",
            "HtmlBody": `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <img src="https://robolution.ph/images/LOGO.webp" alt="Robolution Logo" style="max-width: 200px; margin-bottom: 20px;">
                    <h2 style="color: #00008b;">Password Reset Successful</h2>
                    <p>Hello ${user.fullName || user.username},</p>
                    <p>Your password has been successfully reset.</p>
                    <p>If you did not make this change, please contact us immediately.</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${req.protocol}://${req.get('host')}/login" style="background-color: #00008b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Login to Your Account</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">This is an automated email from Robolution. Please do not reply to this message.</p>
                </div>
            `,
            "TextBody": `
                Password Reset Successful
                
                Hello ${user.fullName || user.username},
                
                Your password has been successfully reset.
                
                If you did not make this change, please contact us immediately.
                
                Login to your account: ${req.protocol}://${req.get('host')}/login
                
                This is an automated email from Robolution. Please do not reply to this message.
            `
        }).catch(emailError => {
            // Log if email fails, but don't block the user
            console.error('Error sending password reset confirmation email:', emailError);
        });
        
        return res.json({ success: true, message: 'Your password has been reset successfully' });
        
    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while resetting your password' });
    }
});

module.exports = router; 