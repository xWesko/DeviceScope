import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { collectDiagnostics } from '@/services/deviceDiagnostics';
/**
 * Loads the diagnostics once, on demand (refresh) and whenever the app
 * comes back to the foreground, since Lock Task can change in the meantime.
 */
export default function useDeviceDiagnostics() {
    const [diagnostics, setDiagnostics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            setDiagnostics(await collectDiagnostics());
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        void refresh();
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                void refresh();
            }
        });
        return () => {
            subscription.remove();
        };
    }, [refresh]);
    return { diagnostics, isLoading, refresh };
}
