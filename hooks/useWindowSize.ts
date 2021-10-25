import { useEffect, useState } from 'react';
import { MediaQueryMatchers } from 'react-responsive/dist/types';

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState<MediaQueryMatchers>();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowSize({
                deviceWidth: window.innerWidth,
                width: window.innerWidth,
                deviceHeight: window.innerHeight,
                height: window.innerHeight,
            });
        }
    }, []);

    return windowSize;
}
