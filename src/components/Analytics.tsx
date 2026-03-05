import { useEffect } from 'react';

/**
 * GA4 Analytics implementation for SpeedSolver.
 * Measurement ID: Replace G-XXXXXXXXXX with your actual Google Analytics ID.
 */
export const Analytics = () => {
    const measurementId = 'G-5JX15F0028';

    useEffect(() => {
        // Only run on client side and if ID is present
        if (typeof window === 'undefined' || !measurementId) return;

        // Load GA script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        // Initialize GA
        window.dataLayer = window.dataLayer || [];
        function gtag(..._args: any[]) {
            // eslint-disable-next-line prefer-rest-params
            window.dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', measurementId);

        return () => {
            // Optional cleanup if necessary
            document.head.removeChild(script);
        };
    }, [measurementId]);

    return null;
};

// Global type declaration for Window
declare global {
    interface Window {
        dataLayer: any[];
    }
}
