import TeamMember from '../models/TeamMember.js';
import { uploadImage, deleteImage } from '../config/imagekit.js';

export const getTeamMembers = async (req, res) => {
  const { group = '', page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const query = group ? { group } : {};

  const [members, total] = await Promise.all([
    TeamMember.find(query).sort({ group: 1, order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
    TeamMember.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: members,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

export const createTeamMember = async (req, res) => {
  const { name, position, group = 'Core Team', bio = '', order = 0 } = req.body;

  if (!name || !position) {
    return res.status(400).json({ success: false, message: 'Name and position are required' });
  }

  const teamMemberData = {
    name: name.trim(),
    position: position.trim(),
    group: group.trim() || 'Core Team',
    bio: bio.trim(),
    order: Number(order || 0),
  };

  const uploadedFile = req.file || req.files?.image?.[0] || req.files?.photo?.[0];
  if (uploadedFile) {
    const result = await uploadImage(uploadedFile.buffer, uploadedFile.originalname, '/team');
    teamMemberData.photoUrl = result.url;
    teamMemberData.photoFileId = result.fileId;
  }

  const member = await TeamMember.create(teamMemberData);
  res.status(201).json({ success: true, data: member });
};

export const updateTeamMember = async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }

  const { name, position, group, bio, order } = req.body;
  if (name) member.name = name.trim();
  if (position) member.position = position.trim();
  if (group) member.group = group.trim();
  if (bio !== undefined) member.bio = bio.trim();
  if (order !== undefined) member.order = Number(order);

  const uploadedFile = req.file || req.files?.image?.[0] || req.files?.photo?.[0];
  if (uploadedFile) {
    if (member.photoFileId) await deleteImage(member.photoFileId);
    const result = await uploadImage(uploadedFile.buffer, uploadedFile.originalname, '/team');
    member.photoUrl = result.url;
    member.photoFileId = result.fileId;
  }

  await member.save();
  res.json({ success: true, data: member });
};

export const deleteTeamMember = async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }

  if (member.photoFileId) await deleteImage(member.photoFileId);
  await member.deleteOne();

  res.json({ success: true, message: 'Team member deleted' });
};
