import express from "express";
const router = express.Router();
import controller from '../controllers/controller.js'

router.post("/generate-photos", async (req, res) => {
    try{
        const inputValue = req.body.inputValue;
        const myImages = await controller.generatePhotos(inputValue);
        // handle myImages array as needed and send response
        res.json(myImages);
    } catch(error){
        console.error("API call error:", error);
        res.status(500).json({ error: 'An error occurred while processing the request'});
    }
});

router.get("/get-photos", async (req, res) => {
    try{
        const inputValue = req.query.query;
        const page = req.query.page || 1;
        const results = await controller.getPhotos(inputValue, page);
        res.json(results);
    } catch(error){
        console.error("API call error:", error);
        res.status(500).json({ error: 'An error occurred while processing the request'});
    }
}) ;

export default router;