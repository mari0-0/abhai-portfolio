"use client";
import { TransitionRouter } from 'next-transition-router'
import gsap from 'gsap';
import { useRef, useLayoutEffect, useEffect } from 'react';

const ROWS = 4
const COLS = 16

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const TransitionProvider = ({ children }) => {
    const transitionGridRef = useRef(null)
    const blocksRef = useRef([])
    const isInitialMount = useRef(true)

    const createTransitionGrid = () => {
        if (!transitionGridRef.current) return;
        const container = transitionGridRef.current;
        container.innerHTML = "";
        blocksRef.current = [];

        const blockWidth = window.innerWidth / COLS;
        const blockHeight = window.innerHeight / ROWS;

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const block = document.createElement("div");
                const isLeftOrigin = row % 2 === 0;

                let initialClip = `inset(0% 0% 0% 0%)`;
                if (!isInitialMount.current) {
                    if (isLeftOrigin) {
                        initialClip = `inset(0% 100% 0% 0%)`;
                    } else {
                        initialClip = `inset(0% 0% 0% 100%)`;
                    }
                }

                block.className = "transition-block";
                block.style.cssText = `
                    position: absolute;
                    width: ${blockWidth + 1}px;
                    height: ${blockHeight + 1}px;
                    left: ${col * blockWidth}px;
                    top: ${row * blockHeight}px;
                    overflow: hidden;
                    clip-path: ${initialClip};
                    -webkit-clip-path: ${initialClip};
                `;

                block._isLeftOrigin = isLeftOrigin;

                const inner = document.createElement("div");
                inner.style.cssText = `
                    position: absolute;
                    left: -${col * blockWidth}px;
                    top: -${row * blockHeight}px;
                    width: 100vw;
                    height: 100vh;
                    background-color: var(--color-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;

                const img = document.createElement("img");
                img.src = "/assets/logo.svg";
                img.style.cssText = "width: 15rem; max-width: 80vw;";

                inner.appendChild(img);
                block.appendChild(inner);

                container.appendChild(block);
                blocksRef.current.push(block);
            }
        }
    }

    useIsomorphicLayoutEffect(() => {
        createTransitionGrid();
        window.addEventListener("resize", createTransitionGrid);

        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (window.location.pathname === "/") {
                animateOut(undefined, true);
            } else {
                gsap.delayedCall(0.3, () => {
                    animateOut();
                });
            }
        }

        return () => window.removeEventListener("resize", createTransitionGrid);
    }, [])

    const getRowBlocks = (row) => {
        return blocksRef.current.slice(row * COLS, row * COLS + COLS)
    };

    const animateIn = (onComplete) => {
        const tl = gsap.timeline({ onComplete });

        [0, 1, 2, 3].forEach((row) => {
            const blocks = getRowBlocks(row);
            const isLeftOrigin = row % 2 === 0;

            tl.to(
                blocks,
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    webkitClipPath: "inset(0% 0% 0% 0%)",
                    duration: 0.6,
                    ease: "power3.inOut",
                    stagger: {
                        each: 0.025,
                        from: isLeftOrigin ? "start" : "end",
                    },
                },
                "<"
            )
        });
        return tl;
    }

    const animateOut = (onComplete, waitFor3D = false) => {
        const tl = gsap.timeline({ onComplete, paused: waitFor3D });

        [0, 1, 2, 3].forEach((row) => {
            const blocks = getRowBlocks(row);
            const isLeftOrigin = row % 2 === 0;

            tl.to(
                blocks,
                {
                    clipPath: isLeftOrigin ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
                    webkitClipPath: isLeftOrigin ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
                    duration: 0.6,
                    ease: "power3.inOut",
                    stagger: {
                        each: 0.025,
                        from: isLeftOrigin ? "start" : "end",
                    },
                },
                "<"
            )
        });

        if (waitFor3D) {
            if (window.portfolio3DLoaded) {
                tl.play();
            } else {
                let timeoutId;
                const playAnimation = () => {
                    tl.play();
                    window.removeEventListener("portfolio-3d-loaded", playAnimation);
                    clearTimeout(timeoutId);
                };
                window.addEventListener("portfolio-3d-loaded", playAnimation);
                // Fallback in case loading hangs indefinitely
                timeoutId = setTimeout(playAnimation, 5000);
            }
        }

        return tl;
    }

    return (
        <TransitionRouter auto
            leave={
                (next) => {
                    const tl = animateIn(next);
                    return () => tl.kill()
                }
            }
            enter={(next) => {
                const isHome = window.location.pathname === "/";
                const tl = animateOut(next, isHome);
                return () => tl.kill()
            }}
        >
            <div
                className="transition-grid"
                ref={transitionGridRef}
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 10000 }}
            />
            {children}
        </TransitionRouter>
    )
}

export default TransitionProvider