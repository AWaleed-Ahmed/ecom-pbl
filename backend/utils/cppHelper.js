import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CPP_DIR = path.join(__dirname, "../../cpp");
const SRC_DIR = path.join(CPP_DIR, "src");
const EXECUTABLE = path.join(SRC_DIR, "main.exe");

export function runCppProgram(args = []) {
  return new Promise((resolve, reject) => {
    console.log("runCppProgram - Executable path:", EXECUTABLE);
    console.log("runCppProgram - CWD:", SRC_DIR);
    console.log("runCppProgram - Args:", args);

    if (!fs.existsSync(EXECUTABLE)) {
      return reject(
        new Error("C++ executable not found. Please compile first.")
      );
    }

    const cpp = spawn(EXECUTABLE, args, {
      cwd: SRC_DIR,
    });

    let output = "";
    let errorOutput = "";

    cpp.stdout.on("data", (data) => {
      const str = data.toString();
      console.log("C++ stdout:", str);
      output += str;
    });

    cpp.stderr.on("data", (data) => {
      const str = data.toString();
      console.error("C++ stderr:", str);
      errorOutput += str;
    });

    cpp.on("error", (err) => {
      console.error("spawn error:", err);
      reject(new Error(`Failed to execute C++ program: ${err.message}`));
    });

    cpp.on("close", (code) => {
      console.log("C++ process closed with code:", code);
      console.log("Final output:", output);
      console.log("Final error output:", errorOutput);

      if (code !== 0) {
        reject(
          new Error(`C++ program exited with code ${code}: ${errorOutput}`)
        );
      } else {
        resolve(output);
      }
    });
  });
}
