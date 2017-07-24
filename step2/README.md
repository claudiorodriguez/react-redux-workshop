# Step 2

Goal: add react and css modules

  - `npm install --save-dev autoprefixer babel-preset-react css-loader node-sass postcss-loader prop-types react react-dom sass-loader style-loader stylelint stylelint-config-standard`
    - `react` and `react-dom`: to use react
    - `sass-loader` and `node-sass`: for webpack to load SCSS files and convert them into CSS
    - `css-loader`: for webpack to load CSS files and, in our case, to parse them into CSS modules
    - `style-loader`: for webpack to bundle CSS into our javascript, and inline it into the page on demand (to extract all CSS into an external CSS file, you'd need to use ExtractTextPlugin)
    - `stylelint` and `stylelint-config-mailonline`: to lint our CSS
    - `babel-preset-react`: to add some plugins to our babel config, especially to transpile JSX syntax
    - `autoprefixer` and `postcss-loader`: to post-process CSS, adding vendor prefixes to our rules
  - Add `babel-preset-react` to our babel config in `.babelrc`:
    ```json
    {
      "presets": ["es2015", "react"]
    }
    ```
  - Create `.stylelintrc.json`:
    ```json
    {
      "extends": "stylelint-config-standard"
    }
    ```
  - Modify `.eslintrc.json` to add `mailonline/react`:
    ```json
    {
      "extends": ["mailonline", "mailonline/react"],
      "root": true
    }
    ```
  - Create `postcss.config.js` (don't worry too much about it right now):
    ```js
    /* eslint-disable import/no-commonjs, import/unambiguous, filenames/match-regex */
    const autoprefixer = require('autoprefixer');

    module.exports = {
      plugins: [
        autoprefixer({
          browsers: [
            '> 1%',
            'last 3 versions',
            'iOS > 8',
            'not ie < 10'
          ]
        })
      ]
    };
    ```
  - Modify your `module -> rules` array in `webpack.config.babel.js` to add a loader for `.scss` files:
    ```js
    ...
    module: {
      rules: [
        {
          loader: 'babel-loader',
          test: /\.js$/
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader?sourceMap',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3,
                localIdentName: '[local]__[hash:base64:5]',
                modules: true,
                sourceMap: true
              }
            },
            'postcss-loader?sourceMap',
            'sass-loader?sourceMap'
          ]
        }
      ]
    },
    ...
    ```
  - Replace your `lint` script in `package.json` with this:
    ```json
    "lint-scripts": "eslint --ignore-path .gitignore '**/*.js'",
    "lint-styles": "stylelint --ignore-path .gitignore '**/*.{scss,sass,css}'",
    "lint": "npm run lint-scripts && npm run lint-styles && npm run lint-json",
    ```
  - Create `src/styles.scss`:
    ```css
    .container {
      padding: 16px;
      background: #eee;
      border: 1px solid black;
    }
    ```
  - Modify `src/index.js`:
    ```js
    import React from 'react';
    import {render} from 'react-dom';
    import styles from './styles.scss';

    render(
      <div className={styles.container}>Hello world!</div>,
      document.querySelector('[data-react-workshop]')
    );
    ```
  - Modify `demo/index.html`, add this before the `script` element, in the body:
    ```html
    <div data-react-workshop></div>
    ```
  - Run `npm run start` and open `localhost:8080` (or whichever port applies), you should see a grey box with a black border and "Hello world!" inside


Now you're ready for [Step 3](../step3)
