import express from 'express';
import { Router } from 'express';
import path from 'path';
import { processImage } from './imageProcessor';

const app = express();
const router = Router();
const port = process.env.PORT || 3000;

app.use(express.json());

router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

router.post('/process', async (req, res) => {
    try {
        if (!req.body.imagePath) {
            return res.status(400).json({
                success: false,
                error: 'Image path is required'
            });
        }
        const result = await processImage(req.body.imagePath);
        res.json({
            success: true,
            result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.use('/api', router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
