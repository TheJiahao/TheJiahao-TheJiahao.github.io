---
date: 2025-01-11

title: 使用 React 为 Astro 博客实现动态文章目录
description: 本文介绍了如何为 Astro 博客实现自动高亮当前段落的目录。

draft: true
---

本文将介绍如何为 Astro 博客实现自动高亮当前段落的目录组件。
实现主要分为三步：

1. 根据可见章节计算当前标题
1. 将 Astro 的标题对象嵌套
1. 用 React 实现目录和标题组件

## 获取当前标题

### 分隔章节

为了区分可见章节，需要先用 [remark-sectionize](https://www.npmjs.com/package/remark-sectionize) 插件分隔章节。
首先需要安装插件，笔者使用 `pnpm`，但也可以使用 `npm`、`yarn` 或者其他包管理器。

```shell
pnpm add remark-sectionize
```

接着将插件添加到 Astro 设置文件。

```ts title="astro.config.ts"
import remarkSectionize from "remark-sectionize";
import { defineConfig } from "astro/config";

export default defineConfig({
    ...
    remarkPlugins: [remarkSectionize],
})
```

现在，Astro 生成的 HTML 文件中章节会按标题分隔到 `<section/>` 标签内，例如以下 Markdown 内容

```markdown
# 如何实现目录

## 安装插件

...

## React 组件

...
```

会变成：

```html
<section>
    <h1>如何实现目录</h1>
    <section>
        <h2>安装插件</h2>
        <p>...</p>
    </section>
    <section>
        <h2>React 组件</h2>
        <p>...</p>
    </section>
</section>
```

### 检测可见章节

分隔完章节后就可以用浏览器的 [Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API) 检测可见章节和对应的标题。
Intersection Observer 会在监视的元素可见性变化时调用事先设置的回调函数并传入所有监视的元素。

由于检测可见章节的逻辑比较复杂，笔者选择将其放到 [Hook](https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks) 里面。
本文假设文章内容在 `<article/>` 标签内，且所有脚注都在 `<section class="footnotes"/>` 标签内（Astro 默认情况下会生成）。

```ts title="useSectionVisibility.ts" {10,12,29}
const useSectionVisibility = (id: string): boolean => {
    const [visible, setVisible] = useState<Set<string>>(new Set());
    const [headings, setHeadings] = useState<HTMLHeadingElement[]>([]);

    useEffect(() => {
        // 从上往下获取所有章节
        const sections = Array.from(
            document.querySelectorAll("article section:not(.footnotes)"),
            // 过滤标题层级太深的章节
        ).filter((section) => getHeading(section) !== null);
        // 初始化 IntersectionObserver，回调函数运行后会更新可见标题
        const observer = new IntersectionObserver(updateVisibility(setVisible));

        // 初始化所有标题
        setHeadings(sections.map(getHeading) as HTMLHeadingElement[]);

        // 监视所有章节
        for (const section of sections) {
            observer.observe(section);
        }

        // 清理函数
        return () => {
            observer.disconnect();
        };
    }, []);

    // 判断当前标题
    return id === getCurrentHeading(headings, visible);
};
```

为了方便，笔者选择分别记录可见标题和所有标题。
用 [`querySelectorAll`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelectorAll) 可以按出现顺序获取所有章节。
此外，因为判断当前标题时需要快速的检查标题是否可见，所以笔者选择用 [Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)（散列表）存储可见标题的 id。

接下来笔者将逐一介绍 `getHeading`、`updateVisibility` 和 `getCurrentHeading` 函数。

#### 获取章节标题

获取章节标题的逻辑可用不同方式实现。
本站采用的 [实现方式](https://github.com/TheJiahao/TheJiahao.github.io/blob/124cfcb8bd981c9acc91ae3c30700914a9af9708/src/hooks/useSectionVisibility.ts#L5C1-L13C3) 能限制标题层级，但相对复杂，所以本文仅介绍最简单的实现方式。
[`querySelector`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelector) 会返回章节包含的第一个标题。

```ts title="getHeading.ts"
const getHeading = (section: Element) =>
    section.querySelector<HTMLHeadingElement>("h1,h2,h3,h4,h5,h6");
```

#### 更新可见标题

更新可见标题只需要遍历所有章节并添加新的可见标题和删除不可见标题。

```ts title="updateVisibility.ts"
const updateVisibility =
    (
        setVisible: Dispatch<SetStateAction<Set<string>>>,
    ): IntersectionObserverCallback =>
    (entries) => {
        for (const { target, isIntersecting } of entries) {
            // 不包含标题的章节已经被过滤
            const heading = getHeading(target) as HTMLHeadingElement;

            // 删除不可见标题
            if (!isIntersecting) {
                setVisible((current) =>
                    current.difference(new Set([heading.id])),
                );
                continue;
            }

            // 添加可见标题
            setVisible((current) => current.union(new Set([heading.id])));
        }
    };
```

> [!WARNING/直接根据 visible 更新可见标题]
> 以下方式会导致可见标题出问题，传入 `getVisible` 的 `visible` 是刚初始化的空集。
>
> ```ts {16-18} collapse={10-11}
> const getVisible = (
>     entries: IntersectionObserverEntry[],
>     visible: Set<string>,
>     ): Set<string> => {
>         // 根据现有可见标题计算新的可见标题
>     };
>
> const useSectionVisibility = (id: string): boolean => {
>     const [visible, setVisible] = useState<Set<string>>(new Set());
>     const [headings, setHeadings] = useState<HTMLHeadingElement[]>([]);
>
>     useEffect(() => {
>         ...
>         const observer = new IntersectionObserver((entries) => {
>             setVisible(getVisible(entries, visible));
>         });
>         ...
>     }, []);
>     ...
> };
> ```
>
> 如果读者偏好这种方式，可以参考这篇 Stack Overflow 上的 [回答](https://stackoverflow.com/a/67333323) 使用 `useRef` 获取 `visible` 的值。

### 判断当前标题

本文中当前标题定义为从从上往下数第一个层级最深且可见的标题。
例如以下可见标题中当前标题为 “二级标题1” 和 “三级标题1”。

```txt {3}
一级标题1
一级标题2
    二级标题1
```

```txt {3}
一级标题1
    二级标题1
        三级标题1
一级标题2
    二级标题2
        三级标题2
```

从第二个例子中可以注意到，如果下一个标题层级更浅，则当前标题为第一个最深的标题。
根据这个现象，笔者实现了 `getCurrentHeading` 函数。

```typescript title="getCurrentHeading.ts" {17}
const getCurrentHeading = (
    headings: HTMLHeadingElement[],
    visibleHeadings: Set<string>,
): string | undefined => {
    let current = null;

    for (const heading of headings) {
        if (!visibleHeadings.has(heading.id)) {
            continue;
        }

        if (!current) {
            current = heading;
            continue;
        }

        if (getHeadingDepth(heading) <= getHeadingDepth(current)) {
            break;
        }

        current = heading;
    }

    // Astro 生成的标题都包含 id
    return current?.id;
};
```

标题层级可以用从标题的 [`tagName`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/tagName) 属性获取，例如 `h2` 的层级是 2。
为了避免大小写导致问题，笔者选择在正则表达式后添加 `i` 以忽略大小写。

```ts title="getHeadingDepth.ts"
const getHeadingDepth = (heading: HTMLHeadingElement): number => {
    return Number(heading.tagName.replace(/h/i, ""));
};
```

当前标题也可以定义为所有可见标题，从而同时高亮多个标题或实现更复杂的效果 [^cool_toc]。

## 处理 Astro 标题对象

因为章节之间关系可以用树表示，所以将标题嵌套可以更方便地生成目录。
默认情况下，Astro 的标题对象（`MarkdownHeading`）不包含子标题，所以需要先将标题对象嵌套。

```ts
interface MarkdownHeading {
    depth: number;
    slug: string;
    text: string;
}
```

在 Astro 文件中可以通过 [`Astro.props.headings`](https://docs.astro.build/en/basics/layouts/#markdown-layout-props) 获取包含所有标题对象的列表，其中的标题是从上往下按出现顺序排列的。
例如以下标题结构

```txt
一级标题1
    二级标题1
一级标题2
```

对应的 `headings` 为：

```ts
[
    { depth: 1, slug: "一级标题1-id", text: "一级标题1" },
    { depth: 2, slug: "二级标题1-id", text: "二级标题1" },
    { depth: 1, slug: "一级标题2-id", text: "一级标题2" },
];
```

嵌套后标题列表应为

```ts
[
    {
        depth: 1,
        slug: "一级标题1-id",
        text: "一级标题1",
        subheadings: [
            {
                depth: 2,
                slug: "二级标题1-id",
                text: "二级标题1",
                subheadings: [],
            },
        ],
    },
    {
        depth: 1,
        slug: "一级标题2-id",
        text: "一级标题2",
        subheadings: [],
    },
];
```

以下代码可以将标题对象嵌套，基于 Kevin Drum 的这篇 [文章](https://kld.dev/building-table-of-contents/#building-a-nested-table-of-contents-array)。

## React 组件

## 效果

[^cool_toc]: Kevin Drum, Table of contents progress animation, https://kld.dev/toc-animation/