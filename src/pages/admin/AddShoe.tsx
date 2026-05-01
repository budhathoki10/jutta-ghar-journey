import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createShoe } from '../../api/shoeApi';
import { uploadToCloudinary } from '../../lib/cloudinary';
import AuthContext from '../../context/AuthContext';

const SUBCATS: Record<string, string[]> = {
  male: ['Slipper', 'Sports', 'Boots', 'Formal', 'Casual'],
  female: ['Heels', 'Sports', 'Closed-toe', 'Boots', 'Flats', 'Casual'],
  kids: ['Sports', 'Casual', 'School'],
};

const AddShoe: React.FC = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male'|'female'|'kids'>('male');
  const [subcategory, setSubcategory] = useState('Slipper');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [sizes, setSizes] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploads, setUploads] = useState<Array<{ url?: string; publicId?: string; progress: number }>>([]);
  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);

  // Redirect if not admin
  if (!admin) {
    // Optionally could render a message or redirect to login; simple guard here
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
    setUploads(list.map(() => ({ progress: 0 })));
    // start uploads immediately
    list.forEach((file, idx) => doUpload(file, idx));
  };

  const doUpload = async (file: File, idx: number) => {
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const res = await uploadToCloudinary(file, { cloudName, uploadPreset }, (p) => {
        setUploads((u) => { const copy = [...u]; copy[idx] = { ...copy[idx], progress: p }; return copy; });
      });
      setUploads((u) => { const copy = [...u]; copy[idx] = { ...copy[idx], url: res.url, publicId: res.publicId, progress: 100 }; return copy; });
    } catch (err) {
      setUploads((u) => { const copy = [...u]; copy[idx] = { ...copy[idx], progress: -1 }; return copy; });
      console.error('Upload failed', err);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const images = uploads.filter(u => u.url).map(u => ({ url: u.url, publicId: u.publicId }));
    const payload = {
      name,
      gender,
      subcategory,
      description,
      price: price ? Number(price) : undefined,
      sizes: sizes ? sizes.split(',').map(s => Number(s.trim())).filter(Boolean) : [],
      images,
    };
    try {
      await createShoe(payload);
      alert('Shoe added');
      navigate('/admin/shoes');
    } catch (err) {
      console.error(err);
      alert('Failed to add shoe');
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Shoe</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Shoe name" value={name} onChange={e => setName(e.target.value)} required />
        <div className="flex gap-2">
          <select value={gender} onChange={e => { setGender(e.target.value as any); setSubcategory(SUBCATS[e.target.value][0]); }} className="p-2 border rounded">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="kids">Kids</option>
          </select>
          <select value={subcategory} onChange={e => setSubcategory(e.target.value)} className="p-2 border rounded">
            {SUBCATS[gender].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <textarea className="w-full p-2 border rounded" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <div className="flex gap-2">
          <input className="p-2 border rounded" placeholder="Price (optional)" value={price} onChange={e => setPrice(e.target.value)} />
          <input className="p-2 border rounded" placeholder="Sizes (comma separated)" value={sizes} onChange={e => setSizes(e.target.value)} />
        </div>

        <div>
          <label className="block mb-2">Images</label>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} />
          <div className="mt-4 grid grid-cols-2 gap-4">
            {uploads.map((u, i) => (
              <div key={i} className="border rounded p-2">
                {files[i] && <div className="mb-2 text-sm">{files[i].name}</div>}
                {u.url ? (
                  <img src={u.url} alt="uploaded" className="w-full h-32 object-cover rounded" />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-sm">Preview</div>
                )}
                <div className="mt-2">
                  {u.progress >= 0 && u.progress < 100 && <div className="text-sm">Uploading: {u.progress}%</div>}
                  {u.progress === 100 && <div className="text-sm text-green-600">Uploaded</div>}
                  {u.progress === -1 && <div className="text-sm text-red-600">Failed</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded">Save Shoe</button>
        </div>
      </form>
    </div>
  );
};

export default AddShoe;
