import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import { motion } from 'framer-motion';

import { useAuth } from '../../context/AuthContext';


const NotFound = () => {

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        if (user) {
            if (user.role == 'ADMIN') {
                navigate('/admin/dashboard')
            }
            if (user.role == 'MANAGER') {
                navigate('/manager/dashboard');
            }
        }
        navigate('/');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 px-4">

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center"
            >
                {typeof window !== 'undefined' && (
                    <DotLottieReact
                        src="https://lottie.host/eaedb738-87ca-46d5-b5ca-6b6491b23b12/JJAudMR6LY.lottie"
                        loop
                        autoplay
                        style={{ width: '100%', height: '100%' }}
                    />
                )}

                <motion.h2
                    className="text-3xl font-semibold text-gray-800 mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Ôi không! Bạn đã lạc đường
                </motion.h2>

                <motion.p
                    className="text-gray-600 mb-8 text-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    Trang bạn tìm kiếm đã bay vào vũ trụ hoặc chưa từng tồn tại.
                </motion.p>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                >
                    <Button
                        onClick={handleClick}
                        variant="contained"
                        startIcon={<ArrowBackIosIcon />}
                        sx={{
                            background: 'linear-gradient(to right, #2563EB, #DB2777)',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            borderRadius: '999px',
                            boxShadow: 3,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            '&:hover': {
                                boxShadow: 6,
                                transform: 'scale(1.05)',
                                background: 'linear-gradient(to right, #1D4ED8, #BE185D)',
                            },
                            transition: 'all 0.3s ease-in-out',
                        }}
                    >
                        Đưa tôi về Trang chủ
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default NotFound;