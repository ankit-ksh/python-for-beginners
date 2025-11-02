import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Python for beginners",
  description: "Explore computing with Python",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Resources', 
        items: [ 
          { text: 'Notes', link: '/notes/' },
          { text: 'Code', link: '/code/' },
          { text: 'Notebooks', link: '/notebooks/' }
        ] }
    ],

    sidebar: {
      '/notes/': [
        {
      text: 'Introduction',
      link: '/notes/index.md',
      items: [
        { text: 'Contents', link: '/notes/contents.md' },
        { text: 'Basics of computing', link: '/notes/module1-introduction/basics-of-computing.md' },
        { text: 'Why learn Python?', link: '/notes/module1-introduction/why-learn-python.md' },
        { text: 'Getting started - Hello World', link: '/notes/module1-introduction/hello-world.md' }
      ]
      },
      {
      text: 'Basics',
      items: [
        { text: 'Variables & Data Types', link: '/notes/module2-basics/variables-and-data-types.md' },
      ]
      }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ankit-ksh/python-for-beginners' }
    ]
  }
})
