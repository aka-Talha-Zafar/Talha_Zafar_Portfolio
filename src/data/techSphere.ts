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
    name: "GitHub",
    category: "Backend / Deployment",
    location: [-35, 150],
    detail: "Version control platform",
    iconUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.758-1.333-1.758-1.089-.744.084-.729.084-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.493.997.107-.775.418-1.306.762-1.606-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.465-2.381 1.236-3.221-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3-.404c1.02 0 2.041.138 3 .404 2.293-1.552 3.301-1.23 3.301-1.23.652 1.649.241 2.873.117 3.176.771.84 1.236 1.911 1.236 3.221 0 4.61-2.803 5.624-5.475 5.921.429.369.81 1.096.81 2.21 0 1.595-.014 2.878-.014 3.27 0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12Z'/%3E%3C/svg%3E",
  },
  {
    name: "Jira",
    category: "Backend / Deployment",
    location: [-50, 280],
    detail: "Project planning and tracking",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg",
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
    name: "HTML5",
    category: "Frontend / 3D",
    location: [40, 330],
    detail: "Web structure",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS3",
    category: "Frontend / 3D",
    location: [25, 120],
    detail: "Styling and layout",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    name: "Firebase",
    category: "Backend / Deployment",
    location: [0, 240],
    detail: "Backend services and auth",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg",
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

