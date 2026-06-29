/**
 * cleanup-duplicates.js — One-time script to remove duplicate bookmarks.
 *
 * Run:  node cleanup-duplicates.js
 *
 * For each (userId, url) pair it keeps the earliest bookmark and deletes the rest.
 */

const mongoose = require('mongoose');
const Bookmark = require('./models/Bookmark');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://vikesh:vikesh123@cluster0.c2e8nf3.mongodb.net/mydb';

async function main() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');

  // Group bookmarks by (userId, url) and find groups with more than 1 entry
  const duplicates = await Bookmark.aggregate([
    {
      $group: {
        _id: { userId: '$userId', url: '$url' },
        ids: { $push: '$_id' },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gt: 1 } } },
  ]);

  let totalRemoved = 0;

  for (const group of duplicates) {
    // Keep the first (oldest) id, delete the rest
    const [keep, ...remove] = group.ids;
    await Bookmark.deleteMany({ _id: { $in: remove } });
    totalRemoved += remove.length;
    console.log(`Cleaned ${remove.length} duplicate(s) for url: ${group._id.url}`);
  }

  console.log(`\nDone! Removed ${totalRemoved} duplicate bookmark(s).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
