import { useState, useEffect } from 'react';

interface CDMXTimeResult {
  formattedTime: string;
  hour: number;
  isDaytime: boolean;
}

export const useCDMXTime = (): CDMXTimeResult => {
  const [time, setTime] = useState<CDMXTimeResult>({
    formattedTime: '',
    hour: 0,
    isDaytime: true
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Get CDMX time string
      const cdmxTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Mexico_City',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(now);

      // Get CDMX hour (0-23)
      const cdmxHour = parseInt(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Mexico_City',
          hour: 'numeric',
          hour12: false
        }).format(now)
      );

      // Determine if it's daytime (6 AM - 6 PM)
      const isDaytime = cdmxHour >= 6 && cdmxHour < 18;

      setTime({
        formattedTime: cdmxTime,
        hour: cdmxHour,
        isDaytime
      });
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
};
