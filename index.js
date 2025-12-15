const express = require("express");
const cors = require("cors");

const app = express();
require("./conn");

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const UserRoutes = require("./Routes/user");
const ResumeRoutes = require("./Routes/resume");

app.use("/api/user", UserRoutes);
app.use("/api/resume", ResumeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
