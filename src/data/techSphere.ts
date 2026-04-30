export type TechCategory =
  | "Core ML/DL"
  | "Computer Vision"
  | "Backend / Deployment"
  | "Frontend / 3D"
  | "Tools";

export type TechMarker = {
  name: string;
  /** [lat, lng] */
  location: [number, number];
  category: TechCategory;
  detail?: string;
  /** URL to an SVG logo (used in the hero tech sphere). */
  iconUrl: string;
};

// Lat/Lng are distributed evenly across the sphere using optimized algorithm.
// Icons positioned towards center and bottom for dense, professional appearance.
export const TECH_SPHERE: TechMarker[] = [
  {
    name: "Python",
    category: "Core ML/DL",
    location: [70, 0],
    detail: "Modeling · data pipelines · tooling",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "PyTorch",
    category: "Core ML/DL",
    location: [50, 130],
    detail: "Training · research → production",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  },
  {
    name: "TensorFlow",
    category: "Core ML/DL",
    location: [35, 260],
    detail: "Deep learning workflows",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    name: "Keras",
    category: "Core ML/DL",
    location: [20, 50],
    detail: "Rapid prototyping",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg",
  },
  {
    name: "Scikit-learn",
    category: "Core ML/DL",
    location: [5, 180],
    detail: "Classical ML · baselines",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "NumPy",
    category: "Core ML/DL",
    location: [-10, 310],
    detail: "Numerics · transforms",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  },
  {
    name: "Pandas",
    category: "Core ML/DL",
    location: [-25, 100],
    detail: "Data wrangling",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  },

  {
    name: "OpenCV",
    category: "Computer Vision",
    location: [-15, 230],
    detail: "Vision pipelines · preprocessing",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
  },
  {
    name: "MediaPipe",
    category: "Computer Vision",
    location: [-40, 20],
    detail: "Holistic landmarks · tracking",
    iconUrl: "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/mediapipe.svg",
  },

  {
    name: "FastAPI",
    category: "Backend / Deployment",
    location: [-35, 150],
    detail: "APIs · inference endpoints",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  },
  {
    name: "Docker",
    category: "Backend / Deployment",
    location: [-50, 280],
    detail: "Reproducible deploys",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "HuggingFace",
    category: "Backend / Deployment",
    location: [-55, 75],
    detail: "Spaces · model hosting",
    iconUrl: "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/huggingface.svg",
  },
  {
    name: "Vercel",
    category: "Backend / Deployment",
    location: [60, 200],
    detail: "Frontend deploys",
    iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M24 22.525H0l12-21.05 12 21.05z'/%3E%3C/svg%3E",
  },

  {
    name: "React",
    category: "Frontend / 3D",
    location: [40, 330],
    detail: "UI · component systems",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "TypeScript",
    category: "Frontend / 3D",
    location: [25, 120],
    detail: "Typed frontend",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "TailwindCSS",
    category: "Frontend / 3D",
    location: [0, 240],
    detail: "Design system · styling",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },

  {
    name: "Git",
    category: "Tools",
    location: [-20, 170],
    detail: "Version control",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "Linux",
    category: "Tools",
    location: [-45, 300],
    detail: "Dev environment",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },
  {
    name: "Jupyter",
    category: "Tools",
    location: [55, 80],
    detail: "Experimentation",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
  },
];

