import { Command } from "commander";
import fs from "fs";

const FILE = "expenses.json";

//Function to load the expenses from the JSON file
function loadExpenses() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, "[]");
    }

    const data = fs.readFileSync(FILE, "utf-8");

    if (!data.trim()) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.log("Error: expenses.json contains invalid JSON");
        process.exit(1);
    }
}

//Function to save expenses to the JSON file
function saveExpenses(expenses) {
    fs.writeFileSync(FILE, JSON.stringify(expenses, null, 2));
}

//Function to get the next available ID
function getId(expenses) {
    if (expenses.length === 0) {
        return 1;
    }
    return Math.max(...expenses.map(expense => expense.id)) + 1;
}

const program = new Command();
program
    .name("Expense Tracker")
    .description("CLI application for tracking user expenses")
    .version("1.0.0");

program
    .command("add")
    .description("Add new expense")
    .requiredOption("-d, --description <text>", "Expense description")
    .requiredOption("-a, --amount <number>", "Expense amount")
    .action((options) => {
        const amount = Number(options.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            console.log("Error: amount must be a positive number");
            process.exit(1);
        }

        const today = new Date().toISOString().split("T")[0];

        const expenses = loadExpenses();
        const newExpense = {
            id: getId(expenses),
            description: options.description,
            amount: amount,
            date: today,
        };

        expenses.push(newExpense);
        saveExpenses(expenses);
        console.log(`Expense added successfully (ID: ${newExpense.id})`);
        
    })

program
    .command("update")
    .description("Update an expense")
    .requiredOption("-i, --id <number>", "Expense ID")
    .requiredOption("-d, --description <text>", "Expense description")
    .requiredOption("-a, --amount <number>", "Expense amount")
    .action((options) => {
        const expenses = loadExpenses();

        const id = Number(options.id);

        if (!Number.isInteger(id) || id <= 0) {
            console.log("Error: ID must be a positive integer");
            process.exit(1);
        }

        const expense = expenses.find(expense => expense.id === id);

        if (!expense) {
            console.log(`Error: expense with ID ${id} is not found`);
            process.exit(1);
        }

        expense.description = options.description;
        
        const amount = Number(options.amount);
        
        if (!Number.isFinite(amount) || amount <= 0) {
            console.log("Error: amount must be a positive number");
            process.exit(1);
        }

        expense.amount = amount;
        saveExpenses(expenses);
        console.log(`Expense updated successfully (ID: ${id})`);
    })

program
    .command("delete")
    .description("delete an expense")
    .requiredOption("-i, --id <number>", "Expense ID")
    .action((options) => {
        const expenses = loadExpenses();

        const id = Number(options.id);

        if (!Number.isInteger(id) || id <= 0) {
            console.log("Error: ID must be an integer");
            process.exit(1);
        }
        
        const index = expenses.findIndex(expense => expense.id === id);
        
        if (index === -1) {
            console.log(`Error: expense with ID ${id} is not found`);
            process.exit(1);
        }
        
        expenses.splice(index, 1);
        
        saveExpenses(expenses);
        console.log(`Expense deleted successfully (ID: ${id})`);
    })

program
    .command("list")
    .description("List all expenses")
    .action(() => {
        const expenses = loadExpenses();
        
        if (expenses.length === 0) {
            console.log("No expenses found");
            return
        }

        console.table(expenses);
    })

program
    .command("summary")
    .description("Display summary of all expenses or summary of expenses for a specific month (of current year)")
    .option("-m, --month <number>", "Month number (1-12)")
    .action((options) => {

        const expenses = loadExpenses()

        //If user did not specify a month, display summary for all expenses
        if (options.month === undefined) {
            const totalAmount = expenses.reduce((total, expense) => {
            return total + expense.amount;
            }, 0)                    
            
            console.log(`Total expenses: $${totalAmount}`)
            return
        }

        //If user specified a month, display summary for that month
        const month = Number(options.month);

        if (!Number.isInteger(month) || month < 1 || month > 12) {
            console.log("Error: month must be a number between 1 and 12");
            process.exit(1);
        }

        const currentYear = new Date().getFullYear();

        const monthlyExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date)
            return (
                expenseDate.getMonth() + 1 === month &&
                expenseDate.getFullYear() === currentYear
            )
        })

        const totalMonthlyAmount = monthlyExpenses.reduce((total, expense) => {
            return total + expense.amount;
        }, 0)
        
        console.log(`Total expenses: $${totalMonthlyAmount}`)
    })

program.parse();