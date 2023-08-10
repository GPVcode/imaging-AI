import express from "express";
const router = express.Router();

router.get("/generate-photos", (req, res) => {
    res.send("Fetched from OpenAI API");
});
router.get("/get-photos", (req, res) => {
    res.send("Fetched from Unsplash API");
}) ;

export default router;