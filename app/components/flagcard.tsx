//@ts-nocheck
//@ts-ignore
import { count } from 'console';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const FlagCard = ({ country, flag, price, onClick,englishCountry }) => {
    const router =useRouter()
    return (
        <motion.div
            className="bg-white rounded-lg h-[150px] w-[300px] shadow-md p-4 flex  justify-between cursor-pointer hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=>router.push("/candidates?country="+englishCountry)}
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
                className=" bg-[white] rounded-full flex items-center justify-center"
                // whileHover={{ backgroundColor: '#F59E0B' }}
                whileTap={{ scale: 0.9 }}
            >
                <svg fill='white' data-bbox="20 20 160 160" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" width="52" height="52" data-type="shape">
                    <g>
                        <path fill='#E5BC7E' d="M100 20c-44.184 0-80 35.817-80 80.001C20 144.183 55.817 180 100 180s80-35.817 80-79.999S144.183 20 100 20zm30.819 87.148l-31.791 31.79a10.075 10.075 0 0 1-7.148 2.961c-2.587 0-5.174-.987-7.148-2.961-3.948-3.948-3.948-10.348 0-14.296L109.373 100 84.732 75.359c-3.948-3.948-3.948-10.348 0-14.297 3.948-3.948 10.348-3.948 14.296 0l31.791 31.79c3.948 3.948 3.948 10.348 0 14.296z">

                        </path>
                    </g>
                </svg>            </motion.button>
        </motion.div>
    );
};

const FlagGrid = () => {
    const flags = [
        { country: 'الفلبين', englishCountry: 'Philippines', flag: '/philippines-flag.png', price: '14500' },
        { country: 'باكستان', englishCountry: 'Pakistan', flag: '/pakistan-flag.png', price: '7000' },
        { country: 'بنغلاديش', englishCountry: 'Bangladesh', flag: '/bangladesh-flag.png', price: '7750' },
        { country: 'أوغندا', englishCountry: 'Uganda', flag: '/uganda-flag.png', price: '5700' },
        { country: 'كينيا', englishCountry: 'Kenya', flag: '/kenya-flag.png', price: '6700' },
        { country: 'إثيوبيا', englishCountry: 'Ethiopia', flag: '/ethiopia-flag.png', price: '4550' },];

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">استعرض العاملات حسب الجنسية</h2>
            {/* <div className="flex flex-wrap justify-center gap-4"> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center ">

                {flags.map((flag, index) => (
                    <FlagCard
                        key={index}
                        country={flag.country}
                        englishCountry={flag.englishCountry}
                        flag={flag.flag}
                        price={flag.price}
                        // onClick={() => alert(`${flag.country} selected!`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FlagGrid;