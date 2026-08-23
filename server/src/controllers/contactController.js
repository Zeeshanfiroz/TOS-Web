import Contact from '../models/Contact.js';
import { sendEmail } from '../config/mailer.js';

/**
 * POST /api/contact
 * Public — saves message and notifies admins in the background.
 */
export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  const contact = await Contact.create({ name, email, message });

  // Background email to the club inbox — never blocks the response
  sendEmail(
    process.env.EMAIL_USER,
    'New Contact Form Message',
    `<h3>New message from the website</h3>
     <p><strong>Name:</strong> ${name}</p>
     <p><strong>Email:</strong> ${email}</p>
     <p><strong>Message:</strong></p>
     <p>${message}</p>`
  );

  res.status(201).json({
    success: true,
    message: 'Message sent! We will get back to you soon.',
  });
};

/**
 * GET /api/contact?status=new|resolved&page=1  (admin)
 */
export const getMessages = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [messages, total] = await Promise.all([
    Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Contact.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: messages,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

/**
 * PUT /api/contact/:id/status  (admin) — body: { status: "new" | "resolved" }
 */
export const updateMessageStatus = async (req, res) => {
  const { status } = req.body;
  if (!['new', 'resolved'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const message = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }
  res.json({ success: true, data: message });
};