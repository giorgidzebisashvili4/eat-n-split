const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' }); // Correct path to .env file

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.error('DB connection error:', err)); // Added error handling

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  console.log('Deleting all data from the database...');
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log('Error occurred while deleting data:', err);
  }
  console.log('Process exiting...');
  process.exit();
};

// This code checks the command line arguments passed to the script.
// The first command line argument is accessed through process.argv[2].
// If the argument is '--import', the importData function is called.
// If the argument is '--delete', the deleteData function is called.

// 'process.argv' is an array that contains the command line arguments passed to the script.
// The first element (process.argv[0]) is the path to the Node.js executable.
// The second element (process.argv[1]) is the path to the JavaScript file being executed.
// The remaining elements (process.argv[2] onwards) are the command line arguments passed to the script.
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
