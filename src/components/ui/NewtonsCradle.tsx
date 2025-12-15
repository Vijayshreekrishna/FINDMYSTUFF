import React from 'react';

interface NewtonsCradleProps {
    size?: number;
    speed?: number;
    color?: string;
}

export const NewtonsCradle: React.FC<NewtonsCradleProps> = ({
    size = 50,
    speed = 1.2,
    color = '#474554'
}) => {
    return (
        <div
            className="newtons-cradle"
            style={{
                // @ts-ignore
                '--uib-size': `${size}px`,
                '--uib-speed': `${speed}s`,
                '--uib-color': color,
            }}
        >
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>

            <style jsx>{`
                .newtons-cradle {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: var(--uib-size);
                    height: var(--uib-size);
                }

                .newtons-cradle__dot {
                    position: relative;
                    display: flex;
                    align-items: center;
                    height: 100%;
                    width: 25%;
                    transform-origin: center top;
                }

                .newtons-cradle__dot::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 25%;
                    border-radius: 50%;
                    background-color: var(--uib-color);
                }

                .newtons-cradle__dot:first-child {
                    animation: swing var(--uib-speed) linear infinite;
                }

                .newtons-cradle__dot:last-child {
                    animation: swing2 var(--uib-speed) linear infinite;
                }

                @keyframes swing {
                    0% {
                        transform: rotate(0deg);
                        animation-timing-function: ease-out;
                    }

                    25% {
                        transform: rotate(70deg);
                        animation-timing-function: ease-in;
                    }

                    50% {
                        transform: rotate(0deg);
                        animation-timing-function: linear;
                    }
                }

                @keyframes swing2 {
                    0% {
                        transform: rotate(0deg);
                        animation-timing-function: linear;
                    }

                    50% {
                        transform: rotate(0deg);
                        animation-timing-function: ease-out;
                    }

                    75% {
                        transform: rotate(-70deg);
                        animation-timing-function: ease-in;
                    }
                }
            `}</style>
        </div>
    );
};

// Full page loader component
export const PageLoader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <NewtonsCradle size={60} color="#84cc16" />
            <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
    );
};
