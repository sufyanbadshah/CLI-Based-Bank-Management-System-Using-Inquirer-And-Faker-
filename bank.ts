#! /usr/bin/env node
import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
import Choices from "inquirer/lib/objects/choices.js";

console.log(chalk.bold.italic.redBright.underline("ISKI TOPI USKE SAR BANK"));

// Creating Customer Class
class Customer {
    firstName: string
    lastName: string
    age: number
    gender: string
    mob: number
    accountNum: number

    constructor(firstName: string, lastName: string, age: number, gender: string, mob: number, acc: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.gender = gender;
        this.mob = mob;
        this.accountNum = acc;
    }
}

// Creating Bankaccount Interface
interface BankAccount {
    accountNum: number,
    Balance: number,
}
// Creating Bank Class
class Bank {
    customer: Customer[] = []
    account: BankAccount[] = []

    addCustomer(obj: Customer) {
        this.customer.push(obj)
    }
    addAccountNum(obj: BankAccount) {
        this.account.push(obj)
    }
    transaction(accObj: BankAccount) {
        let newAccount = this.account.filter(acc => acc.accountNum !== accObj.accountNum);
        this.account = [...newAccount, accObj]

    }
}

let ITUSBank = new Bank();


// Creating Customer using faker
for (let i: number = 1; i <= 9999; i++) {
    let firstName = faker.person.firstName("male");
    let lastName = faker.person.lastName();
    let mob = parseInt(faker.phone.number());
    const customer = new Customer(firstName, lastName, 18 + i, "male", mob, 1 + i);
    ITUSBank.addCustomer(customer);
    ITUSBank.addAccountNum({ accountNum: customer.accountNum, Balance: 100 * i })
}


// Creating Bank Functionality

async function BankServices(bank: Bank) {
  do {
    let service = await inquirer.prompt({
        type: "list",
        name: "select",
        message: chalk.bgBlueBright.bold("HAN BHAI PHIR AGAYA TU?, KAAM BATA CHAL!!"),
        choices: ["Balance Inquiry", "Cash Withdrawl", "Cash Deposit", "Exit"],
    })

    // For Balance Inquiry

    if (service.select == "Balance Inquiry") {
        let response = await inquirer.prompt({
            type: "input",
            name: "num",
            message: "Account Bata Bay",
        })
        let account: any = ITUSBank.account.find((acc) => acc.accountNum == response.num)
        if (account) {
            let name = ITUSBank.customer.find((item) => item.accountNum == account.accountNum)

            console.log(`Berozgar,${chalk.green.italic.bold(name?.firstName)} ${chalk.green.italic.bold(name?.lastName)} TERE ACCOUNT ME ABHI ${chalk.whiteBright.italic.bold(account.Balance)} Rupees Hai.
             `);
        }
        else {
            console.log(chalk.red.bold("PEHLE ACCOUNT KHULWA GHAREEB"));

        }
    }

    // For Cash Withdrawal 

    if (service.select == "Cash Withdrawl") {
        let response = await inquirer.prompt({
            type: "input",
            name: "num",
            message: "Phr Agaya Paise Lene, Bhikari Kahi Ka, Account Number Bata",
        })
        let account: any = ITUSBank.account.find((acc) => acc.accountNum == response.num)
        if (account) {
            let answer = await inquirer.prompt({
                type: "number",
                message: "KitnI Bheek Chahie?",
                name: "rupees"
            });


            if (answer.rupees > account.Balance) {
                console.log(chalk.red.bold("Kaam Pe Jaa"));
            }
            let newBalance = account.Balance - answer.rupees;
            // Transaction Method To Be Called
            bank.transaction({ accountNum: account.accountNum, Balance: newBalance });

        }
        else {
            console.log(chalk.red.bold("PEHLE ACCOUNT KHULWA GHAREEB"));
        }



    }
    // For Cash Deposit
    if (service.select == "Cash Deposit") {
        let response = await inquirer.prompt({
            type: "input",
            name: "num",
            message: "Account Number Likh",
        })
        let account: any = ITUSBank.account.find((acc) => acc.accountNum == response.num)
        if (account) {
            let answer = await inquirer.prompt({
                type: "number",
                message: "Kitna Maal Laya?",
                name: "rupees"
            });
            let newBalance = account.Balance + answer.rupees;
            // Transaction Method To Be Called
            bank.transaction({ accountNum: account.accountNum, Balance: newBalance });

        }
        else {
            console.log(chalk.red.bold("PEHLE ACCOUNT KHULWA GHAREEB"));
        }
    }
    
    if (service.select == "Exit") {
        console.log(chalk.red.bold(`THANKS FOR COMING TO, ${chalk.green.bold("ISKI TOPI USKE SAR BANK")}`));
        return;
      }
      
    
  } while (true);
}


BankServices(ITUSBank);
