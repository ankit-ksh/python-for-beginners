import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Python for beginners",
  description: "Explore computing with Python",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
  { text: 'Playground', link: '#playground' },
  { text: 'Trinket Playground', link: '#playground-experimental' },
  {text: 'Notes', link: '/notes/index.md' },
  {text: 'Problems', link: '/problems/index.md' },
  {text: 'Resources', items: [
    { text: 'Books', link: '/resources/books.md' },
    { text: 'Interactive Playgrounds', link: '/resources/interactive-playgrounds.md' },
    { text: 'Articles & Guides', link: '/resources/articles-and-guides.md' },
    { text: 'Videos', link: '/resources/videos.md' },
    { text: 'Research Papers', link: '/resources/research-papers.md' },
    { text: 'Tools', link: '/resources/tools.md' },
    { text: 'Libraries', link: '/resources/libraries.md' },
    { text: 'Projects', link: '/resources/python-projects.md' },
  ]},
    ],

    sidebar: {
      '/notes/': [
        {
      text: 'Introduction',
      link: '/notes/index.md',
      items: [
        { text: 'Contents', link: '/notes/contents.md' },
        { text: 'Basics of computing', link: '/notes/module1-introduction/1.basics-of-computing.md' },
        { text: 'Why learn Python?', link: '/notes/module1-introduction/2.why-learn-python.md' },
        { text: 'Hello World', link: '/notes/module1-introduction/3.hello-world.md' }
      ]
      },
      {
      text: 'Basics',
      items: [
        { text: 'Getting Started with Python', link: '/notes/module2-basics/1.getting-started-with-python.md' },
      ]
      }
      ],
      '/resources/': [
        {text: 'Books', link: '/resources/books.md'},
        {text: 'Interactive playgrounds', link: '/resources/interactive-playgrounds.md'},
        {text: 'Articles & Guides', link: '/resources/articles-and-guides.md'},
        {text: 'Videos', link: '/resources/videos.md'},
        {text: 'Research papers', link: '/resources/research-papers.md'},
        {text: 'Tools', link: '/resources/tools.md'},
        {text: 'Libraries', link: '/resources/libraries.md'},
        {text: 'Projects', link: '/resources/python-projects.md'},
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ankit-ksh/python-for-beginners' }
    ]
  }
})
