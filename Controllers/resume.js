const ResumeModel = require("../Models/resume");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { CohereClient } = require("cohere-ai");

// initialise Cohere Client (use env var in production)
const cohere = new CohereClient({
  token: "zJscvUZ5ryPlHzg9yTvyXAPS2g1cnvD07rDbaFXB",
});

// ------------------ ADD RESUME ------------------
exports.addResume = async (req, res) => {
  try {
    const { job_desc, user } = req.body;

    // read PDF file
    const pdfPath = req.file.path;
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);

    // build prompt
    const prompt = `
You are an expert recruiter and ATS (Applicant Tracking System) evaluator.

Your task:
- Compare the given Resume with the provided Job Description (JD).
- Give a Match Score out of 100.
- Provide detailed feedback about strengths and weaknesses.
- Suggest concrete changes to improve the resume so it aligns better with the JD.

Resume:
${pdfData.text}

Job Description:
${job_desc}

⚠️ OUTPUT FORMAT (MANDATORY):
Score: <number>

Reason:
- Point 1
- Point 2
- Point 3

Improvement:
1. Point 1
2. Point 2
3. Point 3
4. ...
`;
    // ✅ USE NEW CHAT API
    // ✅ USE NEW CHAT API
    const response = await cohere.chat({
      model: "command-a-03-2025",
      temperature: 0.7,
      max_tokens: 300,
      message: prompt, // <— FIXED
    });

    let result = response.text;

    // extract Score and Reason
    const match = result.match(/Score\s*:\s*(\d+)/i);
    const score = match ? parseInt(match[1], 10) : null;

    const reasonMatch = result.match(/Reason\s*:\s*([\s\S]*)/i);
    const reason = reasonMatch ? reasonMatch[1].trim() : null;

    // save in DB
    const newResume = new ResumeModel({
      user,
      resume_name: req.file.originalname,
      job_desc,
      score,
      feedback: reason,
    });

    await newResume.save();

    // delete file after parse
    fs.unlinkSync(pdfPath);

    res.status(200).json({
      message: "Your Analysis is Ready",
      data: newResume,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error", message: err.message });
  }
};

// ------------------ GET USER RESUMES ------------------
exports.getAllResumesForUser = async (req, res) => {
  try {
    const { user } = req.params;
    const resumes = await ResumeModel.find({ user: user }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      message: "Your Previous History",
      resumes: resumes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error", message: err.message });
  }
};

// ------------------ GET ALL RESUMES (ADMIN) ------------------
exports.getResumeForAdmin = async (req, res) => {
  try {
    const resumes = await ResumeModel.find({})
      .sort({ createdAt: -1 })
      .populate("user");
    return res.status(200).json({
      message: "Fetched All Resume Detail",
      resumes: resumes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error", message: err.message });
  }
};
