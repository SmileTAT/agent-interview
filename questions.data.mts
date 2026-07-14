import { createContentLoader } from 'vitepress'

export interface QuestionItem {
  url: string
  title: string
  topic: string
  type: string
  difficulty: string
  tags: string[]
  source: string
  lastReviewedAt: string
}

declare const data: QuestionItem[]
export { data }

export default createContentLoader('questions/**/*.md', {
  transform(raw): QuestionItem[] {
    return raw
      .filter((page) => page.frontmatter.title && !page.frontmatter.exclude)
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title as string,
        topic: (frontmatter.topic as string) ?? '未分类',
        type: (frontmatter.question_type as string) ?? '概念题',
        difficulty: (frontmatter.difficulty as string) ?? '中级',
        tags: (frontmatter.tags as string[]) ?? [],
        source:
          frontmatter.source === 'original' || !frontmatter.source
            ? '原创题'
            : [frontmatter.source.company, frontmatter.source.role, frontmatter.source.round, frontmatter.source.date]
                .filter(Boolean)
                .join(' · '),
        lastReviewedAt: String(frontmatter.last_reviewed_at ?? ''),
      }))
      .sort((a, b) => a.topic.localeCompare(b.topic, 'zh'))
  },
})
