import NavigationHeader from "components/molecules/NavigationHeader";
import NavigationMenu from "components/molecules/NavigationMenu";
import SettingsMenu from "components/molecules/SettingsMenu";
import SocialMenu from "components/molecules/SocialMenu";
import type { TranslatedElement } from "interfaces/TranslatedElement";

const NavigationBar = ({ language }: TranslatedElement) => (
    <nav card p-4 flex="~ col" gap-4 items-center h-full w-60 overflow-auto>
        <header items-center p-2 w-full lg="flex flex-col">
            <NavigationHeader language={language} />
        </header>

        <SocialMenu language={language} />
        <NavigationMenu language={language} />
        <SettingsMenu language={language} mt-auto />
    </nav>
);

export default NavigationBar;
