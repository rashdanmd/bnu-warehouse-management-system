import inquirer from "inquirer";

const App = async () => {
  const welcomeMessage =
    "👋 Welcome to BNU Industry Solutions Ltd. Warehouse Management System\n\nPlease choose from the following options";

  const choices = ["Manage Suppliers", "Exit"];

  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: welcomeMessage,
    choices: choices,
  });
};

App();

console.log("Supplier Management System App is running");
