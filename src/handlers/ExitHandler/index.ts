import inquirer from "inquirer";

export class ExitHandler {
  async confirmExit(): Promise<boolean> {
    const { confirmExit } = await inquirer.prompt({
      name: "confirmExit",
      type: "confirm",
      message: "Are you sure you want to exit?",
    });

    if (confirmExit) {
      await inquirer.prompt({
        name: "goodbye",
        type: "input",
        message: "\n👋 Goodbye!!!!! Press Enter to close the app.",
      });
      process.exit(0);
    }

    return false;
  }
}
