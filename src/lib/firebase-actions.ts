
'use server';

import { getAuth } from 'firebase-admin/auth';
import '@/lib/firebase-admin'; // Ensure admin app is initialized

export async function verifyEmail(oobCode: string): Promise<void> {
    try {
        const auth = getAuth();
        await auth.applyActionCode(oobCode);
    } catch (error: any) {
        console.error("Error verifying email:", error.code);
        if (error.code === 'auth/invalid-action-code') {
            throw new Error('This verification link is invalid or has already been used. Please request a new one.');
        }
        throw new Error('Failed to verify email. Please try again.');
    }
}

export async function confirmPasswordReset(oobCode: string, newPassword: string):Promise<void> {
    try {
        const auth = getAuth();
        await auth.applyActionCode(oobCode);
        const email = await auth.verifyPasswordResetCode(oobCode);
        const user = await auth.getUserByEmail(email);
        await auth.updateUser(user.uid, { password: newPassword });
    } catch (error: any) {
         console.error("Error resetting password:", error.code);
         if (error.code === 'auth/invalid-action-code') {
            throw new Error('This password reset link is invalid or has already been used. Please request a new one.');
        }
        throw new Error('Failed to reset password. Please try again.');
    }
}
