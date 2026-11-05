import Loader from '@/components/chrome/Loader';
import Topbar from '@/components/chrome/Topbar';
import Tabbar from '@/components/chrome/Tabbar';
import MoreSheet from '@/components/chrome/MoreSheet';
import Footer from '@/components/chrome/Footer';
import Engine from '@/components/Engine';
import HomePage from '@/components/pages/Home';
import StartPage from '@/components/pages/Start';
import SkillsPage from '@/components/pages/Skills';
import PromptingPage from '@/components/pages/Prompting';
import BuildPage from '@/components/pages/Build';
import MotionPage from '@/components/pages/Motion';
import PlaygroundPage from '@/components/pages/Playground';
import AdvancedPage from '@/components/pages/Advanced';
import LaunchPage from '@/components/pages/Launch';

export default function Site() {
  return (
    <>
      <Loader />
      <Topbar />
      <Tabbar />
      <MoreSheet />
      <div className="progress" id="progress"></div>
      <a className="skip" href="#home" id="skiplink">Skip to content</a>
      <HomePage />
      <StartPage />
      <SkillsPage />
      <PromptingPage />
      <BuildPage />
      <MotionPage />
      <PlaygroundPage />
      <AdvancedPage />
      <LaunchPage />
      <Footer />
      <Engine />
    </>
  );
}
