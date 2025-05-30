// ParticlesBackground.jsx
import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // Carga el bundle slim

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    console.log("Particles engine initialized:", engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log("Particles container loaded:", container);
  }, []);

  const options = {
    background: {
      color: {
        value: "transparent", // Importante para ver tu degradado de fondo
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff", // Color de las partículas (blanco para contrastar con el degradado)
      },
      links: {
        color: "#ffffff", // Color de las líneas entre partículas
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 2, // Velocidad de las partículas
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80, // Cantidad de partículas
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle", // Forma de las partículas
      },
      size: {
        value: { min: 1, max: 3 }, // Tamaño de las partículas
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 5, // Las partículas van en la capa de atrás
      }}
    />
  );
};

export default ParticlesBackground;