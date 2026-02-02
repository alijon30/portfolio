import { useEffect, useRef } from 'react';

const Background = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawGradient = () => {
            time += 0.002;

            const width = canvas.width;
            const height = canvas.height;

            // Create gradient
            const gradient = ctx.createRadialGradient(
                width * (0.3 + Math.sin(time) * 0.2),
                height * (0.3 + Math.cos(time * 0.7) * 0.2),
                0,
                width * 0.5,
                height * 0.5,
                width * 0.8
            );

            // Animated gradient colors
            gradient.addColorStop(0, `hsla(${260 + Math.sin(time * 0.5) * 20}, 80%, 50%, 0.3)`);
            gradient.addColorStop(0.3, `hsla(${220 + Math.cos(time * 0.3) * 20}, 70%, 40%, 0.2)`);
            gradient.addColorStop(0.6, `hsla(${280 + Math.sin(time * 0.4) * 15}, 60%, 30%, 0.15)`);
            gradient.addColorStop(1, 'transparent');

            // Fill background
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, width, height);

            // Draw main gradient
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Second gradient blob
            const gradient2 = ctx.createRadialGradient(
                width * (0.7 + Math.cos(time * 0.8) * 0.15),
                height * (0.6 + Math.sin(time * 0.6) * 0.2),
                0,
                width * 0.6,
                height * 0.6,
                width * 0.6
            );

            gradient2.addColorStop(0, `hsla(${200 + Math.cos(time * 0.4) * 20}, 80%, 45%, 0.25)`);
            gradient2.addColorStop(0.5, `hsla(${240 + Math.sin(time * 0.5) * 15}, 60%, 35%, 0.1)`);
            gradient2.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient2;
            ctx.fillRect(0, 0, width, height);

            // Add subtle noise texture effect
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * 8;
                data[i] = Math.max(0, Math.min(255, data[i] + noise));
                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
            }
            ctx.putImageData(imageData, 0, 0);

            animationFrameId = requestAnimationFrame(drawGradient);
        };

        resize();
        drawGradient();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="background-canvas"
            aria-hidden="true"
        />
    );
};

export default Background;
