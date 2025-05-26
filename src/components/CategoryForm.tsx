import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// تعريف نوع التصنيف
interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  createdAt?: string;
}

const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [category, setCategory] = useState<Category>({
    id: 0,
    name: '',
    description: '',
    image: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetch(`http://localhost:3001/api/categories/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('فشل في جلب التصنيف');
          }
          return response.json();
        })
        .then(data => {
          setCategory(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching category:', error);
          toast.error(error.message);
          setLoading(false);
          navigate('/dashboard');
        });
    }
  }, [id, isEditing, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', category.name);
      formData.append('description', category.description);

      if (imageFile) {
        formData.append('mainImage', imageFile);
      }

      const url = isEditing
        ? `http://localhost:3001/api/categories/${id}`
        : 'http://localhost:3001/api/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ التصنيف');
      }

      toast.success(`تم ${isEditing ? 'تحديث' : 'إضافة'} التصنيف بنجاح!`);
      navigate('/dashboard?tab=categories');
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error((error as Error).message || 'حدث خطأ أثناء حفظ التصنيف');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'تعديل تصنيف' : 'إضافة تصنيف جديد'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-2">اسم التصنيف *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={category.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block font-medium mb-2">وصف التصنيف</label>
            <textarea
              id="description"
              name="description"
              value={category.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded h-32"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="image" className="block font-medium mb-2">صورة التصنيف</label>
            {category.image && (
              <div className="mb-2">
                <img 
                  src={`http://localhost:3001${category.image}`} 
                  alt="صورة التصنيف" 
                  className="w-32 h-32 object-cover border border-gray-300" 
                />
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
              accept="image/*"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard?tab=categories')}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded"
            disabled={submitting}
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                جاري الحفظ...
              </span>
            ) : (
              isEditing ? 'تحديث التصنيف' : 'إضافة التصنيف'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm; 