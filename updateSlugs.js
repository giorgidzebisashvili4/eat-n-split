const mongoose = require('mongoose');
const slugify = require('slugify');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');
const User = require('./models/userModel'); // Import the Users model

const updateTourSlugs = async () => {
  try {
    dotenv.config({ path: './config.env' });
    const DB = process.env.DATABASE.replace(
      '<password>',
      process.env.DATABASE_PASSWORD,
    );

    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    const tours = await Tour.find();

    for (const tour of tours) {
      tour.slug = slugify(tour.name, { lower: true });
      await tour.save();
    }

    console.log('All tour slugs updated successfully.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

updateTourSlugs();
