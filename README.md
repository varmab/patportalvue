# Calmed Patient Portal
**1. Clone the repository:**
> git clone https://github.com/varmab/patportalvue.git

**2. Open project:**
> cd patportalvue

**3. Add** ```.postcssrc.js``` **file under root directory of the project and place the below code in it**
```
// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: [
    // to edit target browsers: use "browserslist" field in package.json
    require('autoprefixer')
  ]
}
```
**4. Install npm packages:** ``` npm i (or) yarn add ```

**_Note:_** As we set ``` "dev": ""quasar dev" ``` in ``` package.json ``` we can run our application using following command.

**5. Run the project:** ``` npm run dev ```
