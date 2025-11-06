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
  { text: 'Trinklet Playground', link: '#playground-experimental' },
      { text: 'Notes', link: '/notes/'}
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
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ankit-ksh/python-for-beginners' }
    ]
  }
})
