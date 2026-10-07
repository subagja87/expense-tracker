# Expense Tracker CLI

A simple command-line application built with Node.js for tracking personal expenses.

## Features

- Add a new expense
- Update an existing expense
- Delete an expense
- List all expenses
- Show total expenses
- Show total expenses for a specific month of the current year
- Store data in `expenses.json`

## Requirements

- Node.js
- npm

## Installation

Install dependencies:

```bash
npm install
```

## Usage

Show help:

```bash
node app.js --help
```

### Add an expense

```bash
node app.js add --description "Lunch" --amount 20
```

Example output:

```text
Expense added successfully (ID: 1)
```

### Update an expense

```bash
node app.js update --id 1 --description "Dinner" --amount 25
```

### Delete an expense

```bash
node app.js delete --id 1
```

### List all expenses

```bash
node app.js list
```

### Show total expenses

```bash
node app.js summary
```

### Show expenses for a specific month

Use a month number from `1` to `12`.

```bash
node app.js summary --month 10
```

## Data Storage

Expenses are stored locally in:

```text
expenses.json
```

Each expense contains:

- `id`
- `description`
- `amount`
- `date`

Example:

```json
[
  {
    "id": 1,
    "description": "Lunch",
    "amount": 20,
    "date": "2026-10-07"
  }
]
```

## Project

This project was created as part of the roadmap.sh Expense Tracker project.

https://roadmap.sh/projects/expense-tracker
