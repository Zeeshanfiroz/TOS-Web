import User from '../models/User.js';

/**
 * GET /api/users?page=1&limit=20&search=...  (admin)
 * List all members.
 */
export const getUsers = async (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ joinedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('name email role avatar joinedAt'),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

/**
 * PUT /api/users/:id/role  (admin) — body: { role: "member" | "admin" }
 * Promote/demote a member. Admins cannot demote themselves.
 */
export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['member', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: "You can't change your own role" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('name email role');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: user });
};

/**
 * DELETE /api/users/:id  (admin)
 * Remove a member. Admins cannot delete themselves.
 */
export const deleteUser = async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: "You can't delete your own account" });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, message: 'User removed' });
};