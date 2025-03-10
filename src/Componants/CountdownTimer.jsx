// src/components/CountdownTimer.jsx
import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const targetDate = new Date("2025-04-15T00:00:00");

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    let months = targetDate.getMonth() - now.getMonth();
    let days = targetDate.getDate() - now.getDate();
    let hours = targetDate.getHours() - now.getHours();
    let minutes = targetDate.getMinutes() - now.getMinutes();
    let seconds = targetDate.getSeconds() - now.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
    }
    if (days < 0) {
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
    }

    return { months, days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center p-4 flex items-center justify-center flex-col  rounded-lg ">
      <h2 className="text-2xl font-bold text-blue-600">EVERY SECOND COUNTS</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center mt-4">
        <div className="p-4 border rounded-lg bg-gray-100">
          <p className="text-xl font-bold">{timeLeft.months}</p>
          <p className="text-sm">Months</p>
        </div>
        <div className="p-4 border rounded-lg bg-gray-100">
          <p className="text-xl font-bold">{timeLeft.days}</p>
          <p className="text-sm">Days</p>
        </div>
        <div className="p-4 border rounded-lg bg-gray-100">
          <p className="text-xl font-bold">{timeLeft.hours}</p>
          <p className="text-sm">Hours</p>
        </div>
        <div className="p-4 border rounded-lg bg-gray-100">
          <p className="text-xl font-bold">{timeLeft.minutes}</p>
          <p className="text-sm">Minutes</p>
        </div>
        <div className="p-4 border rounded-lg bg-gray-100">
          <p className="text-xl font-bold">{timeLeft.seconds}</p>
          <p className="text-sm">Seconds</p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
