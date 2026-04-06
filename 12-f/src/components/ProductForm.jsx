import React, { useState, useEffect } from 'react';
import { useGetCategories } from '../hooks/useGetCategories';

export const ProductForm = ({ product, onSubmit, onClose, loading }) => {
  const { categories } = useGetCategories();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    category: '',
    status: 'AVAILABLE',
    highlighted: false,
    profitRate: 1.21
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        quantity: product.quantity || '',
        description: product.description || '',
        category: product.category || '',
        status: product.status || 'AVAILABLE',
        highlighted: product.highlighted || false,
        profitRate: product.profitRate || 1.21
      });
      if(product.image) setPreview(product.image);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Usamos FormData para enviar el archivo
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('status', formData.status);
    data.append('highlighted', formData.highlighted);
    data.append('profitRate', formData.profitRate);
    
    if (image) {
      data.append('image', image);
    }

    onSubmit(data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="product-admin-form">
          <div className="form-grid">
            <div className="form-group full">
              <label>Imagen del Producto</label>
              <label className="file-uploader" htmlFor="file-input">
                <input 
                  id="file-input"
                  type="file" 
                  className="hidden-input" 
                  onChange={handleFileChange} 
                  accept="image/*"
                />
                {preview ? (
                  <div className="preview-container">
                    <img src={preview} alt="Preview" className="preview-image" />
                  </div>
                ) : (
                  <p>Haga clic para subir una imagen</p>
                )}
              </label>
            </div>

            <div className="form-group full">
              <label>Nombre del Producto</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Ej. Silla Gamer Pro"
              />
            </div>

            <div className="form-group">
              <label>Precio ($)</label>
              <input 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input 
                name="quantity" 
                type="number" 
                value={formData.quantity} 
                onChange={handleChange} 
                required 
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Seleccionar...</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="AVAILABLE">Disponible</option>
                <option value="NOT_AVAILABLE">No Disponible</option>
                <option value="DISCONTINUED">Descontinuado</option>
              </select>
            </div>

            <div className="form-group full">
              <label>Descripción</label>
              <textarea 
                name="description" 
                rows="3" 
                value={formData.description} 
                onChange={handleChange}
                placeholder="Detalles del producto..."
              ></textarea>
            </div>

            <div className="form-group">
              <label>Tasa de Ganancia (Ej. 1.21)</label>
              <input 
                name="profitRate" 
                type="number" 
                step="0.01"
                value={formData.profitRate} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  name="highlighted" 
                  type="checkbox" 
                  checked={formData.highlighted} 
                  onChange={handleChange} 
                />
                Producto Destacado
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
