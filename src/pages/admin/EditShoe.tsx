import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchShoe, updateShoe } from '@/api/shoeApi';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { parseSizesInput } from '@/lib/utils';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const CATEGORY_OPTIONS: Record<string, string[]> = {
  male: ['Doctor Chappal', 'Sports Shoes', 'Closed Shoes', 'Sandals', 'Boots', 'Casual', 'Formal'],
  female: ['Doctor Chappal', 'Sports Shoes', 'Closed Shoes', 'Sandals', 'Heels', 'Boots', 'Casual'],
};

const EditShoe = () => {
  const { admin } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [shoe, setShoe] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [subcategory, setSubcategory] = useState('Doctor Chappal');
  const [brand, setBrand] = useState('');
  const [branded, setBranded] = useState(false);
  const [trending, setTrending] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [sizes, setSizes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploads, setUploads] = useState<Array<{ url?: string; publicId?: string; progress: number }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    if (!id) return;

    fetchShoe(id)
      .then((res) => {
        const data = res.data;
        setShoe(data);
        setName(data.name || '');
        setGender(data.gender || 'male');
        setSubcategory(data.subcategory || CATEGORY_OPTIONS['male'][0]);
        setBrand(data.brand || '');
        setBranded(Boolean(data.branded));
        setTrending(Boolean(data.trending));
        setDescription(data.description || '');
        setPrice(data.price?.toString() || '');
        setSizes((data.sizes || []).join(', '));
        setUploads((data.images || []).map((image: any) => ({ url: image.url, publicId: image.publicId, progress: 100 })));
      })
      .catch((err) => {
        console.error('Failed to load product:', err);
      });
  }, [admin, id, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    if (!list.length) return;
    setFiles(list);
    setUploads(list.map(() => ({ progress: 0 })));
    list.forEach((file, idx) => doUpload(file, idx));
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setUploads((prev) => prev.filter((_, idx) => idx !== index));
  };

  const doUpload = async (file: File, idx: number) => {
    try {
      const res = await uploadToCloudinary(file, (progress) => {
        setUploads((current) => {
          const updated = [...current];
          updated[idx] = { ...updated[idx], progress };
          return updated;
        });
      });
      setUploads((current) => {
        const updated = [...current];
        updated[idx] = { ...updated[idx], url: res.url, publicId: res.publicId, progress: 100 };
        return updated;
      });
    } catch (err) {
      setUploads((current) => {
        const updated = [...current];
        updated[idx] = { ...updated[idx], progress: -1 };
        return updated;
      });
      console.error('Upload failed', err);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!name.trim()) {
      alert('Please enter the product name.');
      return;
    }

    const images = uploads.filter((upload) => upload.url).map((upload) => ({ url: upload.url!, publicId: upload.publicId }));
    const payload = {
      name: name.trim(),
      gender,
      subcategory,
      brand: brand.trim(),
      branded,
      trending,
      description: description.trim(),
      sizes: sizes ? parseSizesInput(sizes) : [],
      images,
    };

    setIsSubmitting(true);
    try {
      await updateShoe(id, payload);
      alert('Product updated successfully.');
      navigate('/admin/shoes');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update product. See console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!admin) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center text-foreground/80">
        <p>Please log in to access the admin dashboard.</p>
      </div>
    );
  }

  if (!shoe) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center text-foreground/80">
        <p>Loading product details…</p>
      </div>
    );
  }

  const categories = CATEGORY_OPTIONS[gender];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Admin product update</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Edit product: {shoe.name}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/80">
          Update product details, pricing, and images with confidence. Uploaded images remain stored in Cloudinary and can be refreshed as needed.
        </p>
      </div>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Product name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Classic Leather Heel"
              className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">Product category</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="male">Men</option>
                <option value="female">Women</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">Subcategory</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">Brand</label>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Brand name"
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col justify-between gap-3 sm:col-span-1">
              <label className="block text-sm font-semibold text-foreground">Product flags</label>
              <div className="grid gap-3">
                <label className="flex items-center gap-3 rounded-3xl border border-border bg-background px-4 py-3 text-sm">
                  <input type="checkbox" checked={branded} onChange={(e) => setBranded(e.target.checked)} className="h-4 w-4 rounded border-border text-primary accent-primary" />
                  Branded product
                </label>
                <label className="flex items-center gap-3 rounded-3xl border border-border bg-background px-4 py-3 text-sm">
                  <input type="checkbox" checked={trending} onChange={(e) => setTrending(e.target.checked)} className="h-4 w-4 rounded border-border text-primary accent-primary" />
                  Featured as trending
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Write a short product description"
              className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">Price</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 2499"
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">Available sizes</label>
              <input
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="38-42 or 38, 39, 40"
                className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <p className="mt-2 text-xs text-muted-foreground">Use a range like <span className="font-semibold">39-42</span> or comma-separated values.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="rounded-3xl border border-border bg-background p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Product preview</p>
            <p className="mt-2 text-sm text-foreground/75">
              Review existing images and freshly uploaded media before saving changes.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {uploads.length > 0 ? (
                uploads.slice(0, 4).map((upload, index) => (
                  <div key={index} className="overflow-hidden rounded-3xl bg-slate-100">
                    {upload.url ? (
                      <img src={upload.url} alt={`Preview ${index + 1}`} className="h-28 w-full object-cover" />
                    ) : (
                      <div className="flex h-28 items-center justify-center text-sm text-foreground/70">Preparing preview…</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground">
                  No images available yet.
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Image gallery</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">Manage product images</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">JPEG / PNG</span>
          </div>

          <label className="block rounded-3xl border border-dashed border-border bg-background px-4 py-6 text-center transition hover:border-primary/80 hover:bg-primary/5">
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
            <div className="space-y-3">
              <p className="text-lg font-semibold">Choose replacement images</p>
              <p className="text-sm text-foreground/70">Add more product photos or replace existing ones.</p>
            </div>
          </label>

          {uploads.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {uploads.map((upload, index) => (
                <div key={index} className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm max-w-sm">
                  <div className="relative aspect-square bg-slate-100">
                    {upload.url ? (
                      <img src={upload.url} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-foreground/70">Preparing preview…</div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="border-t border-border px-4 py-3">
                    <div className="flex items-center justify-between text-sm text-foreground/80">
                      <span>{files[index]?.name || `Image ${index + 1}`}</span>
                      <span>{upload.progress === 100 ? 'Done' : upload.progress === -1 ? 'Failed' : `${upload.progress}%`}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${upload.progress === -1 ? 'bg-destructive' : 'bg-primary'}`}
                        style={{ width: `${Math.max(0, Math.min(100, upload.progress))}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 rounded-3xl border border-border bg-slate-50 p-4 text-sm text-foreground/80">
            <p className="font-semibold text-foreground">Editor notes</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Existing images are displayed above; use Remove to clear them.</li>
              <li>New uploads will replace or add to the gallery.</li>
              <li>Make sure the product has at least one image before saving.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button type="submit" disabled={isSubmitting} className="w-full rounded-full px-6 py-3">
              {isSubmitting ? 'Saving changes…' : 'Save changes'}
            </Button>
            <Button type="button" variant="outline" className="w-full rounded-full px-6 py-3" onClick={() => navigate('/admin/shoes')}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditShoe;
