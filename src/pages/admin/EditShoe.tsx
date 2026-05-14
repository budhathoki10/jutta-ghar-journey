import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Loader2, Save, Trash2, X } from 'lucide-react';
import { fetchShoe, updateShoe } from '../../api/shoeApi';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { parseSizesInput } from '../../lib/utils';
import AuthContext from '../../context/AuthContext';
import { Button } from '../../components/ui/button';

type Gender = 'male' | 'female' | 'unisex';
type ImageItem = { url?: string; publicId?: string; progress?: number; name?: string };

type ShoeForm = {
  name: string;
  gender: Gender;
  subcategory: string;
  brand: string;
  branded: boolean;
  trending: boolean;
  description: string;
  price: string;
  sizes: string;
  images: ImageItem[];
};

const SUBCATS: Record<Gender, string[]> = {
  male: ['Slippers', 'Boots', 'Shoes', 'Branded'],
  female: ['Doctor Chappal', 'Slippers', 'Sport Shoes', 'Branded', 'Boots', 'Hills', 'Close Shoes'],
  unisex: ['Branded Shoes'],
};

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10';

const EditShoe: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);
  const [form, setForm] = useState<ShoeForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetchShoe(id)
      .then((res) => {
        const shoe = res.data;
        const gender = shoe.gender === 'kids' ? 'unisex' : shoe.gender || 'male';
        setForm({
          name: shoe.name || '',
          gender: gender as Gender,
          subcategory:
            shoe.subcategory && SUBCATS[gender as Gender].includes(shoe.subcategory)
              ? shoe.subcategory
              : SUBCATS[gender as Gender][0],
          brand: shoe.brand || '',
          branded: Boolean(shoe.branded),
          trending: Boolean(shoe.trending),
          description: shoe.description || '',
          price: shoe.price?.toString() || '',
          sizes: Array.isArray(shoe.sizes) ? shoe.sizes.join(', ') : '',
          images: Array.isArray(shoe.images) ? shoe.images : [],
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updateField = <K extends keyof ShoeForm>(field: K, value: ShoeForm[K]) => {
    setForm((current) => (current ? { ...current, [field]: value } : current));
  };

  const imageCount = useMemo(() => form?.images.filter((image) => image.url).length || 0, [form]);

  const uploadFile = async (file: File, index: number) => {
    try {
      const result = await uploadToCloudinary(file, (progress) => {
        setForm((current) => {
          if (!current) return current;
          const images = [...current.images];
          images[index] = { ...images[index], progress };
          return { ...current, images };
        });
      });

      setForm((current) => {
        if (!current) return current;
        const images = [...current.images];
        images[index] = {
          ...images[index],
          ...result,
          progress: 100,
          name: file.name,
        };
        return { ...current, images };
      });
    } catch (error) {
      setForm((current) => {
        if (!current) return current;
        const images = [...current.images];
        images[index] = { ...images[index], progress: -1, name: file.name };
        return { ...current, images };
      });

      console.error(error);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!form) return;

    const selected = files
      ? Array.from(files).filter((file) => file.type.startsWith('image/'))
      : [];

    if (!selected.length) return;

    const startIndex = form.images.length;

    setForm((current) =>
      current
        ? {
            ...current,
            images: [
              ...current.images,
              ...selected.map((file) => ({
                progress: 0,
                name: file.name,
              })),
            ],
          }
        : current
    );

    selected.forEach((file, index) => uploadFile(file, startIndex + index));
  };

  const removeImage = (index: number) => {
    setForm((current) =>
      current
        ? {
            ...current,
            images: current.images.filter((_, imageIndex) => imageIndex !== index),
          }
        : current
    );
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!id || !form) return;

    if (!form.name.trim()) return alert('Product name is required.');
    if (!form.images.some((image) => image.url)) {
      return alert('Please keep or upload at least one product image.');
    }

    setSaving(true);

    try {
      await updateShoe(id, {
        name: form.name.trim(),
        gender: form.gender,
        subcategory: form.subcategory,
        brand: form.brand.trim(),
        branded: form.branded,
        trending: form.trending,
        description: form.description.trim(),
        price: form.price ? Number(form.price) : undefined,
        sizes: form.sizes ? parseSizesInput(form.sizes) : [],
        images: form.images
          .filter((image) => image.url)
          .map((image) => ({
            url: image.url,
            publicId: image.publicId,
          })),
      });

      alert('Product updated successfully.');
      navigate('/admin/shoes');
    } catch (error) {
      console.error(error);
      alert('Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (!admin) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        Please log in to access the admin dashboard.
      </div>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </main>
    );
  }

  if (!form) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-lg font-semibold">Product not found.</p>
        <Button asChild className="mt-5 rounded-full">
          <Link to="/admin/shoes">Back to products</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <form onSubmit={submit} className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/admin/shoes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <Button
            type="submit"
            disabled={saving}
            className="rounded-full bg-zinc-950 px-8 hover:bg-zinc-800"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save changes
          </Button>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-zinc-950 text-white shadow-2xl">
          <div className="grid gap-6 p-8 lg:grid-cols-[1.4fr_0.6fr] lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
                Edit product
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Polish product details
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
                Update product information, price, brand, images, and visibility badges from one
                clean admin screen.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-zinc-300">Live images</p>
              <p className="mt-3 text-5xl font-bold">{imageCount}</p>
              <p className="mt-3 text-xs text-zinc-400">At least one image is required.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <h2 className="text-2xl font-bold text-slate-950">Product information</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-800">Product name</span>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-800">Customer group</span>
                <select
                  className={inputClass}
                  value={form.gender}
                  onChange={(e) => {
                    const selected = e.target.value as Gender;
                    updateField('gender', selected);
                    updateField('subcategory', SUBCATS[selected][0]);
                  }}
                >
                  <option value="male">Men</option>
                  <option value="female">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-800">Subcategory</span>
                <select
                  className={inputClass}
                  value={form.subcategory}
                  onChange={(e) => updateField('subcategory', e.target.value)}
                >
                  {SUBCATS[form.gender].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-800">Brand</span>
                <input
                  className={inputClass}
                  value={form.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-800">Price</span>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-800">Sizes</span>
                <input
                  className={inputClass}
                  value={form.sizes}
                  onChange={(e) => updateField('sizes', e.target.value)}
                  placeholder="Example: 38, 39, 40, 41"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-800">Description</span>
                <textarea
                  className={`${inputClass} min-h-32 resize-y`}
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </label>

              <div className="grid gap-3 md:col-span-2 sm:grid-cols-2">
                <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">Branded</span>
                    <span className="text-xs text-slate-500">Show branded badge</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={form.branded}
                    onChange={(e) => updateField('branded', e.target.checked)}
                    className="h-5 w-5 accent-zinc-950"
                  />
                </label>

                <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">Trending</span>
                    <span className="text-xs text-slate-500">Show in trending area</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={form.trending}
                    onChange={(e) => updateField('trending', e.target.checked)}
                    className="h-5 w-5 accent-zinc-950"
                  />
                </label>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Images</h3>
                <p className="mt-1 text-sm text-slate-500">Add, preview, or remove images.</p>
              </div>
              <ImagePlus className="h-6 w-6 text-slate-400" />
            </div>

            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-zinc-900 hover:bg-white">
              <ImagePlus className="h-8 w-8 text-slate-400" />
              <span className="mt-3 text-sm font-semibold text-slate-900">Upload more images</span>
              <span className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP accepted</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>

            <div className="mt-5 space-y-3">
              {form.images.length === 0 && (
                <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  No images available.
                </p>
              )}

              {form.images.map((image, index) => (
                <div
                  key={`${image.url || image.name}-${index}`}
                  className="flex gap-3 rounded-2xl border border-slate-200 p-3"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-100">
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={image.name || 'Product'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        {image.progress === -1 ? (
                          <X className="h-5 w-5 text-red-500" />
                        ) : (
                          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {image.name || `Image ${index + 1}`}
                    </p>

                    {typeof image.progress === 'number' &&
                      image.progress >= 0 &&
                      image.progress < 100 && (
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-zinc-950 transition-all"
                            style={{ width: `${image.progress}%` }}
                          />
                        </div>
                      )}

                    {image.progress === 100 && (
                      <p className="mt-2 text-xs font-medium text-emerald-600">Uploaded</p>
                    )}

                    {image.progress === -1 && (
                      <p className="mt-2 text-xs font-medium text-red-600">Upload failed</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </form>
    </main>
  );
};

export default EditShoe;