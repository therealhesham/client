import { motion } from 'framer-motion';

const FlagCard = ({ country, flag, price, onClick }) => {
    return (
        <motion.div
            className="bg-white rounded-lg h-[150px] w-[300px] shadow-md p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
        >
            <div className="flex items-center space-x-4">
                <img
                    src={flag}
                    alt={`${country} flag`}
                    className="w-12 h-8 rounded-sm object-contain"
                />
                <div className="text-right">
                    <h3 className="text-lg font-semibold text-gray-800">{country}</h3>
                    <p className="text-gray-600">ريال {price}</p>
                </div>
            </div>
            <motion.button
                className="w-8 h-8 bg-[#FBBF24] rounded-full flex items-center justify-center"
                whileHover={{ backgroundColor: '#F59E0B' }}
                whileTap={{ scale: 0.9 }}
            >
                <span className="text-gray-700">→</span>
            </motion.button>
        </motion.div>
    );
};

const FlagGrid = () => {
    const flags = [
        { country: 'الفلبين', flag: '/philippines-flag.png', price: '14500' },
        { country: 'باكستان', flag: '/pakistan-flag.png', price: '7000' },
        { country: 'بنغلاديش', flag: '/bangladesh-flag.png', price: '7750' },
        { country: 'أوغندا', flag: '/uganda-flag.png', price: '5700' },
        { country: 'كينيا', flag: '/kenya-flag.png', price: '6700' },
        { country: 'إثيوبيا', flag: '/ethiopia-flag.png', price: '4550' },
    ];

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">استعرض العاملات حسب الجنسية</h2>
            {/* <div className="flex flex-wrap justify-center gap-4"> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">

                {flags.map((flag, index) => (
                    <FlagCard
                        key={index}
                        country={flag.country}
                        flag={flag.flag}
                        price={flag.price}
                        onClick={() => alert(`${flag.country} selected!`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FlagGrid;