interface LinkProps {
    title: string;
    description?: string;
    url: string;
    image?: string;
}

const LinkCard = ({ title, description, url, image }: LinkProps) => {
    return (
        <a href={url} flex gap-4 px-8 py-2>
            <div flex-auto>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            <img
                src={image}
                alt={`Cover image of "${title}"`}
                width="50vh"
                height="50vh"
                my-auto
                flex-none
                object-contain
            />
        </a>
    );
};

export type { LinkProps };
export default LinkCard;