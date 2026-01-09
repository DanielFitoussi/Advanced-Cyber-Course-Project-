const express = require('express')
const router = express.Router()
const userController = require('../controllers/user');
const authenticateToken = require('../middleware/auth');
const { getFriends } = require('../controllers/user');
const User = require('../models/user');





// נתיב רישום משתמש חדש
router.post('/register', userController.registerUser);

// נתיב התחברות משתמש קיים
router.post('/login', userController.loginUser);

// ניקוי משתמשים (לבדיקות)
router.delete('/clear', userController.clearUsers);

// שליחת בקשת חברות
router.post('/:id/send-friend-request', authenticateToken, userController.sendFriendRequest);

// אישור בקשת חברות
router.post('/:id/accept-friend-request', authenticateToken, userController.acceptFriendRequest);

// שליפת חברים
router.get('/friends', authenticateToken, userController.getFriends);


// החזרת האתגרים שנפתרו עבור המשתמש המחובר
router.get('/me/solved-challenges', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('solvedChallenges');

    res.json({
      solvedChallenges: user?.solvedChallenges || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch solved challenges' });
  }
});







module.exports = router;
