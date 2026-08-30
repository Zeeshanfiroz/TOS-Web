import Project from '../models/Project.js';
import { uploadImage, deleteImage } from '../config/imagekit.js';

const parseTags = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value.map((tag) => String(tag).trim()).filter(Boolean);

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((tag) => String(tag).trim()).filter(Boolean);
  } catch {
    // fall through to comma-separated parsing
  }

  return String(value)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

export const getProjects = async (req, res) => {
  const { search = '', page = 1, limit = 9 } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { summary: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [projects, total] = await Promise.all([
    Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Project.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: projects,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  res.json({ success: true, data: project });
};

export const createProject = async (req, res) => {
  const { title, summary, description, category, status = 'active', featured = false } = req.body;

  const projectData = {
    title,
    summary,
    description,
    category,
    tags: parseTags(req.body.tags),
    status: ['active', 'completed'].includes(status) ? status : 'active',
    featured: Boolean(featured),
  };

  const uploadedFile = req.file || req.files?.image?.[0] || req.files?.banner?.[0];
  if (uploadedFile) {
    const bannerResult = await uploadImage(uploadedFile.buffer, uploadedFile.originalname, '/projects');
    projectData.banner = { url: bannerResult.url, fileId: bannerResult.fileId };
  }

  const extraFiles = req.files?.images || [];
  if (extraFiles.length) {
    const uploadedGallery = [];
    for (const file of extraFiles) {
      const result = await uploadImage(file.buffer, file.originalname, '/projects');
      uploadedGallery.push({ url: result.url, fileId: result.fileId });
    }
    projectData.gallery = uploadedGallery;
  }

  const project = await Project.create(projectData);
  res.status(201).json({ success: true, data: project });
};

export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const { title, summary, description, category, status, featured } = req.body;
  if (title) project.title = title;
  if (summary) project.summary = summary;
  if (description) project.description = description;
  if (category) project.category = category;
  if (req.body.tags) project.tags = parseTags(req.body.tags);
  if (status && ['active', 'completed'].includes(status)) project.status = status;
  if (featured !== undefined) project.featured = Boolean(featured);

  const uploadedFile = req.file || req.files?.image?.[0] || req.files?.banner?.[0];
  if (uploadedFile) {
    if (project.banner?.fileId) await deleteImage(project.banner.fileId);
    const bannerResult = await uploadImage(uploadedFile.buffer, uploadedFile.originalname, '/projects');
    project.banner = { url: bannerResult.url, fileId: bannerResult.fileId };
  }

  const extraFiles = req.files?.images || [];
  if (extraFiles.length) {
    const uploadedGallery = [];
    for (const file of extraFiles) {
      const result = await uploadImage(file.buffer, file.originalname, '/projects');
      uploadedGallery.push({ url: result.url, fileId: result.fileId });
    }
    project.gallery = [...(project.gallery || []), ...uploadedGallery];
  }

  await project.save();
  res.json({ success: true, data: project });
};

export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  if (project.banner?.fileId) await deleteImage(project.banner.fileId);
  if (project.gallery?.length) {
    for (const img of project.gallery) {
      if (img.fileId) await deleteImage(img.fileId);
    }
  }

  await project.deleteOne();
  res.json({ success: true, message: 'Project deleted' });
};
