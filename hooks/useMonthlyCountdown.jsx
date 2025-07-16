import moment from 'moment';
import {useEffect, useState} from 'react';

const useMonthlyCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const endOfMonth = moment().endOf('month').hour(23).minute(59).second(59);
      const duration = moment.duration(endOfMonth.diff(now));

      setTimeLeft({
        days: duration.days(),
        hours: duration.hours(),
        mins: duration.minutes(),
        secs: duration.seconds(),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};

export default useMonthlyCountdown;
