'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PaymentSuccessProps {
    amount?: number;
    message?: string;
    onComplete: () => void;
}

export default function PaymentSuccess({ amount, message = 'Payment Successful!', onComplete }: PaymentSuccessProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // --- Confetti Logic ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Particle[] = [];
        const particleCount = 150;
        const colors = ['#5a4fcf', '#34d399', '#f472b6', '#60a5fa', '#fbbf24'];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            color: string;
            size: number;
            alpha: number;
            decay: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 15 + 5; // Fast burst
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.size = Math.random() * 8 + 4;
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.015;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.2; // Gravity
                this.vx *= 0.96; // Air resistance
                this.vy *= 0.96;
                this.alpha -= this.decay;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        // Spawn particles from center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(centerX, centerY));
        }

        let animationFrameId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(ctx);
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                }
            }

            if (particles.length > 0) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // --- Auto-Dismiss Timer ---
    useEffect(() => {
        // Wait for animation to finish then close (approx 2.5s total experience)
        const timer = setTimeout(() => {
            onComplete();
        }, 2800);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 pointer-events-none"
            />

            <div className="z-10 flex flex-col items-center">
                {/* Animated Circle Background */}
                <div className="relative flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-32 h-32 rounded-full bg-[#5a4fcf] flex items-center justify-center shadow-lg shadow-indigo-200"
                    />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1.2, repeat: 2, ease: "easeOut" }}
                        className="absolute w-32 h-32 rounded-full bg-[#5a4fcf] opacity-30"
                    />

                    {/* Checkmark SVG */}
                    <svg
                        className="absolute w-16 h-16 text-white drop-shadow-md"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.2, duration: 0.4, ease: "easeInOut" }}
                            d="M20 6L9 17l-5-5"
                        />
                    </svg>
                </div>

                {/* Text Animations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="mt-8 text-center"
                >
                    <h2 className="text-2xl font-bold text-gray-800">{message}</h2>
                    {amount !== undefined && (
                        <p className="text-4xl font-extrabold text-[#5a4fcf] mt-2">
                            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)}
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
