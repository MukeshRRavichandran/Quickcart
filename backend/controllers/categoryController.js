import Category from '../models/category.js';

// GET /api/categories  (public)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'Active' }).sort({ name: 1 });
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── Admin category CRUD ───────────────────────────────────────────────────────

// GET /api/categories/admin
export const getAdminCategories = async (req, res) => {
  try {
    return res.json(await Category.find({}).sort({ name: 1 }));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/categories/admin
export const createCategory = async (req, res) => {
  try {
    const { name, image, status } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Category already exists' });
    const category = await Category.create({ name, image: image || '', status: status || 'Active' });
    return res.status(201).json(category);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// PUT /api/categories/admin/:id
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (req.body.name)   category.name   = req.body.name;
    if (req.body.image)  category.image  = req.body.image;
    if (req.body.status) category.status = req.body.status;
    return res.json(await category.save());
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// DELETE /api/categories/admin/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.deleteOne();
    return res.json({ message: 'Category deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
