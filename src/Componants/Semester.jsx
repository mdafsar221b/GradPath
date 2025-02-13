import React, { useState } from 'react';
import SemesterCard from './SemesterCard';
import SemesterOne from './SemesterOne';

const SemesterSection = () => {
    const [showSemesterOne, setShowSemesterOne] = useState(false);

    const Semester = [
        { name: " Sem - 1" },
        { name: " Sem - 2" },
        { name: " Sem - 3" },
        { name: " Sem - 4" },
        { name: " Sem - 5" },
        { name: " Sem - 6" }
    ];

    const handleShowSemesterOne = () => {
        setShowSemesterOne(true);
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold mt-12">BCA DDU Semester</h3>
            {showSemesterOne ? (
                <SemesterOne />
            ) : (
                <div className="mt-6 flex items-center justify-center flex-wrap gap-6">
                    {Semester.map((semester, index) => (
                        <SemesterCard 
                            Semester={semester} 
                            key={index} 
                            onClick={handleShowSemesterOne} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SemesterSection;
