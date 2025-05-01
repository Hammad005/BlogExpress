import React from 'react'

const LiveTime = () => {
const [currentTime, setCurrentTime] = React.useState(new Date());

React.useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
}, []);

return (
    <>
        {/* <p>{currentTime.toLocaleDateString()}</p> */}
        <span className='text-sm dark:text-primary/50 text-accent-foreground/40'>{currentTime.toLocaleTimeString()}</span>
    </>
);
}

export default LiveTime