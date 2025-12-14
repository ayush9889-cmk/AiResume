const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://ayushsingh723400_db_user:ltenASPQPUbIllSQ@cluster0.t39l5o1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((res) => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });
