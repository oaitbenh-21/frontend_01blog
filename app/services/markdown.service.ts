import { Injectable } from '@angular/core';

export interface BlogPostMetadata {
    title: string;
    subtitle: string;
    tags: number;
    image: string;
    content: string;
    rawContent: string;
}

@Injectable({
    providedIn: 'root'
})
export class MarkdownParserService {
    parseMarkdown(markdown: string): BlogPostMetadata {
        const lines = markdown.split('\n');
        let frontmatter: Record<string, string> = {};
        let contentStartIndex = 0;
        let hasFrontmatter = false;

        if (lines[0] && lines[0].trim() === '---') {
            hasFrontmatter = true;
            let i = 1;

            while (i < lines.length && lines[i].trim() !== '---') {
                const line = lines[i].trim();
                if (line && line.includes(':')) {
                    const colonIndex = line.indexOf(':');
                    const key = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim();
                    frontmatter[key] = value.replace(/^["']|["']$/g, '');
                }
                i++;
            }

            contentStartIndex = i + 1;
        }

        const contentLines = lines.slice(contentStartIndex);
        const content = contentLines.join('\n').trim();

        const title = this.extractTitle(frontmatter, content);
        const subtitle = this.extractSubtitle(frontmatter, content);
        const image = this.extractImage(frontmatter, content);
        const tags = parseInt(frontmatter['tags']) || 0;

        return {
            title,
            subtitle,
            tags,
            image,
            content,
            rawContent: markdown
        };
    }

    parseMultiple(markdownArray: string[]): BlogPostMetadata[] {
        return markdownArray.map(md => this.parseMarkdown(md));
    }


    private extractTitle(frontmatter: Record<string, string>, content: string): string {
        if (frontmatter['title']) {
            return frontmatter['title'];
        }

        const h1Match = content.match(/^#\s+(.+)$/m);
        if (h1Match && h1Match[1]) {
            return h1Match[1].trim();
        }

        const anyHeadingMatch = content.match(/^#{1,6}\s+(.+)$/m);
        if (anyHeadingMatch && anyHeadingMatch[1]) {
            return anyHeadingMatch[1].trim();
        }

        return 'Untitled Post';
    }


    private extractSubtitle(frontmatter: Record<string, string>, content: string): string {
        if (frontmatter['subtitle']) {
            return frontmatter['subtitle'];
        }
        if (frontmatter['description']) {
            return frontmatter['description'];
        }

        const contentWithoutH1 = content.replace(/^#\s+.+$/m, '').trim();

        const h2Match = contentWithoutH1.match(/^##\s+(.+)$/m);
        if (h2Match && h2Match[1]) {
            return h2Match[1].trim();
        }

        const lines = contentWithoutH1.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (
                trimmedLine &&
                !trimmedLine.startsWith('#') &&
                !trimmedLine.startsWith('!') &&
                !trimmedLine.startsWith('```') &&
                !trimmedLine.startsWith('---')
            ) {
                return trimmedLine.length > 150
                    ? trimmedLine.substring(0, 150) + '...'
                    : trimmedLine;
            }
        }

        return '';
    }

    private extractImage(frontmatter: Record<string, string>, content: string): string {
        if (frontmatter['image']) {
            return frontmatter['image'];
        }
        if (frontmatter['cover']) {
            return frontmatter['cover'];
        }
        if (frontmatter['thumbnail']) {
            return frontmatter['thumbnail'];
        }

        const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
        if (imageMatch && imageMatch[1]) {
            return imageMatch[1].trim();
        }

        return 'https://via.placeholder.com/160x120/6366f1/ffffff?text=Post';
    }




    extractHeadings(markdown: string): Array<{ level: number, text: string }> {
        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        const headings: Array<{ level: number, text: string }> = [];
        let match;

        while ((match = headingRegex.exec(markdown)) !== null) {
            headings.push({
                level: match[1].length,
                text: match[2].trim()
            });
        }

        return headings;
    }
}