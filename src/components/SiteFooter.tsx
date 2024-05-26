import {
    DEFAULT_LOCALE,
    SITE_OWNER,
    SITE_SOURCE,
    SITE_START_YEAR,
} from "../config";
import { getTranslation } from "../utils/translation";

interface SiteFooterProps {
    lang?: string;
    owner?: string;
    startYear?: number;
    source?: string;
}

const SiteFooter = ({
    lang = DEFAULT_LOCALE,
    owner = SITE_OWNER,
    startYear = SITE_START_YEAR,
    source = SITE_SOURCE,
}: SiteFooterProps) => {
    const year = new Date().getFullYear();

    return (
        <footer max-w-full flex="~ col" items-center line-height-loose>
            <p>
                © {startYear} - {year} {owner}
            </p>
            <a href={source} inline-flex items-center gap-2>
                <span className="i-logos-github-icon" />
                {getTranslation(lang).siteSource}
            </a>
        </footer>
    );
};

export default SiteFooter;
