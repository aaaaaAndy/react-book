// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Book',
  tagline: 'React are cool',
  favicon: 'img/logo.svg',

  // Set the production url of your site here
	url: 'https://aaaaaAndy.github.io',
	// Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/react-book/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
	organizationName: 'aaaaaAndy', // Usually your GitHub org/user name.
	projectName: 'react-book', // Usually your repo name.
	deploymentBranch: 'gh-pages',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // 支持 mermaid
  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'React Book',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
	        {
		        type: 'docSidebar',
		        sidebarId: 'v16Sidebar',
		        position: 'left',
		        label: 'v16',
	        },
	        {
		        type: 'docSidebar',
		        sidebarId: 'v17Sidebar',
		        position: 'left',
		        label: 'v17',
	        },
          {
            type: 'docSidebar',
            sidebarId: 'v18Sidebar',
            position: 'left',
            label: 'v18',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
