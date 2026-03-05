import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';


const ProgressBar = () => {
    const location = useLocation();
    const intervals = useRef([]);

    useEffect(() => {
        NProgress.set(0);

        intervals.current = [
            setTimeout(() => NProgress.set(0.3), 100),
            setTimeout(() => NProgress.set(0.6), 250),
            setTimeout(() => NProgress.set(0.9), 350),
            setTimeout(() => NProgress.done(), 500),
        ];

        return () => {
            intervals.current.forEach(clearTimeout);
        };
    }, [location.pathname]);

    return null;
};

export default ProgressBar;
