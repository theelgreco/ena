const fs = require("fs");
const path = require("path");

const componentName = process.argv[2];

if (!componentName) {
  console.error("Please provide a component name.");
  process.exit(1);
}

// Define the paths
const componentDirectory = path.join(__dirname, "src", "components", componentName);
const cssFilePath = path.join(componentDirectory, `${componentName}.module.css`);
const jsxFilePath = path.join(componentDirectory, `${componentName}.jsx`);

console.log(componentDirectory);

// Create the component directory
fs.mkdirSync(componentDirectory);

// Create the CSS file
fs.writeFileSync(cssFilePath, "");

// Create the JSX file
fs.writeFileSync(jsxFilePath, `import styles from './${componentName}.module.css'\n\n` + `export default function ${componentName}() {\n` + `  return (\n` + `    <></>\n` + `  );\n` + `}\n`);

console.log(`Component ${componentName} created successfully.`);
