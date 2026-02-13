export interface Module {
  id: string;
  title: string;
  category: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  description: string;
  is_premium: boolean;
  thumbnail_url: string;
  lessons_count: number;
  duration: string;
  rating: number;
  students: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content_type: "video" | "AR" | "pdf";
  content_url: string;
  order_index: number;
  duration: string;
}

export interface QuizQuestion {
  id: string;
  module_id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

export interface Progress {
  id: string;
  user_id: string;
  module_id: string;
  completion_percentage: number;
  score: number;
}

export const modules: Module[] = [
  {
    id: "1",
    title: "Plomberie : Les Fondamentaux",
    category: "Plomberie",
    level: "Débutant",
    description: "Apprenez les bases de la plomberie résidentielle avec des exercices pratiques en réalité augmentée.",
    is_premium: false,
    thumbnail_url: "",
    lessons_count: 12,
    duration: "6h",
    rating: 4.8,
    students: 1245,
  },
  {
    id: "2",
    title: "Électricité Résidentielle",
    category: "Électricité",
    level: "Débutant",
    description: "Maîtrisez l'installation électrique domestique avec des simulations AR interactives.",
    is_premium: false,
    thumbnail_url: "",
    lessons_count: 15,
    duration: "8h",
    rating: 4.9,
    students: 2103,
  },
  {
    id: "3",
    title: "Mécanique Automobile Avancée",
    category: "Mécanique",
    level: "Avancé",
    description: "Diagnostic moteur et réparations complexes guidés par AR. Certification incluse.",
    is_premium: true,
    thumbnail_url: "",
    lessons_count: 20,
    duration: "12h",
    rating: 4.7,
    students: 867,
  },
  {
    id: "4",
    title: "Soudure Industrielle",
    category: "Mécanique",
    level: "Intermédiaire",
    description: "Techniques de soudure MIG/TIG avec feedback AR en temps réel sur vos gestes.",
    is_premium: true,
    thumbnail_url: "",
    lessons_count: 10,
    duration: "5h",
    rating: 4.6,
    students: 534,
  },
  {
    id: "5",
    title: "Installation Sanitaire",
    category: "Plomberie",
    level: "Intermédiaire",
    description: "Installation complète de salles de bain et cuisines avec guide AR pas à pas.",
    is_premium: true,
    thumbnail_url: "",
    lessons_count: 14,
    duration: "7h",
    rating: 4.8,
    students: 921,
  },
  {
    id: "6",
    title: "Câblage Tableau Électrique",
    category: "Électricité",
    level: "Intermédiaire",
    description: "Apprenez à câbler et configurer un tableau électrique conforme aux normes NF.",
    is_premium: false,
    thumbnail_url: "",
    lessons_count: 8,
    duration: "4h",
    rating: 4.5,
    students: 1567,
  },
];

export const lessons: Lesson[] = [
  { id: "l1", module_id: "1", title: "Introduction aux outils", content_type: "video", content_url: "", order_index: 1, duration: "15min" },
  { id: "l2", module_id: "1", title: "Les types de tuyaux", content_type: "AR", content_url: "", order_index: 2, duration: "25min" },
  { id: "l3", module_id: "1", title: "Raccordement cuivre", content_type: "AR", content_url: "", order_index: 3, duration: "30min" },
  { id: "l4", module_id: "1", title: "Soudure à l'étain", content_type: "video", content_url: "", order_index: 4, duration: "20min" },
  { id: "l5", module_id: "1", title: "Exercice pratique", content_type: "AR", content_url: "", order_index: 5, duration: "40min" },
  { id: "l6", module_id: "1", title: "Documentation technique", content_type: "pdf", content_url: "", order_index: 6, duration: "10min" },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    module_id: "1",
    question: "Quel type de tuyau est recommandé pour l'eau potable ?",
    options: ["PVC", "Cuivre", "PER", "Fonte"],
    correct_answer: 2,
  },
  {
    id: "q2",
    module_id: "1",
    question: "Quelle est la température de fusion de la soudure à l'étain ?",
    options: ["100°C", "183°C", "250°C", "327°C"],
    correct_answer: 1,
  },
  {
    id: "q3",
    module_id: "1",
    question: "Quel outil utilise-t-on pour couper un tuyau cuivre ?",
    options: ["Scie à métaux", "Coupe-tube", "Pince coupante", "Meuleuse"],
    correct_answer: 1,
  },
];

export const userProgress: Progress[] = [
  { id: "p1", user_id: "u1", module_id: "1", completion_percentage: 75, score: 85 },
  { id: "p2", user_id: "u1", module_id: "2", completion_percentage: 40, score: 70 },
  { id: "p3", user_id: "u1", module_id: "6", completion_percentage: 100, score: 92 },
];

export const categories = [
  { name: "Plomberie", icon: "🔧", count: 8, color: "hsl(217 91% 55%)" },
  { name: "Électricité", icon: "⚡", count: 6, color: "hsl(45 93% 55%)" },
  { name: "Mécanique", icon: "⚙️", count: 5, color: "hsl(173 80% 40%)" },
  { name: "Soudure", icon: "🔥", count: 3, color: "hsl(0 84% 60%)" },
];
