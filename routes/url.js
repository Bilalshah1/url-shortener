const express = require('express');
const router = express.Router();
const URL = require('../models/urls');
const { generateUniqueShortId , handleGetAnalytics} = require('../controllers/url');

router.post('/', generateUniqueShortId);
router.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: { visitHistory: { timestamp: Date.now() } }
        },
        { new: true }
    );
    res.redirect(entry.redirectUrl);

});
router.get('/analytics/:shortId', handleGetAnalytics);

router.post("/shorten", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortId = Math.random().toString(36).substring(2, 8);

  await URL.create({
    shortId,
    redirectUrl: url,
  });

  return res.redirect("/test"); // redirect to home page to show all URLs
});
module.exports = router;