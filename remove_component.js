const fs = require("fs").promises;
const path = require("path");

const componentName = process.argv[2];

if (!componentName) {
  console.error("Please provide a component name.");
  process.exit(1);
}

// Define the paths
const componentDirectory = path.join(__dirname, "src", "components", componentName);

fs.rm(componentDirectory, { recursive: true, force: true });

console.log(`Component ${componentName} removed successfully.`);
