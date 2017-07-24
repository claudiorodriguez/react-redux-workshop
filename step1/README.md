# Step 1

Goal: get webpack and babel running

  - Set up a new folder to work in
  - `npm init` and press ENTER all the way
  - `npm install --save-dev babel-core babel-loader babel-preset-es2015 eslint eslint-config-mailonline rimraf webpack webpack-dev-server`
    - `webpack`: to bundle our javascript
    - `webpack-dev-server`: to run a server on localhost which bundles and automatically refreshes
    - `babel-core` and `babel-loader`: so that webpack can load js files through babel
    - `babel-preset-es2015`: a rather broad babel preset, just to start with, will transpile a lot of stuff
    - `eslint` and `eslint-config-mailonline`: to have some linting from the get-go
    - `rimraf`: to remove the `dist` folder before building
  - Create a `.gitignore` file with these contents:
    ```
    *.log
    *.swo
    *.swp
    *.lock
    .DS_Store
    .idea/
    .scripts/
    .vagrant/
    .nyc_output/
    .vscode/
    dist/
    coverage/
    dev/
    node_modules/
    ```
  - Create `.eslintrc.json` with these contents:
    ```json
    {
      "extends": "mailonline",
      "root": true
    }
    ```
  - Create `.babelrc` with these contents:
    ```json
    {
      "presets": ["es2015"]
    }
    ```
  - Create `src/index.js` with the following contents:
    ```js
    /* eslint-disable no-console */
    console.log('Hello world!');
    ```
  - Create `webpack.config.babel.js` with these contents:
    ```js
    import path from 'path';

    export default {
      devServer: {
        contentBase: [
          'demo/'
        ],
        host: '0.0.0.0',
        inline: true,
        publicPath: '/dist/',
        watchContentBase: true
      },
      entry: {
        index: './src/index.js'
      },
      module: {
        rules: [
          {
            loader: 'babel-loader',
            test: /\.js$/
          }
        ]
      },
      output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
      }
    };
    ```
  - Create a `demo` folder with an `index.html` file:
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
      <title>Dev server</title>
    </head>
    <body>
      <script src="/dist/index.js" defer></script>
    </body>
    </html>
    ```
  - Modify your `package.json` `scripts` section:
    ```json
    "scripts": {
      "prebuild": "rimraf ./dist",
      "build": "webpack -p",
      "start": "webpack-dev-server",
      "lint": "eslint --ignore-path .gitignore '**/*.js'"
    }
    ```
  - Run `npm run start` and open `localhost:8080` (or whichever port webpack-dev-server gives you) in your browser, and you should see `Hello world!` in your console. Changing the JS or the html will auto-refresh your browser tab
  - Run `npm run build` and you'll see your bundled script in `dist/index.js`

Now you're ready for [Step 2](../step2)
