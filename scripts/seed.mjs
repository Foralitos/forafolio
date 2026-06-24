// Seed inicial de proyectos. Ejecutar con:
//   node --env-file=.env scripts/seed.mjs
// Inserta los proyectos actuales solo si la colección está vacía.
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Falta MONGODB_URI (usa: node --env-file=.env scripts/seed.mjs)");
  process.exit(1);
}

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    tags: [String],
    liveUrl: String,
    order: Number,
    published: Boolean,
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

const projects = [
  {
    title: "Furbo",
    description:
      "AI WhatsApp agent for sports predictions and real-time news updates.",
    image: "/projects/Furbo.png",
    tags: ["Next.js", "MongoDB", "Tailwind CSS", "OpenAI", "WhatsApp", "LangGraph"],
    liveUrl: "https://furbo.app",
    order: 0,
    published: true,
  },
  {
    title: "ElAtletico",
    description:
      "Sports newsletter application that uses artificial intelligence to write and research sports match notes.",
    image: "/projects/atletico.png",
    tags: ["Next.js", "Tailwind CSS", "MongoDB", "OpenAI", "N8N"],
    liveUrl: "https://elatletico.news/",
    order: 1,
    published: true,
  },
  {
    title: "Hablar con Santa",
    description:
      "Santa Claus calling service that brought joy to hundreds of children during the holiday season.",
    image: "/projects/santa-mockup.png",
    tags: ["Next.js", "Node.js", "Bland"],
    liveUrl: "https://hablarconsanta.com",
    order: 2,
    published: true,
  },
  {
    title: "FORAUI",
    description:
      "A comprehensive Tailwind CSS component and animation library offering elegant UI elements with fluid motion effects for modern web applications.",
    image: "/projects/whiteforaui.png",
    tags: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://foraui.vercel.app",
    order: 3,
    published: true,
  },
];

await mongoose.connect(MONGODB_URI);

const count = await Project.countDocuments();
if (count > 0) {
  console.log(`Ya hay ${count} proyectos. No se insertó nada.`);
} else {
  await Project.insertMany(projects);
  console.log(`Insertados ${projects.length} proyectos.`);
}

await mongoose.disconnect();
process.exit(0);
