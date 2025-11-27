const Url = require('../models/urls');

let nanoid;

// Load nanoid ESM module inside an async initializer
(async () => {
    nanoid = (await import('nanoid')).nanoid;
})();

async function generateUniqueShortId(req, res) {
    if (!nanoid) {
        // if nanoid isn't ready yet (very rare), wait for import
        nanoid = (await import('nanoid')).nanoid;
    }

    const shortId = nanoid(8);
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    await Url.create({ shortId, redirectUrl: body.url, visitHistory: [] });
    res.json({ shortId });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const entry = await Url.findOne({ shortId });

    if (!entry) {
        return res.status(404).json({ error: 'Short ID not found' });
    }

    res.json({
        totalClicks: entry.visitHistory.length,
        visitHistory: entry.visitHistory
    });
}

module.exports = { generateUniqueShortId, handleGetAnalytics };
