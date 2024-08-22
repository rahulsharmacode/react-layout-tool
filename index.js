#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { structure } from "./constant/structure/index.structure.js";
import { contents } from "./constant/content/index.content.js";
import inquirer from "inquirer";

/* ========== Function to create folders and files ========== */

function createStructure({ extension, style }) {
  Object.keys(structure).forEach((folder) => {
    const folderPath = path.join(process.cwd(), folder);

    /* ========== Create the folder if it doesn't exist ========== */
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      // console.log(`Created folder: ${folderPath}`);
    }

    /* ========== Create the files in the folder ========== */
    structure[folder].forEach((file) => {
      let newFileName;

      // Replace extensions based on the user's choice
      if (extension === ".tsx") {
        newFileName = file.replace(/\.jsx$/, ".tsx").replace(/\.js$/, ".ts");
      } else if (extension === ".jsx") {
        newFileName = file.replace(/\.js$/, ".js"); // Keep .js as it is if .jsx is selected
      }

      // Replace style extension based on the user's choice
      newFileName = newFileName.replace(/\.css$/, style);

      const filePath = path.join(folderPath, newFileName);
      if (!fs.existsSync(filePath)) {
        // Adjust the content lookup to use the new file name with correct extensions
        let originalFileName = file;
        if (extension === ".tsx") {
          originalFileName = originalFileName
            .replace(/\.jsx$/, ".jsx")
            .replace(/\.js$/, ".js");
        }
        if (style === ".scss") {
          originalFileName = originalFileName.replace(/\.css$/, ".css");
        }
        // console.log(contents[originalFileName] , originalFileName , filePath ,  newFileName ,"contents[originalFileName]")
        const content = contents[originalFileName] || "";
        fs.writeFileSync(
          filePath,
          content,
          "utf8"
        ); /* ========== Create an empty file ========== */
      }
    });
  });
}

/* ========== Execute the function ========== */

inquirer
  .prompt([
    {
      type: "list",
      name: "fileExtension",
      message: "Which file type do you want to use?",
      choices: [".jsx", ".tsx"],
    },
    {
      type: "list",
      name: "fileStyle",
      message: "Do you want to use scss or css file?",
      choices: [".scss", ".css"],
    },
  ])
  .then((answers) => {
    const fileExtension = answers.fileExtension;
    const fileStyle = answers.fileStyle;

    createStructure({ extension: fileExtension, style: fileStyle });
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
