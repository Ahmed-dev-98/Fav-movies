import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Translates Firebase auth error codes into human-readable messages
 */
export const getFirebaseErrorMessage = (error: unknown): string => {
    // Handle Firebase Auth errors
    if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = error.code as string;

        switch (errorCode) {
            // Sign up errors
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/operation-not-allowed':
                return 'Email/password accounts are not enabled. Please contact support.';
            case 'auth/weak-password':
                return 'Password is too weak. Please choose a stronger password (at least 6 characters).';

            // Sign in errors
            case 'auth/user-disabled':
                return 'This account has been disabled. Please contact support.';
            case 'auth/user-not-found':
                return 'No account found with this email. Please check your email or create a new account.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/invalid-credential':
                return 'Invalid email or password.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            // Default case
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    }

    // Handle generic errors
    if (error && typeof error === 'object' && 'message' in error) {
        return error.message as string;
    }

    return 'An unexpected error occurred. Please try again.';
};