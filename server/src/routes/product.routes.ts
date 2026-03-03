import { Router } from 'express';
import productController from '../controllers/product.controller';

const router = Router();

// Stats must be before /:id to prevent matching as an ID
router.get('/stats', productController.getAnalytics);
router.post('/bulk-delete', productController.bulkDelete);
router.put('/bulk-update-stock', productController.bulkUpdateStock);

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);

// Dynamic ID routes
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
