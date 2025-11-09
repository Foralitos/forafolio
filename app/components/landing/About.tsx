import { NPCDialogBox } from './NPCDialogBox';
import { useCDMXTime } from '~/hooks/useCDMXTime';

// NPC dialog texts in English
const npcDialogs = [
  "Hey there, traveler! Welcome to Fora's world...",
  "I'm here to tell you about this talented developer from Mexico City.",
  "Fora's journey started with blockchain and web development, diving into the tech world with curiosity and passion.",
  "They've participated in hackathons like AI competitions, built real products like digital catalogs and phone services...",
  "From creating Planeadito to developing ML models, each project taught something new and valuable.",
  "The coolest part? They're always learning, building, and exploring new technologies.",
  "Ready to see what they've created? Let's check out the projects below!"
];

export const About = () => {
  const { isDaytime } = useCDMXTime();
  const backgroundImage = isDaytime ? '/AboutBgDay.png' : '/AboutBg.png';

  const handleStoryComplete = () => {
    // Scroll to Projects section when NPC story finishes
    const projectsElement = document.getElementById('projects');
    if (projectsElement) {
      const yOffset = -80; // Navbar offset
      const y = projectsElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            imageRendering: 'pixelated'
          }}
        />
        {/* Preload both images */}
        <link rel="preload" as="image" href="/AboutBgDay.png" />
        <link rel="preload" as="image" href="/AboutBg.png" />
      </div>

      {/* NPC Character in the scene */}
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 z-10">
        <img
          src="/ForaNpc.png"
          alt="NPC Character"
          className="w-32 h-32 md:w-48 md:h-48 object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Dialog Box at bottom - RPG style */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-8 md:pb-12">
        <NPCDialogBox
          avatarSrc="/ForaNpc.png"
          dialogs={npcDialogs}
          speed={30}
          delayBetweenDialogs={0}
          onComplete={handleStoryComplete}
          compact={true}
        />
      </div>
    </section>
  );
};
