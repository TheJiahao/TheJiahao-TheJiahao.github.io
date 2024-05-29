import type { ImageMetadata } from "astro";
import { BLOG_IMAGE_PLACEHOLDER } from "../config";
import formatDate from "../utils/formatDate";
import CoverImage from "./CoverImage";
import BlogDetails from "./BlogDetails";

interface BlogCardProps {
    title: string;
    description?: string;
    date: Date;
    url: string;
    image?: ImageMetadata;
}

const BlogCard = ({
    title,
    description,
    date,
    url,
    image = BLOG_IMAGE_PLACEHOLDER,
}: BlogCardProps) => {
    return (
        <article card>
            <a href={url} rel="bookmark">
                <CoverImage image={image} title={title} />
                <BlogDetails
                    title={title}
                    description={description}
                    date={date}
                />
            </a>
        </article>
    );
};

export type { BlogCardProps };
export default BlogCard;
